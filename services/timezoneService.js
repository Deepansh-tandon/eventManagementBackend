const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

// Convert a local time (like "2025-10-20T14:30") to UTC
const toUtc = (localIso, tz) => {
	return dayjs.tz(localIso, tz).utc().toDate();
};

// Convert UTC time back to a specific timezone
const fromUtc = (utcDate, tz) => {
	// Format with offset so the frontend knows which timezone this is
	return dayjs(utcDate).tz(tz).format('YYYY-MM-DDTHH:mm:ss.SSSZ');
};

// Check if a timezone string is valid (like "America/New_York")
const isValidTimezone = (tz) => {
	try {
		dayjs.tz('2024-01-01', tz);
		return true;
	} catch (e) {
		return false;
	}
};

module.exports = {
	toUtc,
	fromUtc,
	isValidTimezone
};





