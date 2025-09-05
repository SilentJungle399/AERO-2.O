const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const formDraftSchema = new mongoose.Schema({
	user_id: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	event_id: {
		type: Schema.Types.ObjectId,
		ref: "Event",
		required: true,
	},
	draft_data: {
		type: mongoose.Schema.Types.Mixed, // Stores the form data as an object
		default: {},
	},
	created_at: {
		type: Date,
		default: Date.now,
	},
	updated_at: {
		type: Date,
		default: Date.now,
	},
});

// Create a compound index to ensure one draft per user per event
formDraftSchema.index({ user_id: 1, event_id: 1 }, { unique: true });

// Update the updated_at field before saving
formDraftSchema.pre("save", function (next) {
	this.updated_at = Date.now();
	next();
});

const FormDraft = mongoose.model("FormDraft", formDraftSchema);

module.exports = FormDraft;
