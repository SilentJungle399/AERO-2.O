const Induction = require("../models/Inductions");
const InductiesModel = require("../models/InductiesModel");
const {
  sendParticipationConfirmationEmail,
  sendSelectionConfirmationEmail,
} = require("../middlewares/nodemailerMiddleware");
const NotificationModel = require("../models/notificationmodels/Notifications");
const User = require("../models/usermodel");
const InductionModel = require("../models/Inductions");

const sendNotification = async (req, res) => {
  try {
    const In_id = req.params.id;
    const { selectedParticipants, message, fileDownloadURLs } = req.body;

    // Step 1: Create a new notification
    const newNotification = new NotificationModel({
      notifications_text: message,

      notifications_title:
        "🎉 Congratulations! 🚀We are thrilled to inform you that you have been selected for the upcoming Aeromodelling Induction! 🛩️ Your enthusiasm and skills have shone brightly, and we can’t wait to have you on board. Please review the attached files for more details and your schedule. 🌟",
    });

    fileDownloadURLs.forEach(({ downloadURL, file_type }) => {
        newNotification.notificaitons_files.push({ url: downloadURL, file_type: file_type.contentType });
      });
      
    await newNotification.save();

    // Step 2: Process each selected participant
    for (const participantId of selectedParticipants) {
      const participant = await InductiesModel.findById(participantId);
      if (participant) {
        // Update the user schema
        let user = await User.findById(participant.user_id);

        if (!user) {
          console.error(`User with ID ${participant.user_id} not found`);
          continue; // Skip to the next participant if the user is not found
        }

        user.roll_no = participant.roll_no;
        user.is_verified_club_member = true;
        user.notifications.push({
          notification: newNotification._id, // Reference to the new notification
          read: false // Default to unread
        });
        
        user.date_of_joining = new Date(); // Use current date
        user.year = participant.year;
        user.branch = participant.branch;
        user.current_post = "member";
        user.college_name = "NIT Kurukshetra";
        const currentYear = new Date().getFullYear();
        const futureYear = currentYear + 4;
        user.session = `${currentYear}-${futureYear}`;
        user.team_name = participant.team_preference;
        user.role = "member";
        user.gender = participant.gender;
        user.mobile_no = participant.phone_number;

        await user.save();

        console.log(In_id);
        const induction = await InductionModel.findById(In_id);

        if (!induction) {
          console.error(`Induction with ID ${In_id} not found`);
          continue; // Skip to the next participant if the induction is not found
        }

        // Send email to participant
        await sendSelectionConfirmationEmail(
          participant.user_id,
          participant.name,
          user.email,
          induction.I_name,
          user.date_of_joining,
          user.roll_no,
          user.branch,
          user.year,
          participant.phone_number,
          participant.team_preference,
          fileDownloadURLs
        );
      }
    }

    res.status(200).json({ message: "Notifications sent successfully!" });
  } catch (error) {
    console.error("Error sending notifications:", error);
    res.status(500).json({ error: "Failed to send notifications" });
  }
};


const fetchInductie = async (req, res) => {
  const { Iid, uid } = req.params;

  try {
    // Find the induction by ID
    const induction = await InductionModel.findById(Iid);

    if (!induction) {
      return res.status(404).json({ message: 'Induction not found' });
    }

    // Find the inductee ID that matches the user ID in Inducties_id array
    const inducteeId = induction.Inducties_id.find(inductee => inductee.toString() === uid);

    if (!inducteeId) {
      return res.status(404).json({ message: 'Inductee not found in this induction' });
    }

    // Fetch the inductee's details from the InductiesModel using the found ID
    const inductee = await InductiesModel.findById(inducteeId);

    if (!inductee) {
      return res.status(404).json({ message: 'Inductee details not found' });
    }

    // Return the inductee's details
    return res.status(200).json(inductee);

  } catch (error) {
    console.error('Error fetching inductee:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};



const saveParticipants = async (req, res) => {
  try {
    const inId = req.params.id;
    // console.log(req.body.fileDownloadURLs);
    console.log(req.body); // Fetch In_id from route params
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
      team_preference,
      hobbies,
      skills,
      fileDownloadURLs,
    } = req.body;

    const inductioncheck = await Induction.findById(inId);
    const inductionName = inductioncheck.I_name;
    const inductionDate = inductioncheck.I_date;
    const inductionImagePath = inductioncheck.I_banner_img;

    if (inductioncheck.I_participants.includes(uid)) {
      return res.status(401).json("User already participated!!!");
    }

    // Create a new instance of InductiesModel
    const newParticipant = new InductiesModel({
      user_id: uid,
      name,
      email,
      roll_no: rollNumber,
      branch,
      phone_number: phoneNumber,
      year,
      answers,
      queries: queries || "",
      team_preference: team_preference || "",
      hobbies: hobbies || "",
      skills: skills || "",
    });
    if (fileDownloadURLs) {
      fileDownloadURLs.forEach(({ downloadURL, file_type }) => {
        newParticipant.uploaded_files.push({
          url: downloadURL,
          file_type: file_type.contentType,
        });
      });
    }

    // Save the new participant instance
    const savedParticipant = await newParticipant.save();

    // Update InductionModel with participant's ID
    const induction = await Induction.findById(inId);
    if (!induction) {
      return res.status(404).json({ error: "Induction not found!!!" });
    }

    // Add the participant's ID to I_participants array in InductionModel
    induction.I_participants.push(uid); // Assuming userId is the ID of the user filling the form
    induction.Inducties_id.push(savedParticipant);

    // Save updated InductionModel
    await induction.save();
    //send confirmation mail that u have been successfully registered for inductions
    sendParticipationConfirmationEmail(
      name,
      email,
      inductionName,
      inductionDate,
      rollNumber,
      branch,
      year,
      phoneNumber,
      queries,
      team_preference,
      hobbies,
      skills,
      inductionImagePath
    );

    res.status(201).json("Registration Succesfull. Please check you mail for more details.") // Respond with the saved participant document
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to store participant details: ${error.message}` });
  }
};

const createInduction = async (req, res) => {
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
    console.log("Induction form created successfully:", savedInduction);
    res.status(201).json(savedInduction); // Respond with saved induction form
  } catch (error) {
    console.error("Error creating induction form:", error);
    res.status(500).json({ error: "Failed to create induction form" });
  }
};

const getAllInductions = async (req, res) => {
  try {
    const inductions = await Induction.find();
    res.status(200).json(inductions);
  } catch (error) {
    console.error("Error fetching inductions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getInduction = async (req, res) => {
  try {
    console.log("kjbdf");
    const id = req.params.id; // Fetching ID from route params
    const induction = await Induction.findById(id); // Finding induction by ID

    if (!induction) {
      return res.status(404).json({ error: "Induction not found" });
    }

    res.status(200).json(induction);
  } catch (error) {
    console.error("Error fetching induction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getInductionforSelections = async (req, res) => {
  try {
    const id = req.params.id; // Fetching ID from route params
    console.log(`Fetching induction with ID: ${id}`);

    const induction = await Induction.findById(id)
      .populate("Inducties_id")
      .populate("I_participants")
      .populate("I_selected_participants"); // Finding induction by ID

    if (!induction) {
      return res.status(404).json({ error: "Induction not found" });
    }

    res.status(200).json(induction);
  } catch (error) {
    console.error("Error fetching induction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  fetchInductie,
  createInduction,
  getAllInductions,
  saveParticipants,
  getInduction,
  getInductionforSelections,
  sendNotification,
};
