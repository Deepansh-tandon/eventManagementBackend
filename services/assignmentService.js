const EventAssignment = require('../models/eventAssignmentModel');
const cache = require('./cacheService');

const assignProfiles = async (eventId, profileIds) => {
	// Remove duplicates using Set - way faster than nested loops
	const uniqueProfileIds = [...new Set(profileIds)];

	const assignments = uniqueProfileIds.map((profileId) => ({
		eventId,
		profileId,
		assignedAt: new Date()
	}));

	// Insert all at once, skip duplicates if they already exist
	const result = await EventAssignment.insertMany(assignments, { ordered: false }).catch((err) => {
		if (err.code === 11000) {
			return err.insertedDocs || []; // Already assigned, no worries
		}
		throw err;
	});

	// Clear cache so fresh data gets loaded next time
	cache.invalidate(`profiles:${eventId}`);
	cache.invalidatePattern(`events:`);

	return result;
};

// Remove profiles from an event
const unassignProfiles = async (eventId, profileIds) => {
	const uniqueProfileIds = [...new Set(profileIds)];

	const result = await EventAssignment.deleteMany({
		eventId,
		profileId: { $in: uniqueProfileIds }
	});

	// Clear cache after removing assignments
	cache.invalidate(`profiles:${eventId}`);
	cache.invalidatePattern(`events:`);

	return result;
};

// Get all profiles assigned to an event
const getProfilesByEvent = async (eventId) => {
	const cacheKey = `profiles:${eventId}`;
	const cached = cache.get(cacheKey);

	if (cached) {
		return cached; // O(1) cache hit
	}

	// Cache miss: Query database
	const assignments = await EventAssignment.find({ eventId }).populate('profileId');
	const profiles = assignments.map((a) => a.profileId);

	cache.set(cacheKey, profiles); // Save for next time
	return profiles;
};

// Get all events assigned to a profile
const getEventsByProfile = async (profileId) => {
	const cacheKey = `events:${profileId}`;
	const cached = cache.get(cacheKey);

	if (cached) {
		return cached; // Cache hit!
	}

	// Fetch from database if not cached
	const assignments = await EventAssignment.find({ profileId }).populate('eventId');
	const events = assignments.map((a) => a.eventId);

	cache.set(cacheKey, events);
	return events;
};

// Get just the profile IDs (lighter query, no extra data)
const getProfileIdsByEvent = async (eventId) => {
	const cacheKey = `profileIds:${eventId}`;
	const cached = cache.get(cacheKey);

	if (cached) {
		return cached; // Already cached
	}

	// Only select profileId field to save bandwidth
	const assignments = await EventAssignment.find({ eventId }).select('profileId');
	const profileIds = assignments.map((a) => a.profileId);

	cache.set(cacheKey, profileIds);
	return profileIds;
};

module.exports = {
	assignProfiles,
	unassignProfiles,
	getProfilesByEvent,
	getEventsByProfile,
	getProfileIdsByEvent
};



