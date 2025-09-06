const mongoose = require("mongoose");

const workshopTeamSchema = new mongoose.Schema(
	{
		team_code: {
			type: String,
			required: true,
			unique: true,
			uppercase: true,
			trim: true,
			// Format: XXXX-XXXX-XXXX-XXXX (16 characters + 3 hyphens = 19 total)
			match: /^[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}$/,
		},
		event_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "EventModel",
			required: true,
		},
		team_leader: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		team_members: [
			{
				user_id: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
					required: true,
				},
				joined_at: {
					type: Date,
					default: Date.now,
				},
				role: {
					type: String,
					enum: ["leader", "member"],
					default: "member",
				},
				email: {
					type: String,
					required: true,
					lowercase: true,
					trim: true,
				},
				name: {
					type: String,
					required: true,
					trim: true,
				},
				roll_number: {
					type: String,
					trim: true,
					uppercase: true,
				},
			},
		],
		team_name: {
			type: String,
			trim: true,
			maxlength: 100,
			// Optional team name that can be set later
		},
		max_members: {
			type: Number,
			default: 4, // Default team size, can be overridden by event settings
			min: 1,
			max: 10,
		},
		status: {
			type: String,
			enum: ["active", "disbanded", "full"],
			default: "active",
		},
		created_at: {
			type: Date,
			default: Date.now,
		},
	},
	{
		timestamps: true,
	}
);

// Compound index to ensure uniqueness of team_code per event
workshopTeamSchema.index({ team_code: 1, event_id: 1 }, { unique: true });

// Index for faster queries
workshopTeamSchema.index({ event_id: 1 });
workshopTeamSchema.index({ team_leader: 1 });

// Virtual to get current team size
workshopTeamSchema.virtual("current_members_count").get(function () {
	return this.team_members.length;
});

// Virtual to check if team is full
workshopTeamSchema.virtual("is_full").get(function () {
	return this.team_members.length >= this.max_members;
});

// Method to add a member to the team
workshopTeamSchema.methods.addMember = function (userId, role = "member", extras) {
	// Check if user is already in the team
	const existingMember = this.team_members.find(
		(member) => member.user_id.toString() === userId.toString()
	);

	if (existingMember) {
		throw new Error("User is already a member of this team");
	}

	// Check if team is full
	if (this.is_full) {
		throw new Error("Team is already full");
	}

	this.team_members.push({
		user_id: userId,
		role: role,
		joined_at: new Date(),
		...extras,
	});

	// Update status if team becomes full
	if (this.is_full) {
		this.status = "full";
	}

	return this;
};

// Method to remove a member from the team
workshopTeamSchema.methods.removeMember = function (userId) {
	const memberIndex = this.team_members.findIndex(
		(member) => member.user_id.toString() === userId.toString()
	);

	if (memberIndex === -1) {
		throw new Error("User is not a member of this team");
	}

	// Cannot remove team leader
	if (this.team_members[memberIndex].role === "leader") {
		throw new Error("Cannot remove team leader");
	}

	this.team_members.splice(memberIndex, 1);

	// Update status if team is no longer full
	if (this.status === "full") {
		this.status = "active";
	}

	return this;
};

// Static method to generate unique team code
workshopTeamSchema.statics.generateTeamCode = function () {
	return "xxxx-xxxx-xxxx-xxxx"
		.replace(/[x]/g, function () {
			return ((Math.random() * 16) | 0).toString(16);
		})
		.toUpperCase();
};

// Static method to find team by code and event
workshopTeamSchema.statics.findByCodeAndEvent = function (teamCode, eventId) {
	return this.findOne({ team_code: teamCode, event_id: eventId })
		.populate("team_leader", "name email")
		.populate("team_members.user_id", "name email");
};

const WorkshopTeam = mongoose.model("WorkshopTeam", workshopTeamSchema);

module.exports = WorkshopTeam;
