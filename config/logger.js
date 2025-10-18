const { nodeEnv } = require('./env');
// i could use logger lib here instead
const logger = {
	info: (msg, meta = {}) => {
		console.log(`[INFO] ${msg}`, meta);
	},
	error: (msg, meta = {}) => {
		console.error(`[ERROR] ${msg}`, meta);
	},
	warn: (msg, meta = {}) => {
		console.warn(`[WARN] ${msg}`, meta);
	},
	debug: (msg, meta = {}) => {
		if (nodeEnv === 'development') {
			console.debug(`[DEBUG] ${msg}`, meta);
		}
	}
};

module.exports = logger;





