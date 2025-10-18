const assignmentService = require('../services/assignmentService');

const assignProfiles = async (req, res, next) => {
	try {
		const { eventId, profileIds } = req.body;
		const assignments = await assignmentService.assignProfiles(eventId, profileIds);
		res.status(200).json({ success: true, data: assignments });
	} catch (err) {
		next(err);
	}
};

const unassignProfiles = async (req, res, next) => {
	try {
		const { eventId, profileIds } = req.body;
		const result = await assignmentService.unassignProfiles(eventId, profileIds);
		res.status(200).json({ success: true, data: result });
	} catch (err) {
		next(err);
	}
};

const getProfilesByEvent = async (req, res, next) => {
	try {
		const profiles = await assignmentService.getProfilesByEvent(req.params.eventId);
		res.status(200).json({ success: true, data: profiles });
	} catch (err) {
		next(err);
	}
};

const getEventsByProfile = async (req, res, next) => {
	try {
		const events = await assignmentService.getEventsByProfile(req.params.profileId);
		res.status(200).json({ success: true, data: events });
	} catch (err) {
		next(err);
	}
};

module.exports = {
	assignProfiles,
	unassignProfiles,
	getProfilesByEvent,
	getEventsByProfile
};



