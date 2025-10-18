const mongoose = require('mongoose');

const changeSchema = new mongoose.Schema(
	{
		field: { type: String, required: true },
		previous: { type: mongoose.Schema.Types.Mixed },
		next: { type: mongoose.Schema.Types.Mixed }
	},
	{ _id: false }
);

const eventUpdateLogSchema = new mongoose.Schema(
	{
		eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
		updatedByProfileId: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required: true },
		updatedByTimezone: { type: String },
		updatedAtUtc: { type: Date, required: true, default: () => new Date() },
		changes: { type: [changeSchema], default: [] }
	},
	{ timestamps: true }
);

eventUpdateLogSchema.index({ eventId: 1, updatedAtUtc: -1 });
eventUpdateLogSchema.index({ updatedByProfileId: 1, updatedAtUtc: -1 });

module.exports = mongoose.models.EventUpdateLog || mongoose.model('EventUpdateLog', eventUpdateLogSchema);






