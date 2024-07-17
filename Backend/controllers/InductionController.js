const Induction=require('../models/Inductions');
const InductiesModel=require('../models/InductiesModel');


const saveParticipants=async (req, res) => {
    try {
        const  inId  = req.params.id;
        console.log(inId);
        console.log(req.body) // Fetch In_id from route params
        const {
            uid, // Assuming userId is provided in req.body for the participant filling the form
            name,
            email,
            rollNumber,
            branch,
            year,
            phoneNumber,
            answers,
            queries,
            ppt,
            team_preference,
            hobbies,
            skills,
        } = req.body;

        const inductioncheck = await Induction.findById(inId);
        if(inductioncheck.I_participants.includes(uid)){
            return res.status(201).json("user already participated");
        }

        

        // Create a new instance of InductiesModel
        const newParticipant = new InductiesModel({
            name,
            email,
            roll_no:rollNumber,
            branch,
            phone_number:phoneNumber,
            year,
            answers,
            queries: queries || "",
            files: ppt || "",
            team_preference: team_preference || "",
            hobbies: hobbies || "",
            skills: skills || "",
        });

        // Save the new participant instance
        const savedParticipant = await newParticipant.save();


        // Update InductionModel with participant's ID
        const induction = await Induction.findById(inId);
        if (!induction) {
            return res.status(404).json({ error: 'Induction not found' });
        }

        // Add the participant's ID to I_participants array in InductionModel
        induction.I_participants.push(uid);// Assuming userId is the ID of the user filling the form
        induction.Inducties_id.push(savedParticipant);
        
        // Save updated InductionModel
        await induction.save();

        res.status(201).json(savedParticipant); // Respond with the saved participant document
    } catch (error) {
        res.status(500).json({ error: `Failed to store participant details: ${error.message}` });
    }
}

const createInduction=async (req, res) => {
    try {
        const {
            I_name,
            I_banner_img,
            I_date,
            I_venue,
            I_deadline,
            I_timing,
            I_description,
            questions,
        } = req.body;

        // Create a new instance of InductionModel with the provided data
        const newInduction = new Induction({
            I_name,
            I_banner_img,
            I_date,
            I_venue,
            I_deadline,
            I_timing,
            I_description,
            questions,
        });
        // Save the new induction form to the database
        const savedInduction = await newInduction.save();
        console.log('Induction form created successfully:', savedInduction);
        res.status(201).json(savedInduction); // Respond with saved induction form
    } catch (error) {
        console.error('Error creating induction form:', error);
        res.status(500).json({ error: 'Failed to create induction form' });
    }
}


const getAllInductions = async (req, res) => {
    try {
        const inductions = await Induction.find();
        res.status(200).json(inductions);
    } catch (error) {
        console.error('Error fetching inductions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getInduction = async (req, res) => {
    try {
        const id = req.params.id; // Fetching ID from route params
        const induction = await Induction.findById(id); // Finding induction by ID

        if (!induction) {
            return res.status(404).json({ error: 'Induction not found' });
        }

        res.status(200).json(induction);
    } catch (error) {
        console.error('Error fetching induction:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};




module.exports ={createInduction,getAllInductions,saveParticipants,getInduction}