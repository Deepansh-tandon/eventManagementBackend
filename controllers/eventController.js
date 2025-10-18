const eventService = require('../services/eventService');

const createEvent = async (req, res, next) => {
	try {
		const event = await eventService.createEvent(req.body);
		res.status(201).json({ success: true, data: event });
	} catch (err) {
		next(err);
	}
};

const getEventsForProfile = async (req, res, next) => {
	try {
		const { profileId, tz } = req.query;
		const events = await eventService.getEventsForProfile(profileId, tz);
		res.status(200).json({ success: true, data: events });
	} catch (err) {
		next(err);
	}
};

const getEvent = async (req, res, next) => {
	try {
		const tz = req.query.tz || 'UTC';
		const event = await eventService.getEvent(req.params.id, tz);
		res.status(200).json({ success: true, data: event });
	} catch (err) {
		next(err);
	}
};

const updateEvent = async (req, res, next) => {
	try {
		const { id } = req.params;
		const updates = req.body;
		const requestTz = req.query.tz; // Get timezone for response conversion

		console.log('🔄 Update Event Request - RAW BODY:', JSON.stringify(req.body, null, 2));

		const updatedByProfileId = updates.updatedByProfileId 
		const updatedByTimezone = updates.timezone || req.headers['x-timezone'] || 'UTC';

		console.log('🔄 Update Event Request:', {
			eventId: id,
			updatedByProfileId,
			updatedByTimezone,
			requestTz,
			updates: Object.keys(updates),
			fullUpdates: updates
		});

		if (!updatedByProfileId) {
			console.error('❌ CRITICAL: No updatedByProfileId provided! Logs will fail.');
			console.error('Request body was:', updates);
		}

		const event = await eventService.updateEvent(id, updates, updatedByProfileId, updatedByTimezone);
		
		// If requestTz is provided, return timezone-converted data
		if (requestTz) {
			const eventWithTz = await eventService.getEvent(id, requestTz);
			res.status(200).json({ success: true, data: eventWithTz });
		} else {
			res.status(200).json({ success: true, data: event });
		}
	} catch (err) {
		next(err);
	}
};

const deleteEvent = async (req, res, next) => {
	try {
		const event = await eventService.deleteEvent(req.params.id);
		res.status(200).json({ success: true, data: event });
	} catch (err) {
		next(err);
	}
};

module.exports = {
	createEvent,
	getEventsForProfile,
	getEvent,
	updateEvent,
	deleteEvent
};



