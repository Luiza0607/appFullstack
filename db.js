const mongoose = require('mongoose');

const connectToDB = () => {

	const NODE_ENV = process.env.NODE_ENV;
	console.log('Node', NODE_ENV);
	if (NODE_ENV === "production")
		dbatlas = 'mongodb+srv://user132:ence132@kodillaapp.o6udmwk.mongodb.net/?retryWrites=true&w=majority';
	else if (NODE_ENV === "test") dbatlas = "mongodb://localhost:27017/adsDBtest";
	else dbatlas = "mongodb://localhost:27017/adsDB";

	// connects our backend code with the database
	mongoose.connect(dbatlas, {
		useNewUrlParser: true,
	});
	const db = mongoose.connection;

	db.once("open", () => {
		console.log("Connected to the database");
	});

	db.on("error", (err) => console.log("Error " + err));
};

module.exports = connectToDB;