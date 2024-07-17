const mongoose = require("mongoose");
const User = require("./usermodel");
const Schema = mongoose.Schema;

const eventSchema = new mongoose.Schema({
    Group_Id:[{
        type:Schema.Types.ObjectId,
        ref:'Group'
    }],
    E_main_img:{
        type:String,
        default:""
    },
    E_name: {
        type: String,
        required: true,
    },
    E_domain: {
        type: String,
        enum:['Drone','Rc-planes'],
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
        required:true,
    },
    deadline: {
        type: Date,
        required:true,
    },
    E_guidelines:{
        type:[String],
        required:true,
    },
    E_perks: {
        type: String,
        required: true
    },
    E_team_size: {
        type: Number,
        required:true
    },
    E_fee_type: {
        type: String,
        enum: ['paid', 'free'],
        required:true
    },
    is_workshop: {
        type:Boolean,
        default:false
    },
    E_fee: {
        type: Number,
        default:0
    },
    active_status: {
        type: Boolean,
        default:true
    },
    Event_payment_status:{
        type:Boolean,
        default:false
    },
    participants_id:[{
        type:Schema.Types.ObjectId,
        ref:'User',
    }]
});

const EventModel = mongoose.model("Event", eventSchema);

module.exports = EventModel;
