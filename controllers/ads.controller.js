const Ad = require('../models/ad.model');
const getImageFileType = require('../utils/getImageFileType');
const fs = require('fs');

exports.getAllAds = async (req, res) => {
	try {
		res.json(await Ad.find().populate('user'));
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

exports.getAdById = async (req, res) => {
	try {
		const adId = await Ad.findOne({ _id: req.params.id }).populate('user');
		if (!adId) res.status(404).json({ message: 'Not found...' });
		else res.json(adId);
	} catch (err) {
		res.status(500).send({ message: err.message });
	}
};

exports.createNewAd = async (req, res) => {
	try {
		const fileType = req.file ? await getImageFileType(req.file) : 'unknown';
		const imageExtensions = ['image/png', 'image/jpeg', 'image/gif'];
		const { title, content, date, price, location } = req.body;

		if (title.length > 10 &&
			title.length < 50 &&
			content.length > 20 &&
			content.length < 1000 &&
			imageExtensions.includes(fileType)) {
			const ad = new Advert({
				title,
				content,
				date,
				photo: req.file.filename,
				price,
				location,
				user: req.session.userId
			});
			await ad.save();
			res.json(ad);
		} else {
			fs.unlinkSync(`./public/uploads//${req.file.filename}`);
			res.status(500).json({ message: 'Title or content have wrong amount of characters' });
		}
	}
	catch (err) {
		res.status(500).json({ message: err });
	}
};

exports.editAd = async (req, res) => {
	try {
		const { title, content, date, price, location } = req.body;
		const photo = req.file;
		const fileType = photo ? await getImageFileType(photo) : 'unknown'
		const ad = await Ad.findById(req.params.id);
		if (ad) {
			ad.title = title;
			ad.content = content;
			ad.date = date,
				ad.price = price;
			ad.location = location;
			if (photo && ['image/png', 'image/jpeg', 'image/gif'].includes(fileType)) {
				ad.photo = photo.filename;
			}
			await ad.save();
			res.json({ message: 'Edited ad' });
		} else {
			fs.unlinkSync(`./public/uploads/${photo.filename}`);
			res.status(400).send({ message: 'Bad request' });
		}
	} catch (err) {
		res.status(500).send({ message: err.message });
	}
};

exports.removeAd = async (req, res) => {
	try {
		const ad = await Ad.findById(req.params.id);
		if (ad) {
			fs.unlinkSync(`./public/uploads/${ad.photo}`);
			await ad.deleteOne({ _id: req.params.id });
			res.json({ message: 'Ad deleted' });
		} else res.status(404).send({ message: 'Not found...' });
	} catch (err) {
		res.status(500).send({ message: err.message });
	}
};

exports.searchPhrase = async (req, res) => {
	const { searchPhrase } = req.params;
	try {
		const ad = await Ad.find({ title: { $regex: searchPhrase } });
		if (!ad) return res.status(404).json({ message: 'Bot found...' });
		else res.json(ad);
	} catch (err) {
		res.status(500).send({ message: err.message });
	}
};