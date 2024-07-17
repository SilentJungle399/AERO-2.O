const mongoose = require("mongoose");
const { type } = require("os");
const Schema = mongoose.Schema;

const groupSchema = new mongoose.Schema({
    Event_id:{
        type:Schema.Types.ObjectId,
        ref:'Event',
    },
    // this will be created and provided to team leader and asked to join the team
    Group_token: {
        type: String,
        unique: true,
        required: true
    },
    //will help to extract record of all members of team from usermodel
    Group_members_uids: [{
        type: Schema.Types.ObjectId,
        ref: 'User' ,
    
    }],
    
    //will help to extract record of all members of team from teammembermodel
    Group_members_team_ids: [{
        type: Schema.Types.ObjectId,
        ref: 'TeamMembersTable' ,// Assuming 'TeamMembersTable' is the model name for group members

    }],
    team_name: {
        type: String,
        required: true
    },
    winning_status: {
        type: String,
    },
    position: {
        type: String,
        default: "M"
    },
    gender: {
        type: String,
        enum: ['M', 'F'],
        required: true
    },
    Group_leader_id: {
        type: Schema.Types.ObjectId,
        ref: 'User' // Assuming 'User' is the model name for the group leader
    },
    g_leader_college_name: {
        type: String,
        required: true
    },
    g_leader_email: {
        type: String,
        required: true
    },
    is_external_participation: {
        type: Boolean
    },
    g_leader_mobile: {
        type: Number
    },
    address: {
        type: String,
        default: ""
    }
});

const GroupModel = mongoose.model("Group", groupSchema);

module.exports = GroupModel;
