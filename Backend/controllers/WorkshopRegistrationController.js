const EventModel = require("../models/Events");
const User = require("../models/usermodel");
const FormDraft = require("../models/FormDraft");
const WorkshopRegistration = require("../models/WorkshopRegistration");
const { jwtDecode } = require("jwt-decode");
const googleSheetsService = require("../utils/googleSheetsService");

// Submit workshop registration
const submitRegistration = async (req, res) => {
	try {
		const { eventId } = req.params;
		const authHeader = req.headers.authorization;

		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return res.status(401).json({ error: "No token provided" });
		}

		const token = authHeader.split(" ")[1];
		let decoded;
		try {
			decoded = jwtDecode(token);
		} catch (error) {
			return res.status(401).json({ error: "Invalid token" });
		}

		const userId = decoded.id;

		// Get the event
		const event = await EventModel.findById(eventId);
		if (!event) {
			return res.status(404).json({ error: "Event not found" });
		}

		if (!event.is_workshop) {
			return res.status(400).json({ error: "This is not a workshop" });
		}

		if (!event.active_status) {
			return res.status(400).json({ error: "Registration is closed for this workshop" });
		}

		// Check if user is already registered
		const existingRegistration = await WorkshopRegistration.findOne({
			user_id: userId,
			event_id: eventId,
		});

		if (existingRegistration) {
			return res.status(400).json({ error: "You are already registered for this workshop" });
		}

		// Get the user
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		// Process form responses
		const formFields = event.form || [];
		const formAnswers = req.body || {};

		// Validate that all required fields are filled
		const missingFields = formFields.filter((field) => {
			const value = formAnswers[field.key];
			if (field.type === "file") {
				return !value; // For files, just check if value exists (should be data URI)
			}
			return !value || (typeof value === "string" && !value.trim());
		});

		if (missingFields.length > 0) {
			return res.status(400).json({
				error: "Missing required fields",
				missingFields: missingFields.map((f) => f.question),
			});
		}

		// Create form responses array with question details
		const formResponses = formFields.map((field) => ({
			question_key: field.key,
			question_text: field.question,
			question_type: field.type,
			answer: formAnswers[field.key],
		}));

		// Create registration record
		const workshopRegistration = new WorkshopRegistration({
			user_id: userId,
			event_id: eventId,
			form_responses: formResponses,
		});

		await workshopRegistration.save();

		// Update event participant count and token number
		event.participants_id.push(userId);
		event.total_participant_count += 1;

		await event.save();

		// Delete the draft after successful submission
		await FormDraft.findOneAndDelete({
			user_id: userId,
			form_type: "workshop",
			form_reference_id: eventId,
		});

		// Write registration data to Google Sheets
		try {
			await googleSheetsService.writeRegistrationToSheet(workshopRegistration, event.E_name);
		} catch (sheetsError) {
			console.error("Error writing to Google Sheets:", sheetsError);
			// Don't fail the registration if Google Sheets fails
		}

		res.status(200).json({
			success: true,
			message: "Registration successful",
			registrationId: workshopRegistration._id,
			registrationData: {
				user_name: user.full_name,
				user_email: user.email,
				event_name: event.E_name,
				registration_date: workshopRegistration.registration_date,
			},
		});
	} catch (error) {
		console.error("Error submitting registration:", error);
		res.status(500).json({ error: "Failed to submit registration" });
	}
};

// Get user's registration status for an event
const getRegistrationStatus = async (req, res) => {
	try {
		const { eventId } = req.params;
		const authHeader = req.headers.authorization;

		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return res.status(401).json({ error: "No token provided" });
		}

		const token = authHeader.split(" ")[1];
		let decoded;
		try {
			decoded = jwtDecode(token);
		} catch (error) {
			return res.status(401).json({ error: "Invalid token" });
		}

		const userId = decoded.id;

		const event = await EventModel.findById(eventId);
		if (!event) {
			return res.status(404).json({ error: "Event not found" });
		}

		const registration = await WorkshopRegistration.findOne({
			user_id: userId,
			event_id: eventId,
		});

		const isRegistered = !!registration;

		res.status(200).json({
			success: true,
			isRegistered,
			registration: registration
				? {
						registrationDate: registration.registration_date,
						status: registration.status,
				  }
				: null,
			eventName: event.E_name,
			registrationOpen: event.active_status,
		});
	} catch (error) {
		console.error("Error checking registration status:", error);
		res.status(500).json({ error: "Failed to check registration status" });
	}
};

// Get all registrations for an event (Admin only)
const getEventRegistrations = async (req, res) => {
	try {
		const { eventId } = req.params;

		const event = await EventModel.findById(eventId);
		if (!event) {
			return res.status(404).json({ error: "Event not found" });
		}

		const registrations = await WorkshopRegistration.find({ event_id: eventId }).sort({
			registration_date: -1,
		});

		res.status(200).json({
			success: true,
			event: {
				name: event.E_name,
				totalParticipants: registrations.length,
			},
			registrations: registrations.map((reg) => ({
				registrationId: reg._id,
				registrationDate: reg.registration_date,
				status: reg.status,
				userId: reg.user_id,
				responses: reg.form_responses,
			})),
		});
	} catch (error) {
		console.error("Error getting event registrations:", error);
		res.status(500).json({ error: "Failed to get event registrations" });
	}
};

// Get a specific registration by ID (Admin only)
const getRegistrationById = async (req, res) => {
	try {
		const { registrationId } = req.params;

		const registration = await WorkshopRegistration.findById(registrationId).populate(
			"event_id",
			"E_name E_description"
		);

		if (!registration) {
			return res.status(404).json({ error: "Registration not found" });
		}

		res.status(200).json({
			success: true,
			registration: {
				id: registration._id,
				registrationDate: registration.registration_date,
				status: registration.status,
				userId: registration.user_id,
				event: registration.event_id,
				responses: registration.form_responses.map((response) => ({
					question: response.question_text,
					type: response.question_type,
					key: response.question_key,
					answer: response.answer,
				})),
			},
		});
	} catch (error) {
		console.error("Error getting registration:", error);
		res.status(500).json({ error: "Failed to get registration" });
	}
};

// Export all registrations for an event to Google Sheets (Admin only)
const exportRegistrationsToSheets = async (req, res) => {
	try {
		const { eventId } = req.params;

		const event = await EventModel.findById(eventId);
		if (!event) {
			return res.status(404).json({ error: "Event not found" });
		}

		const registrations = await WorkshopRegistration.find({ event_id: eventId }).sort({
			registration_date: 1,
		});

		if (registrations.length === 0) {
			return res.status(404).json({ error: "No registrations found for this event" });
		}

		// Export to Google Sheets
		const success = await googleSheetsService.bulkWriteRegistrations(
			registrations,
			event.E_name
		);

		if (success) {
			res.status(200).json({
				success: true,
				message: "Registrations exported to Google Sheets successfully",
				eventName: event.E_name,
				totalRegistrations: registrations.length,
			});
		} else {
			res.status(500).json({ error: "Failed to export to Google Sheets" });
		}
	} catch (error) {
		console.error("Error exporting registrations to Google Sheets:", error);
		res.status(500).json({ error: "Failed to export registrations" });
	}
};

module.exports = {
	submitRegistration,
	getRegistrationStatus,
	getEventRegistrations,
	getRegistrationById,
	exportRegistrationsToSheets,
};
