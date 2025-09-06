const WorkshopRegistration = require("../models/WorkshopRegistration");

/**
 * Serve asset from form submission as CDN
 * Route: GET /asset/:form_submission_id/:question_key
 */
const serveFormAsset = async (req, res) => {
	try {
		const { form_submission_id, question_key } = req.params;

		// Find the form submission by ID
		const registration = await WorkshopRegistration.findById(form_submission_id);

		if (!registration) {
			return res.status(404).json({
				success: false,
				error: "Form submission not found",
			});
		}

		// Find the specific form response with the given question_key
		const formResponse = registration.form_responses.find(
			(response) => response.question_key === question_key
		);

		if (!formResponse) {
			return res.status(404).json({
				success: false,
				error: "Question key not found in form submission",
			});
		}

		// Check if it's a file type response
		if (formResponse.question_type !== "file") {
			return res.status(400).json({
				success: false,
				error: "This question is not a file upload type",
			});
		}

		// Check if the answer contains a data URI
		const dataUri = formResponse.answer;
		if (!dataUri || typeof dataUri !== "string" || !dataUri.startsWith("data:")) {
			return res.status(404).json({
				success: false,
				error: "No file data found for this question",
			});
		}

		try {
			// Parse the data URI
			const matches = dataUri.match(/^data:([^;]+);base64,(.+)$/);
			if (!matches) {
				return res.status(400).json({
					success: false,
					error: "Invalid file data format",
				});
			}

			const mimeType = matches[1];
			const base64Data = matches[2];
			const buffer = Buffer.from(base64Data, "base64");

			// Set appropriate headers for CDN-like behavior
			res.set({
				"Content-Type": mimeType,
				"Content-Length": buffer.length,
				"Cache-Control": "public, max-age=31536000", // Cache for 1 year
				ETag: `"${form_submission_id}-${question_key}"`,
				"Content-Disposition": `inline; filename="${question_key}-${form_submission_id}"`,
			});

			// Send the file buffer
			res.send(buffer);
		} catch (parseError) {
			console.error("Error parsing data URI:", parseError);
			return res.status(500).json({
				success: false,
				error: "Failed to process file data",
			});
		}
	} catch (error) {
		console.error("Error serving form asset:", error);
		res.status(500).json({
			success: false,
			error: "Internal server error",
		});
	}
};

module.exports = {
	serveFormAsset,
};
