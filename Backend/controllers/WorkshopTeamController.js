const WorkshopTeam = require("../models/WorkshopTeam");
const WorkshopRegistration = require("../models/WorkshopRegistration");
const EventModel = require("../models/Events");
const User = require("../models/usermodel");
const { jwtDecode } = require("jwt-decode");

// Helper function to verify user authentication
const verifyUserAuth = (req) => {
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		throw new Error("No token provided");
	}

	const token = authHeader.split(" ")[1];
	try {
		const decoded = jwtDecode(token);
		return decoded.id;
	} catch (error) {
		throw new Error("Invalid token");
	}
};

// Helper function to check if user is registered for the workshop
const checkUserRegistration = async (userId, eventId) => {
	const registration = await WorkshopRegistration.findOne({
		user_id: userId,
		event_id: eventId,
	});

	if (!registration || !registration.shortlisted) {
		throw new Error("User is not registered for this workshop");
	}

	return registration;
};

// Helper function to check if user is already in a team for this event
const checkExistingTeamMembership = async (userId, eventId) => {
	const existingTeam = await WorkshopTeam.findOne({
		event_id: eventId,
		$or: [{ team_leader: userId }, { "team_members.user_id": userId }],
	});

	return existingTeam;
};

// Create a new team
const createTeam = async (req, res) => {
	try {
		const { eventId } = req.params;
		const { team_name, max_members } = req.body;

		// Verify user authentication
		const userId = verifyUserAuth(req);

		// Check if event exists and is a workshop
		const event = await EventModel.findById(eventId);
		if (!event) {
			return res.status(404).json({
				success: false,
				message: "Event not found",
			});
		}

		if (!event.is_workshop) {
			return res.status(400).json({
				success: false,
				message: "This event is not a workshop",
			});
		}

		// Check if user is registered for this workshop
		await checkUserRegistration(userId, eventId);

		// Check if user is already in a team for this event
		const existingTeam = await checkExistingTeamMembership(userId, eventId);
		if (existingTeam) {
			return res.status(400).json({
				success: false,
				message: "You are already part of a team for this workshop",
			});
		}

		// Generate unique team code
		let teamCode;
		let isUnique = false;
		let attempts = 0;
		const maxAttempts = 10;

		while (!isUnique && attempts < maxAttempts) {
			teamCode = WorkshopTeam.generateTeamCode();
			const existingTeamWithCode = await WorkshopTeam.findOne({
				team_code: teamCode,
				event_id: eventId,
			});

			if (!existingTeamWithCode) {
				isUnique = true;
			}
			attempts++;
		}

		if (!isUnique) {
			return res.status(500).json({
				success: false,
				message: "Failed to generate unique team code. Please try again.",
			});
		}

		// Get form input data from database for this user
		const registration = await WorkshopRegistration.findOne({
			user_id: userId,
			event_id: eventId,
		});

		// get a key value pair object from form_responses array
		const formResponses = {};
		registration.form_responses.forEach((response) => {
			formResponses[response.question_key] = response.answer;
		});

		const newTeam = new WorkshopTeam({
			team_code: teamCode,
			event_id: eventId,
			team_leader: userId,
			team_name: team_name || null,
			max_members: max_members || 4,
			team_members: [
				{
					user_id: userId,
					role: "leader",
					joined_at: new Date(),
					name: formResponses.name,
					email: formResponses.email,
					roll_number: formResponses.rollNo,
				},
			],
		});

		await newTeam.save();

		res.status(201).json({
			success: true,
			message: "Team created successfully",
			teamCode: newTeam.team_code,
			team: {
				id: newTeam._id,
				team_code: newTeam.team_code,
				team_name: newTeam.team_name,
				team_leader: newTeam.team_leader,
				current_members: newTeam.current_members_count,
				max_members: newTeam.max_members,
				status: newTeam.status,
				created_at: newTeam.created_at,
			},
		});
	} catch (error) {
		console.error("Error creating team:", error);

		if (error.message === "No token provided" || error.message === "Invalid token") {
			return res.status(401).json({
				success: false,
				message: error.message,
			});
		}

		if (error.message === "User is not registered for this workshop") {
			return res.status(403).json({
				success: false,
				message: error.message,
			});
		}

		res.status(500).json({
			success: false,
			message: "Internal server error while creating team",
		});
	}
};

