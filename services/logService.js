const EventUpdateLog = require('../models/eventUpdateLogModel');
const { fromUtc } = require('./timezoneService');

// Save a log entry when an event is updated
const createLog = async ({ eventId, updatedByProfileId, updatedByTimezone, changes }) => {
	console.log(' logService.createLog called with:', {
		eventId,
		updatedByProfileId,
		updatedByTimezone,
		changesCount: changes?.length,
		changes
	});

	if (!updatedByProfileId) {
		console.error('ERROR: updatedByProfileId is required but was not provided!');
		throw new Error('updatedByProfileId is required for logging');
	}

	const log = new EventUpdateLog({
		eventId,
		updatedByProfileId,
		updatedByTimezone,
		updatedAtUtc: new Date(),
		changes
	});

	console.log('Saving log to database...');
	const savedLog = await log.save();
	console.log('Log saved successfully with ID:', savedLog._id);
	
	return savedLog;
};

// Get all the update history for an event
const getEventLogs = async (eventId, requestTz = 'UTC') => {
	console.log('logService.getEventLogs - Searching for logs:', {
		eventId,
		requestTz
	});

	const logs = await EventUpdateLog.find({ eventId })
		.populate('updatedByProfileId', 'name')
		.sort({ updatedAtUtc: -1 });

	console.log('Found logs in database:', logs.length);
	
	if (logs.length > 0) {
		console.log('Sample log:', logs[0]);
	}

	// Convert timestamps to the viewer's timezone
	const result = logs.map((log) => ({
		...log.toObject(),
		updatedAtLocal: fromUtc(log.updatedAtUtc, requestTz)
	}));

	console.log('Returning logs:', result.length);
	return result;
};

module.exports = {
	createLog,
	getEventLogs
};



