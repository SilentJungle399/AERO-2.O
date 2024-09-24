const mongoose = require("mongoose");
const { type } = require("os");
const Schema = mongoose.Schema;

const teamMembersSchema = new mongoose.Schema({
    //this will be provided to team leader and asked to join the team
    Member_name:{
        type:String,
    },
    Payment_sc:{
        type: String,
        default:""
    },
    Member_college_name: {
        type: String,
        default:""
    },
    Member_branch:{
        type:String,
    },
    Member_year:{
        type:String,
    },
    Member_roll_no:{
        type:String,
    },
    Member_mob_no:{
        type:Number,
    },
    Member_email:{
        type:String,
    },
    Member_gender:{
        type:String,
        enum:['M','F']
    }
});

const TeamMembersModel = mongoose.model("TeamMembersTable", teamMembersSchema);

module.exports = TeamMembersModel;
