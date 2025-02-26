const { v4: uuidv4 } = require("uuid");
const GroupModel = require("../models/GroupModel");
const TeamMembersModel = require("../models/TeamMembers");
const EventModel = require("../models/Events");
const mongoose=require('mongoose');
const { sendWorkshopConfirmationEmail, sendTeamJoiningConfirmationEmail } = require("../middlewares/nodemailerMiddleware");

const getTeamByToken=async(req,res)=>{
    const {Group_token}=req.body;
    console.log("hey"+Group_token)
    const tokenfound=await GroupModel.findOne({Group_token:Group_token});
    if(tokenfound){
        res.status(200).json(tokenfound);
    }else{
        res.status(201).json({msg:"invalid token"});
    }
}
const getAllEvents = async (req, res) => {
    try {
        const events = await EventModel.find();
        res.status(200).json({
            message: "Events fetched successfully",
            events: events
        });
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({
            message: "Error fetching events",
            error: error.message
        });
    }
};
const getEventById = async (req, res) => {
    try {
        const Event_id = req.params.id;
        const event = await EventModel.findById(Event_id).populate({
            path: 'Group_Id',
            select : 'Group_token team_name Group_members_team_ids'
        });

        if(!event) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        res.status(200).json({
            message: "Event fetched successfully",
            event: event
        });
    } catch (error) {
        console.error("Error fetching event:", error);
        res.status(500).json({
            message: "Error fetching event",
            error: error.message
        });
    }
};
const createEvent= async (req, res) => {
    E_main_img=req.body.fileDownloadURL;
    console.log(req.body)
    try {
        // Destructure values from request body
        const {
            E_name,
            E_guidelines,
            E_mini_description,
            E_description,
            E_location,
            E_timings,
            E_date,
            deadline,
            E_perks,
            E_team_size,
            E_fee_type,
            E_fee,
            E_domain
        } = req.body;
        
        // Create a new event instance
        const event = new EventModel({
            E_name,
            E_guidelines,
            E_mini_description,
            E_description,
            E_location,
            E_timings,
            E_date,
            deadline,
            E_perks,
            E_team_size,
            E_fee_type,
            E_fee,
            E_domain,
            E_main_img
        });

        // Save the event to the database
        await event.save();

        res.status(201).json({
            message: "Event created successfully",
            event: event
        });
    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({
            message: "Error creating event",
            error: error.message
        });
    }
}
// function generateGroupToken() {
//     return uuidv4();
// }
const createTeam = async (req, res) => {
    try {
        Payment_screenshot=req.body.fileDownloadURL;
    console.log(req.body)
        
        const Event_id = req.params.id;
        console.log("dlaskdnlkasdfnajdnakdjf")
        console.log(req.body)
        if(req.body==null) return  res.status(500).json({
            message: "empty body",
            error: error.message
        });
        const {
            Group_leader_id,
            team_name,
            address,
            g_leader_name,
            g_leader_mobile,
            g_leader_branch,
            g_leader_email,
            g_leader_year,
            g_leader_roll_no,
            g_leader_gender,
            g_leader_college_name,
            is_external_participation,
        } = req.body;

        // const Group_token = generateGroupToken();

        const event = await EventModel.findOne({ _id: Event_id });

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Check if leader has already created a team (check user id if inserted by joining or creating the team)
        // const alreadyFormedGroup = await GroupModel.findOne({ Group_leader_id, Event_id});
        // if (alreadyFormedGroup) {
        //     return res.status(400).json({ message: "You have already created a team" });
        // }

        // Check if leader is already a participant
        // if (event.participants_id.includes(Group_leader_id)) {
        //     const team = await GroupModel.findOne({ group_members_uids: new mongoose.Types.ObjectId(Group_leader_id) });
        //     return res.status(400).json({ message: "You are already a participant", team });
        // }

        // Create a new group
        const group = new GroupModel({
            Event_id,
            Group_leader_id,
            team_name,
            gender:g_leader_gender,
            address,
            g_leader_mobile,
            g_leader_email,
            g_leader_college_name,
            is_external_participation,
        });

        // Create a new team member
        const teamMember = new TeamMembersModel({
            Member_name: g_leader_name,
            Member_college_name: g_leader_college_name,
            Member_branch: g_leader_branch,
            Member_year: g_leader_year,
            Member_roll_no: g_leader_roll_no,
            Member_mob_no: g_leader_mobile,
            Member_email: g_leader_email,
            Member_gender: g_leader_gender,
            Payment_sc:Payment_screenshot,
        });

        
        group.Group_members_uids.push(Group_leader_id);
        group.Group_members_team_ids.push(teamMember._id);
        
        const newGroup=await group.save();
        await teamMember.save();

        // Update event with new group and participant
        event.Group_Id.push(group._id);
        event.participants_id.push(Group_leader_id);
        await event.save();

        
        const savedGroup = await GroupModel.findById(newGroup._id);
         sendWorkshopConfirmationEmail(g_leader_name, g_leader_email, team_name, event.E_name, savedGroup.Group_token,g_leader_mobile, g_leader_branch, g_leader_year, g_leader_roll_no, g_leader_college_name)

         res.status(201).json({
            message: "Group created successfully",
            group: newGroup,
            token: savedGroup.Group_token // Ensure the generated token is returned
        });
    } catch (error) {
        console.error("Error creating group:", error);
        res.status(500).json({
            message: "Error creating group",
            error: error.message
        });
    }
};

