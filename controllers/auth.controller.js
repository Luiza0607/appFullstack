const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const getImageFileType = require('../utils/getImageFileType');
const fs = require('fs');

exports.register = async (req, res) => {
	try {
		const { login, password, phone } = req.body;
		const avatar = req.file;
		const fileType = avatar ? await getImageFileType(avatar) : 'unknown';

		if (
			login && typeof login === 'string' &&
			password && typeof password === 'string' &&
			avatar && ['image/png', 'image/jpeg', 'image/gif'].includes(fileType) &&
			phone && typeof phone === 'string'
		) {
			const userWithLogin = await User.findOne({ login });

			if (userWithLogin) {
				fs.unlinkSync(`./public/uploads/${avatar.filename}`);
				return res.status(409).send({ message: 'User with this login already exist' });
			}

			const user = await User.create({ login, password: await bcrypt.hash(password, 10), avatar: avatar.filename, phone });
			res.status(200).send({ message: 'User created ' + user.login });

		} else {
			fs.unlinkSync(`./public/uploads/${avatar.filename}`);
			res.status(400).send({ message: 'Bad request' });
		}

	} catch (err) {
		res.status(500).send({ message: err.message }); 
	}
};

exports.login = async (req, res) => {
	try {
		const { login, password } = req.body;

		if (login && typeof login === 'string' && password && typeof password === 'string') {
			const user = await User.findOne({ login });

			if (!user) {
				res.status(400).send({ message: 'Login or password is incorrect' });
			} else {

				if (bcrypt.compareSync(password, user.password)) {
					const userData = { login: user.login, id: user._id };
					req.session.login = userData;
					req.session.user = user.id;
					res.status(200).send({ message: 'Login successful' });
				} else {
					res.status(400).send({ message: 'Login or password is incorrect' });
				}

			}

		} else {
			res.status(400).send({ message: 'Bad request' });
		}

	} catch (err) {
		res.status(500).send({ message: err.message });
	}
};

exports.getUser = async (req, res) => {
	try {
		res.send({ message: 'Yeah! I\'m logged' });
	} catch (err) {
		res.status(500).send({ message: err.message });
	}
};

exports.logout = async (req, res) => {
	try {
		req.session.destroy();
		res.status(200).send({ message: 'I\'m logout' });
	} catch (err) {
		res.status(500).send({ message: err.message });
	}
};

exports.getUserByLogin = async (req, res) => {
	try {
		const user = await User.findOne({ login: req.params.login });
		if (!user) return res.status(404).json({ message: 'User not found...' });
		else res.json(user);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};