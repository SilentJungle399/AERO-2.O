"use client";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import { jwtDecode } from "jwt-decode";

const InductionSuccessPage = () => {
	const router = useRouter();
	const params = useParams();
	const id = params.id;

	const API_BASE = process.env.NODE_ENV === "development" ? "http://localhost:5000" : "";

	// State management
	const [loading, setLoading] = useState(true);
	const [registrationData, setRegistrationData] = useState(null);
	const [event, setEvent] = useState(null);
	const [user, setUser] = useState(null);

	// Utility functions
	const isTokenExpired = useCallback((token) => {
		try {
			if (!token || typeof token !== "string") return true;
			const decodedToken = jwtDecode(token);
			const currentTime = Math.floor(Date.now() / 1000);
			return Number(decodedToken.exp) < currentTime;
		} catch (error) {
			return true;
		}
	}, []);

	const getToken = useCallback(() => {
		return typeof window !== "undefined" ? localStorage.getItem("token") : null;
	}, []);

	const validateAuth = useCallback(() => {
		const token = getToken();
		if (!token || isTokenExpired(token)) {
			router.push("/login");
			return null;
		}
		return token;
	}, [getToken, isTokenExpired, router]);

	// Fetch event and user data
	const fetchEventAndUser = useCallback(async () => {
		const token = validateAuth();
		if (!token) return;

		try {
			// Fetch event details
			const eventResponse = await fetch(`${API_BASE}/api/users/getinduction/${id}`, {
				method: "GET",
			});

			if (eventResponse.ok) {
				const eventData = await eventResponse.json();
				setEvent(eventData);
			}

			// Fetch user details
			const decoded = jwtDecode(token);
			const userResponse = await fetch(
				`${API_BASE}/api/users/induction/${id}/inductee/${decoded.id}`,
				{
					method: "GET",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				}
			);

			if (userResponse.ok) {
				const userData = await userResponse.json();
				console.log(userData);
				setUser(userData[0]);
			}
		} catch (error) {
			console.error("Error fetching data:", error);
		} finally {
			setLoading(false);
		}
	}, [API_BASE, id, validateAuth]);

	// Check registration status
	const checkRegistrationStatus = useCallback(async () => {
		const token = validateAuth();
		if (!token) return;

		try {
			const response = await fetch(
				`${API_BASE}/api/users/induction/${id}/registration-status`,
				{
					method: "GET",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				}
			);

			if (response.ok) {
				const data = await response.json();
				if (!data.isRegistered) {
					// User is not registered, redirect to registration page
					router.push(`/inductions/register/${id}`);
					return;
				}
			}

			await fetchEventAndUser();
		} catch (error) {
			console.error("Error checking registration status:", error);
			router.push(`/inductions/register/${id}`);
		}
	}, [API_BASE, id, validateAuth, fetchEventAndUser, router]);

	// Initialize component
	useEffect(() => {
		const token = validateAuth();
		if (!token) return;

		// Check if user came from successful registration
		const regData =
			typeof window !== "undefined"
				? sessionStorage.getItem("inductionRegistrationSuccess")
				: null;

		if (regData) {
			try {
				const parsedData = JSON.parse(regData);
				setRegistrationData(parsedData);
				fetchEventAndUser();
				// Clear session storage after use
				sessionStorage.removeItem("inductionRegistrationSuccess");
			} catch (error) {
				console.error("Error parsing registration data:", error);
				checkRegistrationStatus();
			}
		} else {
			checkRegistrationStatus();
		}
	}, [validateAuth, fetchEventAndUser, checkRegistrationStatus]);

	// Loading state
	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100">
				<div className="text-center">
					<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
					<p>Loading...</p>
				</div>
			</div>
		);
	}

	const whatsappGroupLink = "https://chat.whatsapp.com/GvHxrLsZfIc8rujGiyzeNG";

	return (
		<div className="min-h-screen bg-gray-900 text-gray-100 p-6">
			<div className="max-w-4xl my-[100px] mx-auto">
				{/* Success Header */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="text-center mb-8"
				>
					<div className="w-24 h-24 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
						<svg
							className="w-12 h-12 text-white"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M5 13l4 4L19 7"
							/>
						</svg>
					</div>
					<h1 className="text-4xl font-bold text-green-400 mb-2">
						Registration Successful!
					</h1>
					<p className="text-xl text-gray-300">
						Welcome to the {event?.I_name || "Induction"} program
					</p>
				</motion.div>

				{/* WhatsApp Group Invite */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.6 }}
					className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl shadow-xl p-6 mb-6"
				>
					<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
						<div className="flex items-center space-x-4">
							<div className="w-16 h-16 bg-white rounded-full flex items-center justify-center flex-shrink-0">
								<svg
									className="w-8 h-8 text-green-600"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488z" />
								</svg>
							</div>
							<div className="flex-1">
								<h3 className="text-xl font-semibold text-white mb-1">
									Join Our WhatsApp Group
								</h3>
								<p className="text-green-100 text-sm sm:text-base">
									Stay updated with important announcements and connect with
									fellow inductees
								</p>
							</div>
						</div>
						<motion.a
							href={whatsappGroupLink}
							target="_blank"
							rel="noopener noreferrer"
							className="bg-white text-green-600 font-semibold py-3 px-6 rounded-lg hover:bg-green-50 transition-colors duration-200 flex items-center justify-center space-x-2 w-full lg:w-auto lg:flex-shrink-0"
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							<span>Join Group</span>
							<svg
								className="w-4 h-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
								/>
							</svg>
						</motion.a>
					</div>
				</motion.div>

				{/* Registration Details */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
					className="bg-black bg-opacity-60 rounded-xl shadow-xl p-6 mb-6"
				>
					<h2 className="text-2xl font-semibold text-blue-200 mb-4">
						Registration Details
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<p className="text-gray-400">Name</p>
							<p className="text-white font-medium">
								{registrationData?.userName || user?.name || "N/A"}
							</p>
						</div>
						<div>
							<p className="text-gray-400">Email</p>
							<p className="text-white font-medium">
								{registrationData?.userEmail || user?.email || "N/A"}
							</p>
						</div>
						<div>
							<p className="text-gray-400">Event</p>
							<p className="text-white font-medium">
								{registrationData?.eventName || event?.I_name || "N/A"}
							</p>
						</div>
						<div>
							<p className="text-gray-400">Registration Date</p>
							<p className="text-white font-medium">
								{registrationData?.registrationDate
									? new Date(
											registrationData.registrationDate
									  ).toLocaleDateString()
									: new Date().toLocaleDateString()}
							</p>
						</div>
					</div>
					<div className="mt-4 pt-4 border-t border-gray-700">
						<p className="text-gray-400">Registration ID</p>
						<p className="text-white font-mono text-sm">
							{registrationData?.registrationId || user?._id || "N/A"}
						</p>
					</div>
				</motion.div>
			</div>
		</div>
	);
};

export default InductionSuccessPage;
