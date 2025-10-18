const { z } = require('zod');

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'invalid objectId');
const ianaTz = z.string().min(1, 'timezone is required');
const isoString = z.string().refine((v) => !Number.isNaN(Date.parse(v)), 'invalid ISO datetime');

const createEventSchema = z.object({
	title: z.string().trim().min(1, 'title is required'),
	description: z.string().trim().optional(),
	timezone: ianaTz,
	startLocalIso: isoString,
	endLocalIso: isoString,
	profileIds: z.array(objectId).nonempty('at least one profile is required'),
	createdByProfileId: objectId.optional()
}).refine((data) => new Date(data.endLocalIso) > new Date(data.startLocalIso), {
	message: 'end must be after start',
	path: ['endLocalIso']
});

const updateEventSchema = z.object({
	title: z.string().trim().optional(),
	description: z.string().trim().optional(),
	timezone: ianaTz.optional(),
	startLocalIso: isoString.optional(),
	endLocalIso: isoString.optional(),
	addProfileIds: z.array(objectId).optional(),
	removeProfileIds: z.array(objectId).optional(),
	updatedByProfileId: objectId.optional()
}).refine((data) => {
	if (data.startLocalIso && data.endLocalIso) {
		return new Date(data.endLocalIso) > new Date(data.startLocalIso);
	}
	return true;
}, {
	message: 'end must be after start',
	path: ['endLocalIso']
});

const getEventsQuerySchema = z.object({
	profileId: objectId,
	tz: z.string().optional()
});

module.exports = {
	createEventSchema,
	updateEventSchema,
	getEventsQuerySchema
};


