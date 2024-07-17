const mongoose = require("mongoose");
const { type } = require("os");
const Schema = mongoose.Schema;

const inductionSchema = new mongoose.Schema({
    Inducties_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'inductiesModel'
    }],
    I_banner_img:{
        type:String,
        default:"/rocket-launching.jpg"
    },
    I_name:{
        type:String,
        required:true
    },
    I_date: {
        type: Date,
        required: true
    },
    I_venue: {
        type: String,
        required: true,
    },
    I_deadline: {
        type: Date,
        required: true,
    },
    I_timing: {
        type: String,
        required: true
    },
    I_description: {
        type: String,
        required:true
    }, 
    questions: [{
        question: {
            type: String,
            required: true
        }
    }],
    I_participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    I_selected_participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    I_active_status: {
        type: Boolean,
        default: true
    },
    I_result_status:{
        type:String,
        default:"ongoing"
    }
});

const InductionModel = mongoose.model("inductions", inductionSchema);

module.exports = InductionModel;
