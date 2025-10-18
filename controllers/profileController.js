const profileService = require('../services/profileServices');

const createProfile = async (req, res, next) => {
	try {
		const profile = await profileService.createProfile(req.body);
		res.status(201).json({ success: true, data: profile });
	} catch (err) {
		next(err);
	}
};

const listProfiles = async (req, res, next) => {
	try {
		const profiles = await profileService.listProfiles();
		res.status(200).json({ success: true, data: profiles });
	} catch (err) {
		next(err);
	}
};

const getProfile = async (req, res, next) => {
	try {
		const profile = await profileService.getProfile(req.params.id);
		res.status(200).json({ success: true, data: profile });
	} catch (err) {
		next(err);
	}
};

const updateTimezone = async (req, res, next) => {
	try {
		const profile = await profileService.updateTimezone(req.params.id, req.body.timezone);
		res.status(200).json({ success: true, data: profile });
	} catch (err) {
		next(err);
	}
};

module.exports = {
	createProfile,
	listProfiles,
	getProfile,
	updateTimezone
};





