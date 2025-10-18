const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
	{
		title: { type: String, required: true, trim: true },
		description: { type: String, trim: true },
		startAtUtc: { type: Date, required: true },
		endAtUtc: { type: Date, required: true },
		createdByProfileId: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required: false },
		createdByTimezone: { type: String },
		updatedByProfileId: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
		updatedByTimezone: { type: String }
	},
	{ timestamps: true }
);

eventSchema.index({ startAtUtc: 1 });
eventSchema.index({ endAtUtc: 1 });
eventSchema.index({ createdByProfileId: 1 });

module.exports = mongoose.models.Event || mongoose.model('Event', eventSchema);