// Join an existing team
const joinTeam = async (req, res) => {
	try {
		const { eventId } = req.params;
		const { teamCode } = req.body;

		if (!teamCode) {
			return res.status(400).json({
				success: false,
				message: "Team code is required",
			});
		}

		// Verify user authentication
		const userId = verifyUserAuth(req);

		// Check if event exists and is a workshop
		const event = await EventModel.findById(eventId);
		if (!event) {
			return res.status(404).json({
				success: false,
				message: "Event not found",
			});
		}

		if (!event.is_workshop) {
			return res.status(400).json({
				success: false,
				message: "This event is not a workshop",
			});
		}

		// Check if user is registered for this workshop
		await checkUserRegistration(userId, eventId);

		// Check if user is already in a team for this event
		const existingTeam = await checkExistingTeamMembership(userId, eventId);
		if (existingTeam) {
			return res.status(400).json({
				success: false,
				message: "You are already part of a team for this workshop",
			});
		}

		// Find the team by code and event
		const team = await WorkshopTeam.findOne({
			team_code: teamCode.toUpperCase(),
			event_id: eventId,
		});

		if (!team) {
			return res.status(404).json({
				success: false,
				message: "Team not found with the provided code",
			});
		}

		// Check if team is active
		if (team.status !== "active") {
			return res.status(400).json({
				success: false,
				message: "This team is not accepting new members",
			});
		}

		// Check if team is full
		if (team.is_full) {
			return res.status(400).json({
				success: false,
				message: "This team is already full",
			});
		}

		const registration = await WorkshopRegistration.findOne({
			user_id: userId,
			event_id: eventId,
		});

		if (!registration) {
			return res.status(403).json({
				success: false,
				message: "User is not registered for this workshop",
			});
		}

		const formResponse = {};
		registration.form_responses.forEach((response) => {
			formResponse[response.question_key] = response.answer;
		});

		// Add user to team
		try {
			team.addMember(userId, "member", {
				name: formResponse.name,
				email: formResponse.email,
				roll_number: formResponse.rollNo,
			});
			await team.save();
		} catch (memberError) {
			return res.status(400).json({
				success: false,
				message: memberError.message,
			});
		}

		// Populate team data for response
		await team.populate("team_leader", "name email");
		await team.populate("team_members.user_id", "name email");

		res.status(200).json({
			success: true,
			message: "Successfully joined the team",
			team: {
				id: team._id,
				team_code: team.team_code,
				team_name: team.team_name,
				team_leader: team.team_leader,
				team_members: team.team_members,
				current_members: team.current_members_count,
				max_members: team.max_members,
				status: team.status,
			},
		});
	} catch (error) {
		console.error("Error joining team:", error);

		if (error.message === "No token provided" || error.message === "Invalid token") {
			return res.status(401).json({
				success: false,
				message: error.message,
			});
		}

		if (error.message === "User is not registered for this workshop") {
			return res.status(403).json({
				success: false,
				message: error.message,
			});
		}

		res.status(500).json({
			success: false,
			message: "Internal server error while joining team",
		});
	}
};

// Get team information for a user in a specific workshop
const getTeamInfo = async (req, res) => {
	try {
		const { eventId } = req.params;

		// Verify user authentication
		const userId = verifyUserAuth(req);

		// Check if user is registered for this workshop
		await checkUserRegistration(userId, eventId);

		// Find user's team for this event
		const team = await WorkshopTeam.findOne({
			event_id: eventId,
			$or: [{ team_leader: userId }, { "team_members.user_id": userId }],
		})
			.populate("team_leader", "name email")
			.populate("team_members.user_id", "name email");

		if (!team) {
			return res.status(404).json({
				success: false,
				message: "You are not part of any team for this workshop",
			});
		}

		// Determine user's role in the team
		const userRole = team.team_leader.toString() === userId ? "leader" : "member";

		res.status(200).json({
			success: true,
			team: {
				id: team._id,
				team_code: team.team_code,
				team_name: team.team_name,
				team_leader: team.team_leader,
				team_members: team.team_members,
				current_members: team.current_members_count,
				max_members: team.max_members,
				status: team.status,
				user_role: userRole,
				created_at: team.created_at,
			},
		});
	} catch (error) {
		console.error("Error getting team info:", error);

		if (error.message === "No token provided" || error.message === "Invalid token") {
			return res.status(401).json({
				success: false,
				message: error.message,
			});
		}

		if (error.message === "User is not registered for this workshop") {
			return res.status(403).json({
				success: false,
				message: error.message,
			});
		}

		res.status(500).json({
			success: false,
			message: "Internal server error while fetching team information",
		});
	}
};

