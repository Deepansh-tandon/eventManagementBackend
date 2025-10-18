const express = require('express');
const router = express.Router();
const validate = require('../middlewares/validate');
const { assignProfilesSchema, unassignProfilesSchema } = require('../schemas/assignments.schema');
const assignmentController = require('../controllers/assignmentController');

router.post('/assign', validate(assignProfilesSchema, 'body'), assignmentController.assignProfiles);

router.post('/unassign', validate(unassignProfilesSchema, 'body'), assignmentController.unassignProfiles);

router.get('/event/:eventId', assignmentController.getProfilesByEvent);

router.get('/profile/:profileId', assignmentController.getEventsByProfile);

module.exports = router;





