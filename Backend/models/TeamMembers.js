const mongoose = require("mongoose");
const { type } = require("os");
const Schema = mongoose.Schema;

const teamMembersSchema = new mongoose.Schema({
    //this will be provided to team leader and asked to join the team
    Member_name:{
        type:String,
        required:true,
    },
    Member_college_name: {
        type: String,
        required:true
    },
    Member_branch:{
        type:String,
        required:true,
    },
    Member_year:{
        type:String,
        required:true,
    },
    Member_roll_no:{
        type:String,
        required:true,
    },
    Member_mob_no:{
        type:Number,
        required:true,
    },
    Member_email:{
        type:String,
        required:true,
    },
    Member_gender:{
        type:String,
        enum:['M','F']
    }
});

const TeamMembersModel = mongoose.model("TeamMembersTable", teamMembersSchema);

module.exports = TeamMembersModel;
