const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const meetSchema = new mongoose.Schema({
    participants_ids:[{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    meet_date: {
        type: Date,
        required: true
    },
    meet_time: {
        type: String,
        required: true
    },
    meet_team_type: {
        type: String,
        enum: ['Drone', 'Rc-Planes', 'Drone and Rc-planes both'],
        required: true
    },
    meet_venue: {
        type: String,
        required: true
    },
    meet_description: {
        type: String,
        required: true
    },
    meet_qr_code: {
        type: String,
        required: true
    },
    qr_code_token: {
        type: String,
        required: true
    },
    meet_essentials: {
        type: [String],
        default: []
    },
    meet_active_status: {
        type: Boolean,
        default: true
    },
    meet_mode: {
        type: String,
        enum: ['online', 'offline', 'hybrid'],
        default: 'offline'
    }
});

const MeetModel = mongoose.model("Meet", meetSchema);

module.exports = MeetModel;
