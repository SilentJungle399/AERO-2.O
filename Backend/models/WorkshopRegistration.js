const mongoose = require("mongoose");

const workshopRegistrationSchema = new mongoose.Schema(
	{
		user_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		event_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "EventModel",
			required: true,
		},
		registration_date: {
			type: Date,
			default: Date.now,
		},
		form_responses: [
			{
				question_key: {
					type: String,
					required: true,
				},
				question_text: {
					type: String,
					required: true,
				},
				question_type: {
					type: String,
					enum: ["short", "long", "option", "file"],
					required: true,
				},
				answer: {
					type: mongoose.Schema.Types.Mixed, // Can store strings, data URIs, etc.
					required: true,
				},
			},
		],
		status: {
			type: String,
			enum: ["registered", "attended", "cancelled"],
			default: "registered",
		},
		shortlisted: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

// Compound index to ensure one registration per user per event
workshopRegistrationSchema.index({ user_id: 1, event_id: 1 }, { unique: true });

module.exports = mongoose.model("WorkshopRegistration", workshopRegistrationSchema);