// Leave a team (only for non-leaders)
const leaveTeam = async (req, res) => {
	try {
		const { eventId } = req.params;

		// Verify user authentication
		const userId = verifyUserAuth(req);

		// Find user's team for this event
		const team = await WorkshopTeam.findOne({
			event_id: eventId,
			"team_members.user_id": userId,
		});

		if (!team) {
			return res.status(404).json({
				success: false,
				message: "You are not part of any team for this workshop",
			});
		}

		// Check if user is team leader
		if (team.team_leader.toString() === userId) {
			return res.status(400).json({
				success: false,
				message: "Team leaders cannot leave the team. You must disband the team instead.",
			});
		}

		// Remove user from team
		try {
			team.removeMember(userId);
			await team.save();
		} catch (memberError) {
			return res.status(400).json({
				success: false,
				message: memberError.message,
			});
		}

		res.status(200).json({
			success: true,
			message: "Successfully left the team",
		});
	} catch (error) {
		console.error("Error leaving team:", error);

		if (error.message === "No token provided" || error.message === "Invalid token") {
			return res.status(401).json({
				success: false,
				message: error.message,
			});
		}

		res.status(500).json({
			success: false,
			message: "Internal server error while leaving team",
		});
	}
};

// Disband team (only for team leaders)
const disbandTeam = async (req, res) => {
	try {
		const { eventId } = req.params;

		// Verify user authentication
		const userId = verifyUserAuth(req);

		// Find user's team for this event
		const team = await WorkshopTeam.findOne({
			event_id: eventId,
			team_leader: userId,
		});

		if (!team) {
			return res.status(404).json({
				success: false,
				message: "You are not the leader of any team for this workshop",
			});
		}

		await WorkshopTeam.deleteOne({ _id: team._id });

		res.status(200).json({
			success: true,
			message: "Team has been successfully disbanded",
		});
	} catch (error) {
		console.error("Error disbanding team:", error);

		if (error.message === "No token provided" || error.message === "Invalid token") {
			return res.status(401).json({
				success: false,
				message: error.message,
			});
		}

		res.status(500).json({
			success: false,
			message: "Internal server error while disbanding team",
		});
	}
};

// Get all teams for a workshop (admin only)
const getAllTeams = async (req, res) => {
	try {
		const { eventId } = req.params;

		// Note: You might want to add admin middleware here
		// For now, just verify user is authenticated
		const userId = verifyUserAuth(req);

		const teams = await WorkshopTeam.find({ event_id: eventId })
			.populate("team_leader", "name email")
			.populate("team_members.user_id", "name email")
			.sort({ created_at: -1 });

		res.status(200).json({
			success: true,
			teams: teams.map((team) => ({
				id: team._id,
				team_code: team.team_code,
				team_name: team.team_name,
				team_leader: team.team_leader,
				team_members: team.team_members,
				current_members: team.current_members_count,
				max_members: team.max_members,
				status: team.status,
				created_at: team.created_at,
			})),
		});
	} catch (error) {
		console.error("Error getting all teams:", error);

		if (error.message === "No token provided" || error.message === "Invalid token") {
			return res.status(401).json({
				success: false,
				message: error.message,
			});
		}

		res.status(500).json({
			success: false,
			message: "Internal server error while fetching teams",
		});
	}
};

module.exports = {
	createTeam,
	joinTeam,
	getTeamInfo,
	leaveTeam,
	disbandTeam,
	getAllTeams,
};
