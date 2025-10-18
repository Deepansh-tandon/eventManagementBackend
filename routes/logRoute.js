const express = require('express');
const router = express.Router();
const logsController = require('../controllers/logsController');

router.get('/event/:eventId', logsController.getEventLogs);

module.exports = router;