const checkToken=async(req,res)=>{
    const {Group_token}=req.body;
    console.log("hey"+Group_token)
    const tokenfound=await GroupModel.findOne({Group_token:Group_token});
    if(tokenfound){
        res.status(200).json(tokenfound);
    }else{
        res.status(201).json({msg:"invalid token"});
    }
}

const teamDashboard=async(req,res)=>{
    const {Group_token} = req.body;
    const tokenfound = await GroupModel
    .findOne({ Group_token: Group_token })
    .populate('Group_members_team_ids')  // Populate the team details
    .populate('Group_leader_id'); 
    if(tokenfound){
        res.status(200).json(tokenfound);
    }else{
        res.status(201).json({msg:"invalid token"});
    }
}

const joinTeam=async (req, res) => {
    try {
        const { uid,Group_token, Member_name, Member_college_name, Member_branch, Member_year,Member_roll_no, Member_mob_no, Member_email, Member_gender } = req.body;

        Payment_screenshot=req.body.fileDownloadURL;
        const group = await GroupModel.findOne({ Group_token })
    .populate('Group_leader_id', 'full_name mobile_no'); // 'name' and 'mobile' are the fields from 'User'

        if (!group) {
            return res.status(404).json({
                message: "Group not found !! Ask your leader to create Team***"
            });
        }

        const event = await EventModel.findById(group.Event_id);
        
        if(event.participants_id.includes(uid)){
            return res.status(400).json({
                msg:"you are already a participant of this Event",
                team:group
            })
        }

        const teamMember = new TeamMembersModel({
            Member_name,
            Member_college_name,
            Member_branch,
            Member_year,
            Member_roll_no,
            Member_mob_no,
            Member_email,
            Member_gender,
            Payment_sc:Payment_screenshot
        });

        // Save the team member to the database
        await teamMember.save();

        // Add the team member to the group
        group.Group_members_team_ids.push(teamMember._id);
        group.Group_members_uids.push(uid);
        await group.save();

        //keep record of member in event partcipant
        const Event_id=group.Event_id.toString();
        // console.log(Event_id)
        // console.log(event)

        //replace teammember._id with uid from local storage of user
        event.participants_id.push(uid);
        await event.save();
        

        sendTeamJoiningConfirmationEmail(
            Member_name,
            Member_email,
            Group_token,
            group.team_name, // Assuming the group object has a name
            event.E_name, // Assuming the event object has a name
            group.Group_leader_id.full_name, // Leader's name
            group.Group_leader_id. mobile_no,  // Leader's contact info
            Member_college_name,
            Member_branch,
            Member_year,
            Member_roll_no,
            Member_mob_no,
            Payment_screenshot
        );
        
        res.status(200).json({
            message: "User added to the group successfully",
            group: group
        });
    } catch (error) {
        res.status(500).json({
            message: "Error joining group",
            error: error.message
        });
    }
}


module.exports={teamDashboard,createEvent,createTeam,joinTeam,getAllEvents,getEventById,checkToken}
