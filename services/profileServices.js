const Profile = require('../models/profileModel');

// Create a new profile with a name and timezone
const createProfile = async ({ name, timezone = 'UTC' }) => {
	const profile = new Profile({ name, timezone });
	await profile.save();
	return profile;
};

// Get all profiles, newest first
const listProfiles = async () => {
	return await Profile.find().sort({ createdAt: -1 });
};

// Find a profile by its ID
const getProfile = async (id) => {
	const profile = await Profile.findById(id);
	if (!profile) {
		const error = new Error('Profile not found');
		error.status = 404;
		error.code = 'PROFILE_NOT_FOUND';
		throw error;
	}
	return profile;
};

// Change a profile's timezone setting
const updateTimezone = async (id, timezone) => {
	const profile = await Profile.findByIdAndUpdate(
		id,
		{ timezone },
		{ new: true, runValidators: true }
	);
	if (!profile) {
		const error = new Error('Profile not found');
		error.status = 404;
		error.code = 'PROFILE_NOT_FOUND';
		throw error;
	}
	return profile;
};

module.exports = {
	createProfile,
	listProfiles,
	getProfile,
	updateTimezone
};





