const { z } = require('zod');

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'invalid objectId');

const assignProfilesSchema = z.object({
	eventId: objectId,
	profileIds: z.array(objectId).nonempty('profileIds required')
});

const unassignProfilesSchema = z.object({
	eventId: objectId,
	profileIds: z.array(objectId).nonempty('profileIds required')
});

module.exports = {
	assignProfilesSchema,
	unassignProfilesSchema
};


