const logService = require('../services/logService');

const getEventLogs = async (req, res, next) => {
	try {
		console.log('📋 Get Event Logs Request:', {
			eventId: req.params.eventId,
			tz: req.query.tz
		});

		const { eventId } = req.params;
		const tz = req.query.tz || 'UTC';
		
		console.log('📋 Fetching logs for event:', eventId, 'with timezone:', tz);
		const logs = await logService.getEventLogs(eventId, tz);
		
		console.log('📋 Found logs:', logs.length);
		res.status(200).json({ success: true, data: logs });
	} catch (err) {
		console.error('❌ Error fetching logs:', err);
		next(err);
	}
};

module.exports = {
	getEventLogs
};



