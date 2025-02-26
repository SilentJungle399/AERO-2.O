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
    try {
        // Find the related event and increment the participant count
        const event = await mongoose.model("Event").findByIdAndUpdate(
            this.Event_id,
            { $inc: { total_participant_count: 1 } },
            { new: true }
        );

        if (!event) return next(new Error("Event not found"));

        // Ensure Group_token is unique by checking the last created group
        let newGroupNumber = event.total_participant_count;
        while (true) {
            // const formattedNumber = String(newGroupNumber).padStart(3, "0");
            const newToken = `${event.E_name}-${newGroupNumber}`;

            // Check if the generated token already exists
            const existingGroup = await mongoose.model("Group").findOne({ Group_token: newToken });

            if (!existingGroup) {
                this.Group_token = newToken;
                break;
            }

            newGroupNumber++; // Increment and try again if duplicate found
        }

        next();
    } catch (error) {
        next(error);
    }
});




const GroupModel = mongoose.model("Group", groupSchema);
module.exports = GroupModel;
