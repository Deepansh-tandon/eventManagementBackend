const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

const setupDayjs = () => {
	dayjs.extend(utc);
	dayjs.extend(timezone);
	console.log('Dayjs configured with UTC and timezone support');
};

module.exports = setupDayjs;





