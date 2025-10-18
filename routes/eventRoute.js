const express = require('express');
const router = express.Router();
const validate = require('../middlewares/validate');
const { createEventSchema, updateEventSchema, getEventsQuerySchema } = require('../schemas/events.schema');
const eventController = require('../controllers/eventController');

router.post('/', validate(createEventSchema, 'body'), eventController.createEvent);

router.get('/', validate(getEventsQuerySchema, 'query'), eventController.getEventsForProfile);

router.get('/:id', eventController.getEvent);

router.patch('/:id', validate(updateEventSchema, 'body'), eventController.updateEvent);

router.delete('/:id', eventController.deleteEvent);

module.exports = router;





