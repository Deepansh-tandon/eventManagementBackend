const { z } = require('zod');

const ianaTz = z.string().min(1, 'timezone is required');

const createProfileSchema = z.object({
	name: z.string().trim().min(1, 'name is required'),
	timezone: ianaTz.optional()
});

const updateTimezoneSchema = z.object({
	timezone: ianaTz
});

module.exports = {
	createProfileSchema,
	updateTimezoneSchema
};


