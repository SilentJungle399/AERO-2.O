const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const groupSchema = new mongoose.Schema({
    Event_id: {
        type: Schema.Types.ObjectId,
        ref: "Event",
        required: true,
    },

    // Auto-generated unique group token
    Group_token: {
        type: String,
        unique: true,
    },

    Group_members_uids: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    ],

    Group_members_team_ids: [
        {
            type: Schema.Types.ObjectId,
            ref: "TeamMembersTable", // Assuming 'TeamMembersTable' is the model name for group members
        },
    ],

    team_name: {
        type: String,
    },
    winning_status: {
        type: String,
    },
    position: {
        type: String,
        default: "M",
    },
    gender: {
        type: String,
    },
    Group_leader_id: {
        type: Schema.Types.ObjectId,
        ref: "User", // Assuming 'User' is the model name for the group leader
    },
    g_leader_college_name: {
        type: String,
        default: "",
    },
    g_leader_email: {
        type: String,
    },
    is_external_participation: {
        type: Boolean,
    },
    g_leader_mobile: {
        type: Number,
    },
    address: {
        type: String,
        default: "",
    },
});

// **Pre-save hook to auto-increment participant count and generate Group_token**
groupSchema.pre("save", async function (next) {
    if (!this.isNew) return next();

    const event = await mongoose.model("Event").findByIdAndUpdate(
        this.Event_id,
        { $inc: { total_participant_count: 1 } }, // Increment participant count
        { new: true }
    );

    if (!event) return next(new Error("Event not found"));

    // Get the latest group for this event
    const lastGroup = await mongoose.model("Group").findOne({ Event_id: this.Event_id })
        .sort({ Group_token: -1 }) // Get the last created group
        .select("Group_token");

    let newGroupNumber = 1; // Default if no groups exist

    if (lastGroup) {
        const lastNumber = parseInt(lastGroup.Group_token.split("-").pop(), 10);
        newGroupNumber = lastNumber + 1;
    }

    const formattedNumber = String(newGroupNumber).padStart(3, "0");
    this.Group_token = `${event.E_name}-${formattedNumber}`;

    next();
});


const GroupModel = mongoose.model("Group", groupSchema);
module.exports = GroupModel;
