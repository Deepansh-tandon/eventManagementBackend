const Event = require('../models/eventModel');
const EventAssignment = require('../models/eventAssignmentModel');
const { toUtc, fromUtc } = require('./timezoneService');
const assignmentService = require('./assignmentService');
const logService = require('./logService');
const cache = require('./cacheService');

// Create a new event and assign it to profiles
const createEvent = async ({ title, description, timezone, startLocalIso, endLocalIso, profileIds, createdByProfileId }) => {
	// Convert the local time to UTC for storage
	const startAtUtc = toUtc(startLocalIso, timezone);
	const endAtUtc = toUtc(endLocalIso, timezone);

	// Make sure end time is actually after start time
	if (endAtUtc <= startAtUtc) {
		const error = new Error('End time must be after start time');
		error.status = 422;
		error.code = 'INVALID_TIME_RANGE';
		throw error;
	}

	// Save the event to database
	const event = new Event({
		title,
		description,
		startAtUtc,
		endAtUtc,
		createdByProfileId,
		createdByTimezone: timezone
	});
	await event.save();

	// Link the event to the selected profiles
	await assignmentService.assignProfiles(event._id, profileIds);

	return event;
};

// Get all events for a profile, converted to their timezone
const getEventsForProfile = async (profileId, requestTz = 'UTC') => {
	const cacheKey = `events:profile:${profileId}:${requestTz}`;
	const cached = cache.get(cacheKey);

	if (cached) {
		return cached; // Got it from cache!
	}

	// Find which events are assigned to this profile
	const assignments = await EventAssignment.find({ profileId }).select('eventId');
	const eventIds = assignments.map((a) => a.eventId);

	// Fetch all those events in one go
	const events = await Event.find({ _id: { $in: eventIds } }).sort({ startAtUtc: 1 });

	// Add timezone-converted times to each event
	const result = events.map((event) => ({
		...event.toObject(),
		startLocal: fromUtc(event.startAtUtc, requestTz),
		endLocal: fromUtc(event.endAtUtc, requestTz)
	}));

	cache.set(cacheKey, result);
	return result;
};

// Get a single event and convert its times to the requested timezone
const getEvent = async (eventId, requestTz = 'UTC') => {
	const event = await Event.findById(eventId);
	if (!event) {
		const error = new Error('Event not found');
		error.status = 404;
		error.code = 'EVENT_NOT_FOUND';
		throw error;
	}

	return {
		...event.toObject(),
		startLocal: fromUtc(event.startAtUtc, requestTz),
		endLocal: fromUtc(event.endAtUtc, requestTz)
	};
};

// Update an event and track what changed for the logs
const updateEvent = async (eventId, updates, updatedByProfileId, updatedByTimezone) => {
	const event = await Event.findById(eventId);
	if (!event) {
		const error = new Error('Event not found');
		error.status = 404;
		error.code = 'EVENT_NOT_FOUND';
		throw error;
	}

	// Track what fields actually changed
	const changes = [];

	console.log('🔍 Checking for changes:', {
		receivedUpdates: updates,
		currentEventData: {
			title: event.title,
			description: event.description,
			startAtUtc: event.startAtUtc,
			endAtUtc: event.endAtUtc
		}
	});

	// Check if title or description changed
	const simpleFields = ['title', 'description'];
	for (const field of simpleFields) {
		if (updates[field] !== undefined && updates[field] !== event[field]) {
			console.log(`✏️ Field "${field}" changed:`, { 
				from: event[field], 
				to: updates[field] 
			});
			changes.push({ field, previous: event[field], next: updates[field] });
			event[field] = updates[field];
		} else if (updates[field] !== undefined) {
			console.log(`⏭️ Field "${field}" unchanged:`, event[field]);
		}
	}

	// Check if start/end times changed
	const tz = updates.timezone || updatedByTimezone || 'UTC';
	if (updates.startLocalIso) {
		const newStart = toUtc(updates.startLocalIso, tz);
		console.log('🕐 Checking startTime:', {
			received: updates.startLocalIso,
			converted: newStart.toISOString(),
			current: event.startAtUtc.toISOString(),
			matches: newStart.getTime() === event.startAtUtc.getTime()
		});
		if (newStart.getTime() !== event.startAtUtc.getTime()) {
			console.log('✏️ Start time changed');
			changes.push({ field: 'startAtUtc', previous: event.startAtUtc.toISOString(), next: newStart.toISOString() });
			event.startAtUtc = newStart;
		}
	}

	if (updates.endLocalIso) {
		const newEnd = toUtc(updates.endLocalIso, tz);
		console.log('🕐 Checking endTime:', {
			received: updates.endLocalIso,
			converted: newEnd.toISOString(),
			current: event.endAtUtc.toISOString(),
			matches: newEnd.getTime() === event.endAtUtc.getTime()
		});
		if (newEnd.getTime() !== event.endAtUtc.getTime()) {
			console.log('✏️ End time changed');
			changes.push({ field: 'endAtUtc', previous: event.endAtUtc.toISOString(), next: newEnd.toISOString() });
			event.endAtUtc = newEnd;
		}
	}

	// Double check end is still after start
	if (event.endAtUtc <= event.startAtUtc) {
		const error = new Error('End time must be after start time');
		error.status = 422;
		error.code = 'INVALID_TIME_RANGE';
		throw error;
	}

	event.updatedByProfileId = updatedByProfileId;
	event.updatedByTimezone = updatedByTimezone;
	await event.save();

	// Add or remove profile assignments
	if (updates.addProfileIds && updates.addProfileIds.length > 0) {
		console.log('➕ Adding profiles:', updates.addProfileIds);
		await assignmentService.assignProfiles(eventId, updates.addProfileIds);
		changes.push({ field: 'addProfileIds', previous: null, next: updates.addProfileIds });
	}

	if (updates.removeProfileIds && updates.removeProfileIds.length > 0) {
		console.log('➖ Removing profiles:', updates.removeProfileIds);
		await assignmentService.unassignProfiles(eventId, updates.removeProfileIds);
		changes.push({ field: 'removeProfileIds', previous: null, next: updates.removeProfileIds });
	}

	// Save a log entry if anything changed
	if (changes.length > 0) {
		console.log('📝 Creating log with:', {
			eventId,
			updatedByProfileId,
			updatedByTimezone,
			changesCount: changes.length,
			changes: changes
		});
		
		try {
			await logService.createLog({
				eventId,
				updatedByProfileId,
				updatedByTimezone,
				changes
			});
			console.log('✅ Log created successfully');
		} catch (logError) {
			console.error('❌ Failed to create log:', logError);
			// Logging failed but that's okay, don't fail the whole update
		}
	} else {
		console.log('⚠️ No changes detected, skipping log creation');
	}

	// Clear cache so everyone gets fresh data
	cache.invalidatePattern(`events:`);
	cache.invalidate(`event:${eventId}`);

	return event;
};

// Delete an event and clean up all related data
const deleteEvent = async (eventId) => {
	const event = await Event.findByIdAndDelete(eventId);
	if (!event) {
		const error = new Error('Event not found');
		error.status = 404;
		error.code = 'EVENT_NOT_FOUND';
		throw error;
	}

	// Also delete all profile assignments for this event
	await EventAssignment.deleteMany({ eventId });

	// Clear all related cache entries
	cache.invalidatePattern(`events:`);
	cache.invalidatePattern(`profiles:`);
	cache.invalidate(`event:${eventId}`);

	return event;
};

module.exports = {
	createEvent,
	getEventsForProfile,
	getEvent,
	updateEvent,
	deleteEvent
};



