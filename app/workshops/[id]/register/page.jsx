"use client";
import { useMemo, useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import { jwtDecode } from "jwt-decode";

const getOrdinalSuffix = (day) => {
	if (day > 3 && day < 21) return "th";
	switch (day % 10) {
		case 1:
			return "st";
		case 2:
			return "nd";
		case 3:
			return "rd";
		default:
			return "th";
	}
};

const formatTime = (time) => {
	const date = new Date(time);
	if (isNaN(date.getTime())) return "N/A";

	const day = date.getDate();
	const month = date.toLocaleString("default", { month: "short" });
	const year = date.getFullYear();
	const hours = date.getHours();
	const minutes = date.getMinutes().toString().padStart(2, "0");
	const ampm = hours >= 12 ? "PM" : "AM";
	const formattedHour = hours % 12 || 12;
	return `${day}${getOrdinalSuffix(day)} ${month} ${year}, ${formattedHour}:${minutes} ${ampm}`;
};

const WorkshopDetailsPage = () => {
	const router = useRouter();
	const params = useParams();
	const id = params?.id || "demo";

	const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
	const [event, setEvent] = useState(null);
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [formData, setFormData] = useState({});
	const [submitting, setSubmitting] = useState(false);
	const [draftSaved, setDraftSaved] = useState(false);
	const [savingDraft, setSavingDraft] = useState(false);
	const draftTimeoutRef = useRef(null);

	useEffect(() => {
		let aborted = false;
		const controller = new AbortController();

		const fetchEvent = async () => {
			setLoading(true);
			setError(null);
			try {
				const res = await fetch(`${API_BASE}/api/users/event/${id}`, {
					method: "GET",
					signal: controller.signal,
				});
				if (!res.ok) {
					throw new Error(`Failed to fetch event: ${res.status}`);
				}
				const data = await res.json();
				if (!aborted) {
					setEvent(data.event || data);
				}
			} catch (err) {
				if (!aborted) {
					console.error(err);
					setError(err.message || "Failed to load event");
				}
			} finally {
				if (!aborted) setLoading(false);
			}
		};

		fetchEvent();

		return () => {
			aborted = true;
			controller.abort();
		};
	}, [API_BASE, id]);

	function isTokenExpired(token) {
		try {
			if (!token || typeof token !== "string") return true;
			const decodedToken = jwtDecode(token);
			const currentTime = Math.floor(Date.now() / 1000);
			return Number(decodedToken.exp) < currentTime;
		} catch (error) {
			return true;
		}
	}

	// Fetch current user data
	const fetchUser = useCallback(async () => {
		const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
		if (!token || isTokenExpired(token)) return;

		try {
			const decoded = jwtDecode(token);
			const userId = decoded.id;

			const response = await fetch(`${API_BASE}/api/users/${userId}`, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			});

			if (response.ok) {
				const data = await response.json();
				setUser(data.user || data);
			}
		} catch (error) {
			console.error("Error fetching user:", error);
		}
	}, [API_BASE]);

	// Load draft data from backend
	const loadDraft = useCallback(async () => {
		const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
		if (!token || isTokenExpired(token)) return;

		try {
			const response = await fetch(`${API_BASE}/api/users/draft/${id}`, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			});

			if (response.ok) {
				const data = await response.json();
				if (data.success && data.draft) {
					setFormData(data.draft);
					setDraftSaved(true);
				}
			}
		} catch (error) {
			console.error("Error loading draft:", error);
		}
	}, [API_BASE, id]);

	// Save draft data to backend with debouncing
	const saveDraftToBackend = useCallback(
		async (formDataToSave) => {
			const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
			if (!token || isTokenExpired(token)) return;

			// Don't save empty form data
			if (Object.keys(formDataToSave).length === 0) return;

			setSavingDraft(true);
			try {
				const response = await fetch(`${API_BASE}/api/users/draft/save`, {
					method: "POST",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						eventId: id,
						formData: formDataToSave,
					}),
				});

				if (response.ok) {
					setDraftSaved(true);
					setTimeout(() => setDraftSaved(false), 2000); // Hide "saved" indicator after 2 seconds
				}
			} catch (error) {
				console.error("Error saving draft:", error);
			} finally {
				setSavingDraft(false);
			}
		},
		[API_BASE, id]
	);

	// Debounced draft saving
	const debouncedSaveDraft = useCallback(
		(formDataToSave) => {
			if (draftTimeoutRef.current) {
				clearTimeout(draftTimeoutRef.current);
			}

			draftTimeoutRef.current = setTimeout(() => {
				saveDraftToBackend(formDataToSave);
			}, 1000); // Save 1 second after user stops typing
		},
		[saveDraftToBackend]
	);

	// Delete draft when form is successfully submitted
	const deleteDraft = useCallback(async () => {
		const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
		if (!token || isTokenExpired(token)) return;

		try {
			await fetch(`${API_BASE}/api/users/draft/${id}`, {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			});
		} catch (error) {
			console.error("Error deleting draft:", error);
		}
	}, [API_BASE, id]);

	// Fetch user data on component mount
	useEffect(() => {
		fetchUser();
	}, [fetchUser]);

	// Load draft after event is loaded
	useEffect(() => {
		if (event && !loading) {
			loadDraft();
		}
	}, [event, loading, loadDraft]);

	// Auto-populate email field with user data
	useEffect(() => {
		if (user && event && user.email) {
			// Find email field in the form configuration
			const emailField = event.form?.find(
				(field) => field.key === "email" || field.question.toLowerCase().includes("email")
			);

			if (emailField) {
				setFormData((prev) => ({
					...prev,
					[emailField.key]: user.email,
				}));
			}
		}
	}, [user, event]);

	// Cleanup timeout on unmount
	useEffect(() => {
		return () => {
			if (draftTimeoutRef.current) {
				clearTimeout(draftTimeoutRef.current);
			}
		};
	}, []);

	const registrationOpen = event?.active_status ?? true;

	// Helper function to check if field is auto-filled
	const isAutoFilledField = (formField) => {
		const fieldKey = formField.key;
		return fieldKey === "email" || formField.question.toLowerCase().includes("email");
	};

	// Group form fields for half-width layout
	const groupedFields = useMemo(() => {
		const formFields = event?.form || [];
		const grouped = [];
		let currentGroup = [];

		formFields.forEach((field, index) => {
			if (field.space === "half") {
				currentGroup.push({ ...field, originalIndex: index });

				// If we have 2 half-width fields or this is the last field, create a group
				if (currentGroup.length === 2 || index === formFields.length - 1) {
					grouped.push({ type: "half-group", fields: currentGroup });
					currentGroup = [];
				}
			} else {
				// If we have pending half-width fields, close the group first
				if (currentGroup.length > 0) {
					grouped.push({ type: "half-group", fields: currentGroup });
					currentGroup = [];
				}
				// Add full-width field
				grouped.push({ type: "full", field: { ...field, originalIndex: index } });
			}
		});

		return grouped;
	}, [event?.form]);

	const renderFormField = (formField) => {
		const fieldKey = formField.key;
		const isEmailField =
			fieldKey === "email" || formField.question.toLowerCase().includes("email");

		if (formField.type === "short") {
			return (
				<div className="relative">
					<input
						type={isEmailField ? "email" : "text"}
						value={formData[fieldKey] || ""}
						onChange={(e) => handleInputChange(fieldKey, e.target.value)}
						disabled={isEmailField}
						className={`w-full px-4 py-2 bg-gray-800 border border-none rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
							isEmailField ? "bg-gray-700 cursor-not-allowed text-white/50" : ""
						}`}
						placeholder={
							isEmailField ? "Auto-filled from your profile" : "Enter your answer..."
						}
						required
					/>
					{isEmailField && (
						<div className="absolute right-3 top-1/2 transform -translate-y-1/2">
							<svg
								className="w-4 h-4 text-green-400"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path
									fillRule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
									clipRule="evenodd"
								/>
							</svg>
						</div>
					)}
				</div>
			);
		} else if (formField.type === "long") {
			return (
				<textarea
					value={formData[fieldKey] || ""}
					onChange={(e) => handleInputChange(fieldKey, e.target.value)}
					rows={4}
					className="w-full px-4 py-2 bg-gray-800 border border-none rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
					placeholder="Enter your answer..."
					required
				/>
			);
		} else if (formField.type === "option") {
			return (
				<div className="space-y-3">
					{(formField.options || []).map((option, optionIndex) => (
						<label key={optionIndex} className="flex items-center cursor-pointer">
							<input
								type="radio"
								name={`question-${fieldKey}`}
								value={option}
								checked={formData[fieldKey] === option}
								onChange={(e) => handleInputChange(fieldKey, e.target.value)}
								className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 cursor-pointer outline-none"
								required
							/>
							<span className="ml-3 text-gray-200">{option}</span>
						</label>
					))}
				</div>
			);
		} else if (formField.type === "file") {
			return (
				<div className="space-y-2">
					<input
						type="file"
						onChange={(e) => handleInputChange(fieldKey, e.target.files[0])}
						className="w-full px-4 py-2 bg-gray-800 border border-none rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 file:cursor-pointer"
						required
					/>
					{formData[fieldKey] && (
						<p className="text-sm text-gray-400">Selected: {formData[fieldKey].name}</p>
					)}
				</div>
			);
		} else {
			return <p className="text-red-400">Unsupported field type: {formField.type}</p>;
		}
	};

	const handleInputChange = (fieldKey, value) => {
		const newFormData = {
			...formData,
			[fieldKey]: value,
		};
		setFormData(newFormData);

		// Auto-save draft with debouncing
		debouncedSaveDraft(newFormData);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
		const expired = isTokenExpired(token);
		if (!token || expired) {
			alert(!token ? "Please log in to register." : "Session expired — please log in again.");
			router.push("/login");
			return;
		}

		if (!registrationOpen) {
			alert("Registration is closed for this workshop.");
			return;
		}

		// Validate form
		const formQuestions = event?.form || [];
		const missingAnswers = formQuestions.some((field) => {
			const value = formData[field.key];
			if (field.type === "file") {
				return !value || !value.name;
			}
			return !value || (typeof value === "string" && !value.trim());
		});

		if (missingAnswers) {
			alert("Please fill in all required fields.");
			return;
		}

		setSubmitting(true);
		try {
			// Here you would make the actual registration API call
			// const response = await fetch(`${API_BASE}/api/users/register/${id}`, {
			//   method: 'POST',
			//   headers: { 'Content-Type': 'application/json' },
			//   body: JSON.stringify({ answers: formData })
			// });

			// For now, just simulate success
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Delete draft after successful submission
			await deleteDraft();

			alert("Registration successful! Check your profile for details.");
			router.push("/workshops");
		} catch (error) {
			alert("Registration failed. Please try again.");
		} finally {
			setSubmitting(false);
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100">
				<p>Loading workshop...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-900 text-red-400">
				<p>Error: {error}</p>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-900 text-gray-100 p-6">
			<div className="max-w-4xl my-[100px] mx-auto bg-black bg-opacity-60 rounded-xl shadow-xl overflow-hidden">
				<div className="w-full">
					<img
						src={event?.E_main_img}
						alt={event?.E_name}
						className="w-full h-64 object-cover"
					/>
				</div>
				<div className="p-6 space-y-6">
					<div className="text-center">
						<h1 className="text-3xl font-bold text-blue-200 mb-2">
							Register for {event?.E_name}
						</h1>
						<p className="text-gray-300">
							Please fill out the form below to register for this workshop.
						</p>

						{/* Draft Status Indicator */}
						<div className="mt-3 flex justify-center items-center gap-2">
							{savingDraft && (
								<div className="flex items-center gap-2 text-yellow-400 text-sm">
									<div className="animate-spin h-3 w-3 border border-yellow-400 border-t-transparent rounded-full"></div>
									<span>Saving draft...</span>
								</div>
							)}
							{draftSaved && !savingDraft && (
								<div className="flex items-center gap-2 text-green-400 text-sm">
									<svg
										className="h-3 w-3"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fillRule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
											clipRule="evenodd"
										/>
									</svg>
									<span>Draft saved</span>
								</div>
							)}
						</div>
					</div>

					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Dynamic Form Fields */}
						{groupedFields.map((group, groupIndex) => {
							if (group.type === "half-group") {
								return (
									<div
										key={`group-${groupIndex}`}
										className="grid grid-cols-1 md:grid-cols-2 gap-4"
									>
										{group.fields.map((formField) => (
											<div key={formField.key} className="space-y-2">
												<label className="block text-sm font-medium text-gray-200">
													{formField.question}
													<span className="text-red-400 ml-1">*</span>
												</label>
												{renderFormField(formField)}
											</div>
										))}
									</div>
								);
							} else {
								const formField = group.field;
								return (
									<div key={formField.key} className="space-y-2">
										<label className="block text-sm font-medium text-gray-200">
											{formField.question}
											<span className="text-red-400 ml-1">*</span>
											{isAutoFilledField(formField) && (
												<span className="ml-2 text-xs text-green-400 font-normal">
													(Auto-filled from profile)
												</span>
											)}
										</label>
										{renderFormField(formField)}
									</div>
								);
							}
						})}

						{/* Submit Button */}
						<div className="flex items-center gap-4 pt-4">
							<motion.button
								type="submit"
								disabled={!registrationOpen || submitting}
								className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-6 rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
								whileHover={{ scale: registrationOpen && !submitting ? 1.02 : 1 }}
								whileTap={{ scale: registrationOpen && !submitting ? 0.98 : 1 }}
							>
								{submitting
									? "Submitting..."
									: registrationOpen
									? "Submit Registration"
									: "Registration Closed"}
							</motion.button>

							<button
								type="button"
								onClick={() => router.push(`/workshops/${id}`)}
								className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg"
							>
								Back to Details
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default WorkshopDetailsPage;
