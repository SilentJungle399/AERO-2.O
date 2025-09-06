const FormDraft = require("../models/FormDraft");
const { jwtDecode } = require("jwt-decode");

// Save or update form draft
const saveDraft = async (req, res) => {
	try {
		const { eventId, formData, formType = "workshop" } = req.body;
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

		if (!eventId || !formData) {
			return res.status(400).json({ error: "Event ID and form data are required" });
		}

		// Use upsert to create or update the draft
		const draft = await FormDraft.findOneAndUpdate(
			{
				user_id: userId,
				form_type: formType,
				form_reference_id: eventId,
			},
			{
				draft_data: formData,
				updated_at: new Date(),
			},
			{
				upsert: true,
				new: true,
			}
		);

		res.status(200).json({
			success: true,
			message: "Draft saved successfully",
			draft: draft,
		});
	} catch (error) {
		console.error("Error saving draft:", error);
		res.status(500).json({ error: "Failed to save draft" });
	}
};

// Get form draft
const getDraft = async (req, res) => {
	try {
		const { eventId } = req.params;
		const { formType = "workshop" } = req.query;
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

		if (!eventId) {
			return res.status(400).json({ error: "Event ID is required" });
		}

		const draft = await FormDraft.findOne({
			user_id: userId,
			form_type: formType,
			form_reference_id: eventId,
		});

		if (!draft) {
			return res.status(200).json({
				success: true,
				draft: null,
				message: "No draft found",
			});
		}

		res.status(200).json({
			success: true,
			draft: draft.draft_data,
			lastUpdated: draft.updated_at,
		});
	} catch (error) {
		console.error("Error getting draft:", error);
		res.status(500).json({ error: "Failed to get draft" });
	}
};

// Delete form draft (useful when form is submitted)
const deleteDraft = async (req, res) => {
	try {
		const { eventId } = req.params;
		const { formType = "workshop" } = req.query;
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

		if (!eventId) {
			return res.status(400).json({ error: "Event ID is required" });
		}

		await FormDraft.findOneAndDelete({
			user_id: userId,
			form_type: formType,
			form_reference_id: eventId,
		});

		res.status(200).json({
			success: true,
			message: "Draft deleted successfully",
		});
	} catch (error) {
		console.error("Error deleting draft:", error);
		res.status(500).json({ error: "Failed to delete draft" });
	}
};

module.exports = {
	saveDraft,
	getDraft,
	deleteDraft,
};
