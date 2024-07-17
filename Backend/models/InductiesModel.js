const mongoose = require("mongoose");
const { type } = require("os");
const Schema = mongoose.Schema;

const inductionSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true,
    },
    email:{
        type:String,
        required:true,
    },
    roll_no:{
        type:String,
        required:true
    },
    branch:{
        type:String,
        required:true,
    },
    phone_number:{
        type:String,
        required:true,
    },
    year:{
        type:String,
        required:true,
    },
    answers: [{
        question: {
            type: String,
            required: true
        },
        answer: {
            type: String,
            default: ""
        }
    }],
    queries: {
        type: String,
        default: ""
    },
    files: {
        type: [],
        default: ""
    },
    team_preference: {
        type: String,
        default: ""
    },
    hobbies: {
        type: String,
        default: ""
    },
    skills: {
        type: String,
        default: ""
    },
    selection_status: {
        type: Boolean,
        default: false
    },
});

const InductiesModel = mongoose.model("inductiesModel", inductionSchema);

module.exports = InductiesModel;
