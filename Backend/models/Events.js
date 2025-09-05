const mongoose = require("mongoose");
const User = require("./usermodel");
const Schema = mongoose.Schema;

const eventSchema = new mongoose.Schema({
	Group_Id: [
		{
			type: Schema.Types.ObjectId,
			ref: "Group",
		},
	],
	E_main_img: {
		type: String,
		default: "",
	},
	E_name: {
		type: String,
		required: true,
	},
	E_domain: {
		type: String,
		enum: ["Drone", "Rc-planes"],
		required: true,
	},
	E_mini_description: {
		type: String,
		required: true,
	},
	E_description: {
		type: String,
		required: true,
	},
	E_location: {
		type: String,
		required: true,
	},
	E_timings: {
		type: String,
		required: true,
	},
	E_date: {
		type: Date,
		required: true,
	},
	deadline: {
		type: Date,
		required: true,
	},
	E_guidelines: {
		type: [String],
		required: true,
	},
	E_perks: {
		type: String,
		required: true,
	},
	E_team_size: {
		type: Number,
		required: true,
	},
	E_fee_type: {
		type: String,
		enum: ["paid", "free"],
		required: true,
	},
	is_workshop: {
		type: Boolean,
		default: false,
	},
	E_fee: {
		type: Number,
		default: 0,
	},
	active_status: {
		type: Boolean,
		default: true,
	},
	Event_payment_status: {
		type: Boolean,
		default: false,
	},
	participants_id: [
		{
			type: Schema.Types.ObjectId,
			ref: "User",
		},
	],
	// **New Field: Tracks the total number of participants in the event**
	total_participant_count: {
		type: Number,
		default: 0,
	},

	// **New Field: Tracks the current token number for queue management**
	current_token_number: {
		type: Number,
		default: 1, // Starts from 1 and increments with each new participant
	},

	// **New Field: Form configuration for registration**
	form: [
		{
			question: {
				type: String,
				required: true,
			},
			type: {
				type: String,
				enum: ["short", "long", "option", "file"],
				required: true,
			},
			key: {
				type: String,
				required: true,
			},
			space: {
				type: String,
				enum: ["half", "full"],
				default: "full",
			},
			options: {
				type: [String],
				required: false, // Only required for type "option"
			},
		},
	],
});

const EventModel = mongoose.model("Event", eventSchema);

module.exports = EventModel;
