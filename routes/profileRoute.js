const express = require('express');
const router = express.Router();
const validate = require('../middlewares/validate');
const { createProfileSchema, updateTimezoneSchema } = require('../schemas/profiles.schema');
const profileController = require('../controllers/profileController');

router.post('/', validate(createProfileSchema, 'body'), profileController.createProfile);

router.get('/', profileController.listProfiles);

router.get('/:id', profileController.getProfile);

router.patch('/:id/timezone', validate(updateTimezoneSchema, 'body'), profileController.updateTimezone);

module.exports = router;





