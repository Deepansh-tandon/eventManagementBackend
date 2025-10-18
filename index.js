const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const setupDayjs = require('./config/dayjs');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (typeof setupDayjs === 'function') setupDayjs();
if (db && typeof db.connect === 'function') db.connect();

app.get('/health', (req, res) => {
	res.status(200).json({ success: true, data: { status: 'ok' } });
});

let router = require('./routes');
if (router && typeof router === 'function') router = router();
else if (router && router.router) router = router.router;
else router = express.Router();
app.use('/api', router);


app.use((req, res, next) => {
	res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Route not found' } });
});

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
	console.log(`API listening on port ${PORT}`);
});

module.exports = app;


