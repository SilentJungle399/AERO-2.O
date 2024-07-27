const mongoose = require("mongoose");
const { type } = require("os");
const Schema = mongoose.Schema;

const inductionSchema = new mongoose.Schema({
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    gender:{
        type:String,
        default:""
    },
    name:{
        type:String,
        default:""
    },
    email:{
        type:String,
        deafult:""
    },
    roll_no:{
        type:String,
        default:""
    },
    branch:{
        type:String,
        default:""
    },
    phone_number:{
        type:String,
        default:""
    },
    year:{
        type:String,
        default:""
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
    uploaded_files: [
        {
          url: {
            type: String,
            default: "",
          },
          file_type: {
            type: String,
            default: "",
          },
        },
      ],
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
