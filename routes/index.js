const express = require('express');
const profileRoute = require('./profileRoute');
const eventRoute = require('./eventRoute');
const assignmentRoute = require('./assignmentRoute');
const logRoute = require('./logRoute');

module.exports = () => {
	const router = express.Router();

	router.use('/profiles', profileRoute);
	router.use('/events', eventRoute);
	router.use('/assignments', assignmentRoute);
	router.use('/logs', logRoute);

	return router;
};





