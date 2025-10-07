const Induction = require("../models/Inductions");
const InductiesModel = require("../models/InductiesModel");
const {
	sendParticipationConfirmationEmail,
	sendSelectionConfirmationEmail,
} = require("../middlewares/nodemailerMiddleware");
const NotificationModel = require("../models/notificationmodels/Notifications");
const User = require("../models/usermodel");
const InductionModel = require("../models/Inductions");
const googleSheetsService = require("../utils/googleSheetsService");

// Helper function to convert induction data to Google Sheets format
const convertInductionDataForSheets = (participant, user, induction) => {
	return {
		_id: participant._id,
		user_id: participant.user_id,
		registration_date: participant.createdAt || new Date(),
		status: "registered",
		form_responses: [
			{
				question_key: "name",
				question_text: "Name",
				question_type: "short",
				answer: participant.name,
			},
			{
				question_key: "rollNo",
				question_text: "Roll Number",
				question_type: "short",
				answer: participant.roll_no,
			},
			{
				question_key: "branch",
				question_text: "Branch",
				question_type: "short",
				answer: participant.branch,
			},
			{
				question_key: "email",
				question_text: "Email",
				question_type: "short",
				answer: participant.email,
			},
			{
				question_key: "phone",
				question_text: "Phone Number",
				question_type: "short",
				answer: participant.phone_number,
			},
			{
				question_key: "teamPreference",
				question_text: "Team Preference",
				question_type: "option",
				answer: participant.team_preference,
			},
			{
				question_key: "subTeamPreference",
				question_text: "Sub Team Preference",
				question_type: "option",
				answer: participant.sub_team_preference,
			},
			{
				question_key: "year",
				question_text: "Year",
				question_type: "short",
				answer: participant.year?.toString(),
			},
		],
	};
};

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
			newNotification.notificaitons_files.push({
				url: downloadURL,
				file_type: file_type.contentType,
			});
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
					read: false, // Default to unread
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
					participantId,
					In_id,
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
		console.log(uid);

		if (!induction) {
			return res.status(404).json({ message: "Induction not found" });
		}

		// const uidString = uid.toString();
		// const inducteeId = induction.I_participants.find((inductee) => {
		// 	console.log("Checking inductee:", inductee.toString(), "against uid:", uidString);
		// 	return inductee.toString() === uidString;
		// });

		// if (!inducteeId) {
		// 	return res.status(404).json({ message: "Inductee not found in this induction" });
		// }

		// console.log(inducteeId);

		// Fetch the inductee's details from the InductiesModel using the found ID
		const inductee = await InductiesModel.find({ user_id: uid });

		if (!inductee) {
			return res.status(404).json({ message: "Inductee details not found" });
		}

		// Return the inductee's details
		return res.status(200).json(inductee);
	} catch (error) {
		console.error("Error fetching inductee:", error);
		return res.status(500).json({ message: "Server error" });
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

		// Write registration data to Google Sheets (legacy format)
		try {
			// Create a modified version of the participant data for sheets
			const modifiedParticipant = {
				...savedParticipant.toObject(),
				roll_no: rollNumber, // Use rollNumber from the legacy format
				phone_number: phoneNumber,
				queries: queries,
				hobbies: hobbies,
				skills: skills,
			};
			const sheetsData = convertInductionDataForSheets(modifiedParticipant, null, induction);

			// Add additional fields for legacy registrations
			sheetsData.form_responses.push(
				{
					question_key: "queries",
					question_text: "Queries/Questions",
					question_type: "long",
					answer: queries || "",
				},
				{
					question_key: "hobbies",
					question_text: "Hobbies",
					question_type: "long",
					answer: hobbies || "",
				},
				{
					question_key: "skills",
					question_text: "Skills",
					question_type: "long",
					answer: skills || "",
				}
			);

			await googleSheetsService.writeRegistrationToSheet(sheetsData, inductionName);
			console.log(`Legacy induction registration written to Google Sheets: ${inductionName}`);
		} catch (sheetsError) {
			console.error("Error writing legacy registration to Google Sheets:", sheetsError);
			// Don't fail the registration if Google Sheets fails
		}

		res.status(201).json("Registration Succesfull. Please check you mail for more details."); // Respond with the saved participant document
	} catch (error) {
		res.status(500).json({ error: `Failed to store participant details: ${error.message}` });
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

// New induction registration function for the updated form
const registerForInduction = async (req, res) => {
	try {
		const inductionId = req.params.id;
		const userId = req.user.id; // From authMiddleware
		const { name, rollNo, branch, email, phone, teamPreference, subTeamPreference } = req.body;

		// Check if induction exists
		const induction = await Induction.findById(inductionId);
		if (!induction) {
			return res.status(404).json({ error: "Induction not found" });
		}

		// Check if user already registered
		if (induction.I_participants.includes(userId)) {
			return res.status(400).json({ error: "User already registered for this induction" });
		}

		// Create new participant record
		const newParticipant = new InductiesModel({
			user_id: userId,
			name,
			email,
			roll_no: rollNo,
			branch,
			phone_number: phone,
			team_preference: teamPreference,
			sub_team_preference: subTeamPreference,
			year: new Date().getFullYear(), // Assuming current year
		});

		// Save the participant
		const savedParticipant = await newParticipant.save();

		// Update induction with participant
		induction.I_participants.push(userId);
		induction.Inducties_id.push(savedParticipant._id);
		await induction.save();

		// Send confirmation email
		// await sendParticipationConfirmationEmail(
		//   name,
		//   email,
		//   induction.I_name,
		//   induction.I_date,
		//   rollNo,
		//   branch,
		//   new Date().getFullYear(),
		//   phone,
		//   "", // queries
		//   teamPreference,
		//   "", // hobbies
		//   "", // skills
		//   induction.I_banner_img
		// );

		// Write registration data to Google Sheets
		try {
			const sheetsData = convertInductionDataForSheets(savedParticipant, req.user, induction);
			await googleSheetsService.writeRegistrationToSheet(sheetsData, induction.I_name);
			console.log(`Induction registration written to Google Sheets: ${induction.I_name}`);
		} catch (sheetsError) {
			console.error("Error writing to Google Sheets:", sheetsError);
			// Don't fail the registration if Google Sheets fails
		}

		res.status(201).json({
			success: true,
			message: "Registration successful. Please check your email for confirmation.",
			registrationData: {
				event_name: induction.I_name,
				user_name: name,
				user_email: email,
				registration_date: new Date(),
			},
			registrationId: savedParticipant._id,
		});
	} catch (error) {
		console.error("Induction registration error:", error);
		res.status(500).json({ error: `Registration failed: ${error.message}` });
	}
};

// Check if user is already registered for induction
const getInductionRegistrationStatus = async (req, res) => {
	try {
		const inductionId = req.params.id;
		const userId = req.user.id; // From authMiddleware

		// Check if induction exists
		const induction = await Induction.findById(inductionId);
		if (!induction) {
			return res.status(404).json({ error: "Induction not found" });
		}

		// Check if user is registered
		const isRegistered = induction.I_participants.includes(userId);

		res.status(200).json({
			success: true,
			isRegistered,
			inductionName: induction.I_name,
		});
	} catch (error) {
		console.error("Error checking registration status:", error);
		res.status(500).json({ error: "Failed to check registration status" });
	}
};

// Export all induction registrations to Google Sheets
const exportInductionRegistrationsToSheets = async (req, res) => {
	try {
		const inductionId = req.params.id;

		// Fetch the induction
		const induction = await Induction.findById(inductionId).populate("Inducties_id");
		if (!induction) {
			return res.status(404).json({ error: "Induction not found" });
		}

		if (!induction.Inducties_id || induction.Inducties_id.length === 0) {
			return res.status(200).json({
				success: true,
				message: "No registrations found to export",
				totalExported: 0,
			});
		}

		// Convert all participant data to sheets format
		const sheetsDataArray = induction.Inducties_id.map((participant) => {
			return convertInductionDataForSheets(participant, null, induction);
		});

		// Use bulk write to Google Sheets
		const success = await googleSheetsService.bulkWriteRegistrations(
			sheetsDataArray,
			induction.I_name
		);

		if (success) {
			res.status(200).json({
				success: true,
				message: `Successfully exported ${sheetsDataArray.length} registrations to Google Sheets`,
				totalExported: sheetsDataArray.length,
				worksheetName: induction.I_name,
			});
		} else {
			res.status(500).json({
				success: false,
				error: "Failed to export registrations to Google Sheets",
			});
		}
	} catch (error) {
		console.error("Error exporting induction registrations to Google Sheets:", error);
		res.status(500).json({
			success: false,
			error: `Export failed: ${error.message}`,
		});
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
	registerForInduction,
	getInductionRegistrationStatus,
	exportInductionRegistrationsToSheets,
};
