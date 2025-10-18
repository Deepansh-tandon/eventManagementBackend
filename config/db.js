const mongoose = require('mongoose');
const { mongoUri } = require('./env');

const connect = async () => {
	try {
		await mongoose.connect(mongoUri, {
			serverSelectionTimeoutMS: 5000
		});
		console.log('MongoDB connected successfully');
	} catch (err) {
		console.error('MongoDB connection error:', err.message);
		console.log('Starting server without MongoDB connection...');
	}
};

mongoose.connection.on('disconnected', () => {
	console.log('MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
	console.error('MongoDB error:', err.message);
});

module.exports = { connect };

