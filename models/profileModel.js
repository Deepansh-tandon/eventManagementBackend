const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, trim: true },
		timezone: { type: String, default: 'UTC' }
	},
	{ timestamps: true }
);

profileSchema.index({ name: 1 }, { unique: false });
profileSchema.index({ timezone: 1 });

module.exports = mongoose.models.Profile || mongoose.model('Profile', profileSchema);


