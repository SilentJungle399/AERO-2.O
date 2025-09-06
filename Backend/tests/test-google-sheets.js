// Test script for Google Sheets integration
// Run this after setting up your credentials and environment variables

// Load environment variables
require("dotenv").config();

const googleSheetsService = require("./utils/googleSheetsService");
const path = require("path");
const fs = require("fs");

async function testGoogleSheetsConnection() {
	console.log("Testing Google Sheets connection...");

	// Check prerequisites
	console.log("Checking prerequisites...");

	// Check if .env file exists
	const envPath = path.join(__dirname, ".env");
	if (!fs.existsSync(envPath)) {
		console.log("❌ .env file not found. Please create it from .env.example");
		return;
	}

	// Check if GOOGLE_SPREADSHEET_ID is set
	if (!process.env.GOOGLE_SPREADSHEET_ID) {
		console.log("❌ GOOGLE_SPREADSHEET_ID not set in environment variables");
		console.log("Please set GOOGLE_SPREADSHEET_ID in your .env file");
		return;
	}

	// Check if credentials file exists
	const credentialsPath = path.join(__dirname, "config", "google-credentials.json");
	if (!fs.existsSync(credentialsPath)) {
		console.log("❌ google-credentials.json not found in config/ directory");
		console.log("Please add your Google service account credentials file");
		return;
	}

	// Check if credentials file is valid JSON
	try {
		const credentialsContent = fs.readFileSync(credentialsPath, "utf8");
		const credentials = JSON.parse(credentialsContent);
		if (!credentials.private_key || !credentials.client_email) {
			console.log("❌ Invalid credentials file. Missing private_key or client_email");
			return;
		}
	} catch (error) {
		console.log("❌ Invalid credentials file format:", error.message);
		return;
	}

	console.log("✅ Prerequisites check passed");
	console.log(`✅ Spreadsheet ID: ${process.env.GOOGLE_SPREADSHEET_ID}`);

	try {
		// Test data similar to workshop registration
		const testRegistration = {
			_id: "test_registration_id",
			user_id: "test_user_object_id_string",
			registration_date: new Date(),
			status: "registered",
			form_responses: [
				{
					question_text: "What is your experience level?",
					question_type: "option",
					answer: "Beginner",
				},
				{
					question_text: "Why do you want to join this workshop?",
					question_type: "long",
					answer: "I am interested in learning about aeromodelling and want to build my first model.",
				},
				{
					question_text: "Your Full Name",
					question_type: "short",
					answer: "John Doe",
				},
				{
					question_text: "Your Email",
					question_type: "short",
					answer: "john@example.com",
				},
			],
		};

		console.log("Attempting to write to Google Sheets...");

		// Add timeout to prevent hanging
		const timeoutPromise = new Promise((_, reject) => {
			setTimeout(() => reject(new Error("Operation timed out after 30 seconds")), 30000);
		});

		const writePromise = googleSheetsService.writeRegistrationToSheet(
			testRegistration,
			"Test Workshop"
		);

		const success = await Promise.race([writePromise, timeoutPromise]);

		if (success) {
			console.log("✅ Google Sheets integration test successful!");
			console.log("Check your Google Sheet for the test data.");
		} else {
			console.log("❌ Google Sheets integration test failed.");
			console.log("Please check your configuration and credentials.");
		}
	} catch (error) {
		console.error("❌ Test failed with error:", error.message);
		if (error.message.includes("timeout")) {
			console.log("This might indicate authentication or network issues.");
			console.log("Please check:");
			console.log("1. The service account has access to the Google Sheet");
			console.log("2. The Google Sheet ID is correct");
			console.log("3. Your internet connection is working");
		}
	}
}

// Run the test
testGoogleSheetsConnection();
