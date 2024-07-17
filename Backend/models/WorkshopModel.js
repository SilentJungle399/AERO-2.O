const mongoose = require("mongoose");
const { type } = require("os");
const Schema = mongoose.Schema;

const workshopSchema = new mongoose.Schema({
    W_name: {
        type: String,
        required: true
    },
    w_image:{
        type:string,
        default:""
    },
    w_mini_description: {
        type: String,
        required: true
    },
    w_description: {
        type: String,
        required: true,
        unique: true
    },
    w_location: {
        type: String,
        required: true
    },
    w_duration: {
        type: String,
        required: true
    },
    w_date: {
        type: Date,
        required: true
    },
    w_perks: {
        type: String,
        required: true
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    w_img: {
        type: String,
        required: true
    },
    w_fee_type: {
        type: String,
        enum: ['paid', 'free'],
        required: true
    },
    w_fee: {
        type: Number,
        required: true
    },
    active_status: {
        type: Boolean,
        default: true
    },
    deadline: {
        type: Date,
        required: true
    }
});

const WorkshopModel = mongoose.model("Workshop", workshopSchema);

module.exports = WorkshopModel;
