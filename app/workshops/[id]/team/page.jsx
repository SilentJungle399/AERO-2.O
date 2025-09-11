"use client";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import { jwtDecode } from "jwt-decode";

const TeamPage = () => {
	const router = useRouter();
	const params = useParams();
	const id = params.id;

	const API_BASE = process.env.NODE_ENV === "development" ? "http://localhost:5000" : "";

	// State management
	const [loading, setLoading] = useState(true);
	const [registrationData, setRegistrationData] = useState(null);
	const [event, setEvent] = useState(null);
	const [user, setUser] = useState(null);
	const [teamInfo, setTeamInfo] = useState(null);
	const [joinTeamCode, setJoinTeamCode] = useState("");
	const [teamName, setTeamName] = useState("");

	// Loading states for actions
	const [creatingTeam, setCreatingTeam] = useState(false);
	const [joiningTeam, setJoiningTeam] = useState(false);
	const [leavingTeam, setLeavingTeam] = useState(false);
	const [disbandingTeam, setDisbandingTeam] = useState(false);

	// Derived values
	const whatsappGroupLink =
		event?.whatsapp_group_link || "https://chat.whatsapp.com/FcT8BTnLmmrBstdCTGZgYY";
	const isTeamLeader =
		teamInfo?.user_role === "leader" || teamInfo?.team_leader?._id === user?._id;

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

	const getAuthHeaders = useCallback(
		(token) => ({
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		}),
		[]
	);

	const redirectToLogin = useCallback(() => {
		router.push("/login");
	}, [router]);

	const validateAuth = useCallback(() => {
		const token = getToken();
		if (!token || isTokenExpired(token)) {
			redirectToLogin();
			return null;
		}
		return token;
	}, [getToken, isTokenExpired, redirectToLogin]);

	// Initialize component
	useEffect(() => {
		const token = validateAuth();
		if (!token) return;

		// Check if user came from successful registration
		const regData =
			typeof window !== "undefined" ? sessionStorage.getItem("registrationSuccess") : null;

		if (regData) {
			const parsedData = JSON.parse(regData);
			setRegistrationData(parsedData);
			fetchEventAndUser();
			// Clear session storage after use
			sessionStorage.removeItem("registrationSuccess");
		} else {
			checkRegistrationStatus();
		}
	}, [validateAuth]);

	// API functions
	const checkRegistrationStatus = async () => {
		const token = validateAuth();
		if (!token) return;

		try {
			const response = await fetch(
				`${API_BASE}/api/users/workshop/${id}/registration-status`,
				{
					method: "GET",
					headers: getAuthHeaders(token),
				}
			);

			const data = await response.json();

			if (response.ok && data.success && data.isRegistered) {
				setRegistrationData({
					success: true,
					eventName: data.eventName,
					registrationDate: data.registration?.registrationDate,
				});
				fetchEventAndUser();
			} else {
				router.push(`/workshops/${id}`);
			}
		} catch (error) {
			console.error("Error checking registration status:", error);
			router.push(`/workshops/${id}`);
		}
	};

	const fetchEventAndUser = async () => {
		const token = validateAuth();
		if (!token) return;

		try {
			// Fetch event and user data in parallel
			const [eventResponse, userResponse] = await Promise.all([
				fetch(`${API_BASE}/api/users/event/${id}`),
				fetch(`${API_BASE}/api/users/${jwtDecode(token).id}`, {
					headers: getAuthHeaders(token),
				}),
			]);

			if (eventResponse.ok) {
				const eventData = await eventResponse.json();
				setEvent(eventData.event || eventData);
			}

			if (userResponse.ok) {
				const userData = await userResponse.json();
				setUser(userData.user || userData);
			}

			// Fetch team information
			await fetchTeamInfo();
		} catch (error) {
			console.error("Error fetching data:", error);
		} finally {
			setLoading(false);
		}
	};

	const fetchTeamInfo = async () => {
		const token = validateAuth();
		if (!token) return;

		try {
			const response = await fetch(`${API_BASE}/api/users/workshop/${id}/team-info`, {
				method: "GET",
				headers: getAuthHeaders(token),
			});

			const data = await response.json();

			if (response.ok && data.success) {
				setTeamInfo(data.team);
			} else {
				// User is not part of any team
				setTeamInfo(null);
			}
		} catch (error) {
			console.error("Error fetching team info:", error);
			setTeamInfo(null);
		}
	};

	// Utility functions
	const copyToClipboard = async (text) => {
		try {
			await navigator.clipboard.writeText(text);
		} catch (error) {
			// Fallback for older browsers
			const textArea = document.createElement("textarea");
			textArea.value = text;
			document.body.appendChild(textArea);
			textArea.focus();
			textArea.select();
			document.execCommand("copy");
			document.body.removeChild(textArea);
		}
	};

	const handleApiError = (error, defaultMessage) => {
		console.error(error);
		alert(defaultMessage);
	};

	// Team action functions
	const createTeam = async () => {
		if (!teamName.trim()) {
			alert("Please enter a team name.");
			return;
		}

		const token = validateAuth();
		if (!token) return;

		setCreatingTeam(true);
		try {
			const response = await fetch(`${API_BASE}/api/users/workshop/${id}/create-team`, {
				method: "POST",
				headers: getAuthHeaders(token),
				body: JSON.stringify({ team_name: teamName.trim() }),
			});

			const data = await response.json();

			if (response.ok && data.success) {
				setTeamName(""); // Clear the input
				await fetchTeamInfo(); // Refresh team info instead of page reload
			} else {
				alert(data.message || "Failed to create team. Please try again.");
			}
		} catch (error) {
			handleApiError(error, "Failed to create team. Please try again.");
		} finally {
			setCreatingTeam(false);
		}
	};

	const joinTeam = async () => {
		if (!joinTeamCode.trim()) {
			alert("Please enter a team code.");
			return;
		}

		const token = validateAuth();
		if (!token) return;

		setJoiningTeam(true);
		try {
			const response = await fetch(`${API_BASE}/api/users/workshop/${id}/join-team`, {
				method: "POST",
				headers: getAuthHeaders(token),
				body: JSON.stringify({ teamCode: joinTeamCode.trim() }),
			});

			const data = await response.json();

			if (response.ok && data.success) {
				setTeamInfo(data.team);
				setJoinTeamCode(""); // Clear the input
			} else {
				alert(
					data.message || "Failed to join team. Please check the team code and try again."
				);
			}
		} catch (error) {
			handleApiError(error, "An error occurred while joining the team. Please try again.");
		} finally {
			setJoiningTeam(false);
		}
	};

	const leaveTeam = async () => {
		if (!confirm("Are you sure you want to leave this team?")) return;

		const token = validateAuth();
		if (!token) return;

		setLeavingTeam(true);
		try {
			const response = await fetch(`${API_BASE}/api/users/workshop/${id}/leave-team`, {
				method: "POST",
				headers: getAuthHeaders(token),
			});

			const data = await response.json();

			if (response.ok && data.success) {
				setTeamInfo(null);
			} else {
				alert(data.message || "Failed to leave team. Please try again.");
			}
		} catch (error) {
			handleApiError(error, "An error occurred while leaving the team. Please try again.");
		} finally {
			setLeavingTeam(false);
		}
	};

	const disbandTeam = async () => {
		if (
			!confirm(
				"Are you sure you want to disband this team? This action cannot be undone and all team members will be removed."
			)
		)
			return;

		const token = validateAuth();
		if (!token) return;

		setDisbandingTeam(true);
		try {
			const response = await fetch(`${API_BASE}/api/users/workshop/${id}/disband-team`, {
				method: "POST",
				headers: getAuthHeaders(token),
			});

			const data = await response.json();

			if (response.ok && data.success) {
				setTeamInfo(null);
			} else {
				alert(data.message || "Failed to disband team. Please try again.");
			}
		} catch (error) {
			handleApiError(error, "An error occurred while disbanding the team. Please try again.");
		} finally {
			setDisbandingTeam(false);
		}
	};

	// Component render functions
	const LoadingScreen = () => (
		<div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100">
			<div className="text-center">
				<div className="animate-spin h-8 w-8 border border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
				<p>Loading...</p>
			</div>
		</div>
	);

	const ErrorScreen = () => (
		<div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100">
			<div className="text-center">
				<p className="text-red-400 mb-4">Registration data not found.</p>
				<button
					onClick={() => router.push(`/workshops/${id}`)}
					className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg"
				>
					Go Back to Workshop
				</button>
			</div>
		</div>
	);

	// Early returns for loading and error states
	if (loading) return <LoadingScreen />;
	if (!registrationData) return <ErrorScreen />;

	return (
		<div className="min-h-screen bg-gray-900 text-gray-100 p-3 sm:p-6">
			<div className="max-w-4xl my-[100px] mx-auto">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="bg-gradient-to-br from-green-900/30 to-black/60 border border-green-500/50 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8"
				>
					<div className="flex flex-col items-center gap-4 sm:gap-6">
						{/* Success Message Section */}
						{!teamInfo && (
							<>
								<div className="text-center w-full">
									<motion.div
										initial={{ scale: 0 }}
										animate={{ scale: 1 }}
										transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
										className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3"
									>
										<svg
											className="w-5 h-5 sm:w-6 sm:h-6 text-white"
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
									</motion.div>
									<h1 className="text-xl sm:text-2xl font-bold text-green-400 mb-2">
										Registration Successful! 🎉
									</h1>
									<p className="text-sm sm:text-base text-gray-300">
										Registered for{" "}
										<span className="text-blue-400 font-semibold">
											{event.E_name}
										</span>
									</p>
								</div>

								<div className="w-full h-px bg-gray-600 sm:hidden"></div>
							</>
						)}

						{/* WhatsApp Section */}
						<div className="text-center w-full">
							<div className="mb-3 sm:mb-0">
								<h3 className="text-base sm:text-lg font-semibold text-white mb-2">
									Join Workshop Group
								</h3>
								<p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">
									Stay connected with participants
								</p>
							</div>
							<motion.a
								href={whatsappGroupLink}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded-lg shadow-lg items-center gap-2 transition-colors text-sm sm:text-base"
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
							>
								<svg
									className="w-4 h-4 sm:w-5 sm:h-5"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488z" />
								</svg>
								Join Group
							</motion.a>
						</div>
					</div>
				</motion.div>

				{/* Team Creation/Joining Section - Enhanced */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4, duration: 0.6 }}
					className="bg-gray-800 bg-opacity-90 rounded-xl p-6 sm:p-10 mb-6 sm:mb-8 border border-gray-600"
				>
					<div className="text-center mb-6 sm:mb-8">
						<div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
							<svg
								className="w-6 h-6 sm:w-8 sm:h-8 text-white"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
								/>
							</svg>
						</div>
						<h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
							{teamInfo ? "Your Team" : "Team Formation"}
						</h2>
						{!teamInfo ? (
							<>
								<p className="text-gray-300 text-base sm:text-lg mb-2">
									Individual registration completed! Now it's time to form your
									team.
								</p>
								<p className="text-blue-400 font-medium text-sm sm:text-base">
									Create a team or join an existing one to participate together.
								</p>
							</>
						) : (
							<>
								<p className="text-gray-300 text-base sm:text-lg mb-2">
									You are successfully part of a team for this workshop.
								</p>
								<p className="text-blue-400 font-medium text-sm sm:text-base">
									{isTeamLeader
										? "You are the team leader"
										: "You are a team member"}
								</p>
							</>
						)}
					</div>

					{!teamInfo ? (
						<div className="space-y-4 sm:space-y-6">
							{/* Create Team Section */}
							<div className="bg-gray-700 bg-opacity-50 rounded-lg p-4 sm:p-6">
								<h3 className="text-lg sm:text-xl font-semibold text-blue-400 mb-3">
									Create a New Team
								</h3>
								<p className="text-gray-300 mb-4 text-sm sm:text-base">
									Start your own team and get a unique team code to share with
									your teammates.
								</p>
								<div className="space-y-3 mb-4">
									<input
										type="text"
										value={teamName}
										onChange={(e) => setTeamName(e.target.value)}
										placeholder="Enter team name"
										className="w-full bg-gray-800 border border-gray-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 placeholder-gray-400 text-sm sm:text-base"
										maxLength={50}
									/>
								</div>
								<motion.button
									onClick={createTeam}
									disabled={creatingTeam || !teamName.trim()}
									className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
									whileHover={{
										scale: creatingTeam || !teamName.trim() ? 1 : 1.02,
									}}
									whileTap={{
										scale: creatingTeam || !teamName.trim() ? 1 : 0.98,
									}}
								>
									{creatingTeam ? (
										<>
											<div className="animate-spin h-4 w-4 border border-white border-t-transparent rounded-full"></div>
											Creating Team...
										</>
									) : (
										<>
											<svg
												className="w-4 h-4 sm:w-5 sm:h-5"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M12 6v6m0 0v6m0-6h6m-6 0H6"
												/>
											</svg>
											Create Team
										</>
									)}
								</motion.button>
							</div>

							{/* OR Divider */}
							<div className="flex items-center">
								<div className="flex-1 border-t border-gray-600"></div>
								<div className="px-4 text-gray-400 font-medium text-sm">OR</div>
								<div className="flex-1 border-t border-gray-600"></div>
							</div>

							{/* Join Team Section */}
							<div className="bg-gray-700 bg-opacity-50 rounded-lg p-4 sm:p-6">
								<h3 className="text-lg sm:text-xl font-semibold text-green-400 mb-3">
									Join an Existing Team
								</h3>
								<p className="text-gray-300 mb-4 text-sm sm:text-base">
									Enter the team code shared by your teammate to join their team.
								</p>
								<div className="flex flex-col gap-3">
									<input
										type="text"
										value={joinTeamCode}
										onChange={(e) =>
											setJoinTeamCode(e.target.value.toUpperCase())
										}
										placeholder="Enter team code"
										className="w-full bg-gray-800 border border-gray-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-green-500 placeholder-gray-400 text-sm sm:text-base"
										maxLength={19}
									/>
									<motion.button
										onClick={joinTeam}
										disabled={joiningTeam || !joinTeamCode.trim()}
										className="w-full bg-green-600 hover:bg-green-500 disabled:bg-green-800 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
										whileHover={{
											scale: joiningTeam || !joinTeamCode.trim() ? 1 : 1.02,
										}}
										whileTap={{
											scale: joiningTeam || !joinTeamCode.trim() ? 1 : 0.98,
										}}
									>
										{joiningTeam ? (
											<>
												<div className="animate-spin h-4 w-4 border border-white border-t-transparent rounded-full"></div>
												Joining...
											</>
										) : (
											<>
												<svg
													className="w-4 h-4 sm:w-5 sm:h-5"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
													/>
												</svg>
												Join Team
											</>
										)}
									</motion.button>
								</div>
							</div>
						</div>
					) : (
						/* Team Information Display */
						<div className="space-y-4 sm:space-y-6">
							{/* Team Details Card */}
							<div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 border border-blue-500/50 rounded-lg p-4 sm:p-6">
								<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
									<div className="flex-1">
										<h3 className="text-xl sm:text-2xl font-bold text-blue-400 mb-1">
											{teamInfo.team_name || `Team ${teamInfo.team_code}`}
										</h3>
										<p className="text-gray-300 text-xs sm:text-sm">
											{isTeamLeader
												? "You are the team leader"
												: "You are a team member"}
										</p>
									</div>
									<div className="w-full sm:w-auto text-left sm:text-right">
										<div className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-medium inline-block">
											{teamInfo.current_members}/{teamInfo.max_members}{" "}
											Members
										</div>
									</div>
								</div>

								{/* Team Code */}
								<div className="mb-4 sm:mb-6">
									<label className="block text-gray-400 text-xs sm:text-sm mb-2">
										Team Code
									</label>
									<div className="flex items-center gap-2 sm:gap-3">
										<div className="bg-gray-800 border border-gray-600 rounded-lg p-2 sm:p-3 flex-1 overflow-hidden">
											<code className="text-base sm:text-xl font-mono text-green-400 tracking-wider break-all">
												{teamInfo.team_code}
											</code>
										</div>
										<button
											onClick={() => copyToClipboard(teamInfo.team_code)}
											className="bg-gray-700 hover:bg-gray-600 text-white p-2 sm:p-3 rounded-lg transition-colors flex-shrink-0"
											title="Copy team code"
										>
											<svg
												className="w-4 h-4 sm:w-5 sm:h-5"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
												/>
											</svg>
										</button>
									</div>
									<p className="text-gray-400 text-xs sm:text-sm mt-2">
										Share this code with others to invite them to your team
									</p>
								</div>

								{/* Team Members */}
								<div className="mb-4 sm:mb-6">
									<label className="block text-gray-400 text-xs sm:text-sm mb-3">
										Team Members
									</label>
									<div className="space-y-2">
										{teamInfo.team_members.map((member, index) => (
											<div
												key={index}
												className="flex items-center justify-between bg-gray-800/50 rounded-lg p-2 sm:p-3"
											>
												<div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
													<div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
														<span className="text-white text-xs sm:text-sm font-semibold">
															{member.name?.charAt(0).toUpperCase() ||
																"U"}
														</span>
													</div>
													<div className="min-w-0 flex-1">
														<p className="text-white font-medium text-sm sm:text-base truncate">
															{member?.name || "User"}
														</p>
														<p className="text-gray-400 text-xs sm:text-sm truncate">
															{member?.email}
														</p>
													</div>
												</div>
												<div className="flex flex-col items-end gap-1 flex-shrink-0 ml-2">
													{member.role === "leader" && (
														<span className="bg-yellow-600 text-yellow-100 px-2 py-1 rounded text-xs font-medium">
															Leader
														</span>
													)}
													<span className="text-gray-500 text-xs">
														{new Date(
															member.joined_at
														).toLocaleDateString()}
													</span>
												</div>
											</div>
										))}
									</div>
								</div>

								{/* Team Actions */}
								<div className="w-full">
									{isTeamLeader ? (
										<motion.button
											onClick={disbandTeam}
											disabled={disbandingTeam}
											className="w-full bg-red-600 hover:bg-red-500 disabled:bg-red-800 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
											whileHover={{ scale: disbandingTeam ? 1 : 1.02 }}
											whileTap={{ scale: disbandingTeam ? 1 : 0.98 }}
										>
											{disbandingTeam ? (
												<>
													<div className="animate-spin h-4 w-4 border border-white border-t-transparent rounded-full"></div>
													Disbanding Team...
												</>
											) : (
												<>
													<svg
														className="w-4 h-4 sm:w-5 sm:h-5"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
														/>
													</svg>
													Disband Team
												</>
											)}
										</motion.button>
									) : (
										<motion.button
											onClick={leaveTeam}
											disabled={leavingTeam}
											className="w-full bg-red-600 hover:bg-red-500 disabled:bg-red-800 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
											whileHover={{ scale: leavingTeam ? 1 : 1.02 }}
											whileTap={{ scale: leavingTeam ? 1 : 0.98 }}
										>
											{leavingTeam ? (
												<>
													<div className="animate-spin h-4 w-4 border border-white border-t-transparent rounded-full"></div>
													Leaving Team...
												</>
											) : (
												<>
													<svg
														className="w-4 h-4 sm:w-5 sm:h-5"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
														/>
													</svg>
													Leave Team
												</>
											)}
										</motion.button>
									)}
								</div>
							</div>
						</div>
					)}
				</motion.div>
			</div>
		</div>
	);
};

export default TeamPage;
