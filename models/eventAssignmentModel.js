const mongoose = require('mongoose');

const eventAssignmentSchema = new mongoose.Schema(
	{
		eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
		profileId: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required: true }
	},
	{ timestamps: true }
);

eventAssignmentSchema.index({ eventId: 1, profileId: 1 }, { unique: true });
eventAssignmentSchema.index({ profileId: 1 });
eventAssignmentSchema.index({ eventId: 1 });

module.exports = mongoose.models.EventAssignment || mongoose.model('EventAssignment', eventAssignmentSchema);
