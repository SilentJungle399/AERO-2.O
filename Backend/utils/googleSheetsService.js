const { google } = require("googleapis");
const path = require("path");

class GoogleSheetsService {
	constructor() {
		this.sheets = null;
		this.spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
		this.init();
	}

	async init() {
		try {
			if (!this.spreadsheetId) {
				console.error("GOOGLE_SPREADSHEET_ID not set in environment variables");
				return;
			}

			let auth;

			if (process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
				console.log("Using environment variables for authentication");
				auth = new google.auth.GoogleAuth({
					credentials: {
						client_email: process.env.GOOGLE_CLIENT_EMAIL,
						private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
					},
					scopes: ["https://www.googleapis.com/auth/spreadsheets"],
				});
			} else {
				// Fallback to credentials file
				console.log("Using credentials file for authentication");
				const credentialsPath = path.join(__dirname, "../config/google-credentials.json");
				const fs = require("fs");
				if (!fs.existsSync(credentialsPath)) {
					console.error("Google credentials file not found at:", credentialsPath);
					return;
				}

				auth = new google.auth.GoogleAuth({
					keyFile: credentialsPath,
					scopes: ["https://www.googleapis.com/auth/spreadsheets"],
				});
			}

			this.sheets = google.sheets({ version: "v4", auth });
			console.log("Google Sheets service initialized successfully");
		} catch (error) {
			console.error("Error initializing Google Sheets service:", error);
		}
	}

	async createWorksheetIfNotExists(worksheetName) {
		try {
			if (!this.sheets || !this.spreadsheetId) {
				console.error("Google Sheets not properly configured");
				return false;
			}

			// Get existing sheets
			const response = await this.sheets.spreadsheets.get({
				spreadsheetId: this.spreadsheetId,
			});

			const existingSheet = response.data.sheets.find(
				(sheet) => sheet.properties.title === worksheetName
			);

			if (!existingSheet) {
				// Create new worksheet
				await this.sheets.spreadsheets.batchUpdate({
					spreadsheetId: this.spreadsheetId,
					requestBody: {
						requests: [
							{
								addSheet: {
									properties: {
										title: worksheetName,
									},
								},
							},
						],
					},
				});
			}

			return true;
		} catch (error) {
			console.error("Error creating/checking worksheet:", error);
			return false;
		}
	}

	async writeRegistrationToSheet(registrationData, eventName) {
		try {
			if (!this.sheets || !this.spreadsheetId) {
				console.error("Google Sheets not properly configured");
				return false;
			}

			// Clean event name for worksheet title (remove special characters)
			const worksheetName = eventName.replace(/[^a-zA-Z0-9\s]/g, "").substring(0, 31);

			// Ensure worksheet exists
			await this.createWorksheetIfNotExists(worksheetName);

			// Prepare header row
			const headers = [
				"Registration ID",
				"User ID",
				"Token Number",
				"Registration Date",
				"Status",
			];

			// Add form question headers
			if (registrationData.form_responses && registrationData.form_responses.length > 0) {
				registrationData.form_responses.forEach((response) => {
					headers.push(response.question_text);
				});
			}

			// Check if header row exists
			const existingData = await this.sheets.spreadsheets.values.get({
				spreadsheetId: this.spreadsheetId,
				range: `${worksheetName}!A1:ZZ1`,
			});

			// If no data exists, add headers
			if (!existingData.data.values || existingData.data.values.length === 0) {
				await this.sheets.spreadsheets.values.update({
					spreadsheetId: this.spreadsheetId,
					range: `${worksheetName}!A1`,
					valueInputOption: "RAW",
					requestBody: {
						values: [headers],
					},
				});
			}

			// Prepare data row
			const dataRow = [
				registrationData._id.toString(),
				registrationData.user_id.toString(),
				registrationData.token_number,
				registrationData.registration_date.toISOString(),
				registrationData.status,
			];

			// Add form responses
			if (registrationData.form_responses && registrationData.form_responses.length > 0) {
				registrationData.form_responses.forEach((response) => {
					// Handle different response types
					let answerValue = response.answer;
					if (
						response.question_type === "file" &&
						typeof answerValue === "string" &&
						answerValue.startsWith("data:")
					) {
						answerValue = "FILE_UPLOADED"; // Replace data URI with placeholder
					}
					dataRow.push(answerValue);
				});
			}

			// Get the next row to append to
			const existingRows = await this.sheets.spreadsheets.values.get({
				spreadsheetId: this.spreadsheetId,
				range: `${worksheetName}!A:A`,
			});

			const nextRow = (existingRows.data.values?.length || 0) + 1;

			// Append the data
			await this.sheets.spreadsheets.values.update({
				spreadsheetId: this.spreadsheetId,
				range: `${worksheetName}!A${nextRow}`,
				valueInputOption: "RAW",
				requestBody: {
					values: [dataRow],
				},
			});

			console.log(
				`Registration data written to Google Sheets: ${worksheetName}, Row: ${nextRow}`
			);
			return true;
		} catch (error) {
			console.error("Error writing to Google Sheets:", error);
			return false;
		}
	}

	async bulkWriteRegistrations(registrations, eventName) {
		try {
			if (!this.sheets || !this.spreadsheetId || !registrations.length) {
				console.error("Google Sheets not properly configured or no registrations provided");
				return false;
			}

			// Clean event name for worksheet title
			const worksheetName = eventName.replace(/[^a-zA-Z0-9\s]/g, "").substring(0, 31);

			// Ensure worksheet exists
			await this.createWorksheetIfNotExists(worksheetName);

			// Prepare headers based on the first registration
			const headers = [
				"Registration ID",
				"User ID",
				"Token Number",
				"Registration Date",
				"Status",
			];

			// Add form question headers from the first registration
			if (registrations[0].form_responses && registrations[0].form_responses.length > 0) {
				registrations[0].form_responses.forEach((response) => {
					headers.push(response.question_text);
				});
			}

			// Prepare all data rows
			const dataRows = [headers];

			registrations.forEach((registration) => {
				const dataRow = [
					registration._id.toString(),
					registration.user_id.toString(),
					registration.token_number,
					registration.registration_date.toISOString(),
					registration.status,
				];

				// Add form responses
				if (registration.form_responses && registration.form_responses.length > 0) {
					registration.form_responses.forEach((response) => {
						let answerValue = response.answer;
						if (
							response.question_type === "file" &&
							typeof answerValue === "string" &&
							answerValue.startsWith("data:")
						) {
							answerValue = "FILE_UPLOADED";
						}
						dataRow.push(answerValue);
					});
				}

				dataRows.push(dataRow);
			});

			// Clear existing data and write new data
			await this.sheets.spreadsheets.values.clear({
				spreadsheetId: this.spreadsheetId,
				range: `${worksheetName}!A:ZZ`,
			});

			await this.sheets.spreadsheets.values.update({
				spreadsheetId: this.spreadsheetId,
				range: `${worksheetName}!A1`,
				valueInputOption: "RAW",
				requestBody: {
					values: dataRows,
				},
			});

			console.log(`Bulk registration data written to Google Sheets: ${worksheetName}`);
			return true;
		} catch (error) {
			console.error("Error bulk writing to Google Sheets:", error);
			return false;
		}
	}
}

module.exports = new GoogleSheetsService();
