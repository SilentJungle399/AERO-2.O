const mongoose = require("mongoose");
const Schema = mongoose.Schema;


//global attendance schema for storing all the records of attendence of all meets at on place one for each user and will be created only when he participates in meet for the first time.

const attendanceSchema = new mongoose.Schema({
    meet_id: [{
        type: Schema.Types.ObjectId,
        ref: 'Meet', // Assuming 'Meet' is the model name for the meetings
        required: true
    }],
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    total_present:{
        type:Number,
        default:0
    }
});

const AttendanceModel = mongoose.model("Attendance", attendanceSchema);

module.exports = AttendanceModel;
