"use client";
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import { jwtDecode } from "jwt-decode";
import { FaUserFriends } from "react-icons/fa";

const WorkshopsPage = () => {
	const [events, setEvents] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const router = useRouter();

	// Prefer env override with sensible default
	const API_BASE = useMemo(
		() => process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000",
		[]
	);

	function isTokenExpired(token) {
		try {
			if (!token || typeof token !== "string") return true;
			const decodedToken = jwtDecode(token);
			const currentTime = Math.floor(Date.now() / 1000);
			return Number(decodedToken.exp) < currentTime;
		} catch (error) {
			console.error("Invalid token", error);
			return true;
		}
	}

	function LoginCheck(e) {
		const token = localStorage.getItem("token");
		const isExpired = isTokenExpired(token);
		if (!token || isExpired) {
			if (e && typeof e.preventDefault === "function") e.preventDefault();
			alert(
				!token ? "Please log in to Aeromodelling." : "Session Expired. Please log in again."
			);
			router.push("/login");
			return false;
		}
		return true;
	}

	useEffect(() => {
		const fetchEvents = async () => {
			try {
				const response = await fetch(`${API_BASE}/api/users/getallevents`);
				if (!response.ok) {
					throw new Error("Failed to fetch events");
				}
				const data = await response.json();
				setEvents(data.events.filter((event) => event.is_workshop));
				setLoading(false);
			} catch (error) {
				setError(error.message);
				setLoading(false);
			}
		};
		fetchEvents();
	}, [API_BASE]);

	const ActionButton = ({ enabled, onClick, label, color = "blue", icon = null }) => {
		const baseCls = `mt-2 flex-1 bg-${color}-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-center shadow-md`;
		if (!enabled) {
			return (
				<button className={`${baseCls} opacity-50 cursor-not-allowed`} disabled>
					{label}
				</button>
			);
		}
		return (
			<motion.button
				onClick={onClick}
				className={`${baseCls} hover:bg-${color}-500`}
				whileHover={{ scale: 1.02 }}
				whileTap={{ scale: 0.98 }}
			>
				{label} {icon}
			</motion.button>
		);
	};

	if (loading) return <Loader />;
	if (error) return <p className="text-center text-red-500">{error}</p>;

	return (
		<div className="min-h-screen bg-gray-900 text-gray-100">
			{/* First Section */}
			<div className="h-screen relative overflow-hidden bg-black">
				<div className="absolute inset-0 flex items-center justify-center text-3xl sm:text-4xl md:text-6xl lg:text-8xl text-center">
					<h1 className="z-10 px-4 text-white monoton">Aeromodelling Club Workshops</h1>
				</div>
				{/* <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/4 z-10 w-full h-full max-w-2xl pr-16 opacity-80 max-h-96">
					<Brain scrollYProgress={scrollYProgress} />
				</div> */}
			</div>

			{/* Events Listing Section */}
			<div className="w-full p-4 sm:p-8 bg-gray-800">
				<h2 className="text-3xl md:text-5xl font-bold mb-12 text-center text-blue-300">
					Upcoming Workshops
				</h2>
				<div className="flex flex-col gap-12 mx-auto max-w-7xl">
					{events.map((event, index) => (
						<motion.div
							key={event._id}
							className="bg-black bg-opacity-70 rounded-lg shadow-lg p-6"
							initial={{ opacity: 0, y: 50 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
						>
							<div className="flex flex-wrap gap-4 items-center justify-between">
								<h2 className="text-2xl md:text-4xl font-bold font-mono mb-6 text-white">
									{event.E_name}
								</h2>
								<div className="mt-2">
									<ActionButton
										enabled={true}
										label="MyTeam"
										color="blue"
										icon={<FaUserFriends className="ml-2" />}
										onClick={(e) => {
											if (LoginCheck(e))
												router.push(`/events/team-panel/${event._id}`);
										}}
									/>
								</div>
							</div>
							<div className="md:flex md:space-x-6 space-y-6 md:space-y-0">
								<div className="md:w-1/2">
									<img
										src={event.E_main_img || "/default-event-image.jpg"}
										alt={event.E_name}
										className="w-full h-auto rounded-lg shadow-md"
									/>
								</div>
								<div className="md:w-1/2 space-y-4 font-mono">
									<p>
										<strong className="text-blue-300">Date:</strong>{" "}
										{new Date(event.E_date).toLocaleDateString()}
									</p>
									<p>
										<strong className="text-blue-300">Time:</strong>{" "}
										{event.E_timings}
									</p>
									<p>
										<strong className="text-blue-300">Location:</strong>{" "}
										{event.E_location}
									</p>
									<p>
										<strong className="text-blue-300">Domain:</strong>{" "}
										{event.E_domain}
									</p>
									<p>
										<strong className="text-blue-300">Team Size:</strong>{" "}
										{event.E_team_size}
									</p>
									<p className="text-gray-300">{event.E_mini_description}</p>
									<div className="flex flex-wrap justify-between gap-4 mt-8">
										<ActionButton
											enabled={!!event.active_status}
											label="Create Team"
											color="blue"
											onClick={(e) => {
												if (LoginCheck(e))
													router.push(`/events/create-team/${event._id}`);
											}}
										/>
										<ActionButton
											enabled={!!event.active_status}
											label="Join Team"
											color="green"
											onClick={(e) => {
												if (LoginCheck(e))
													router.push(`/events/join-team/${event._id}`);
											}}
										/>
									</div>
									{!event.active_status && (
										<h3 className="text-center text-red-500">
											Registration Closed!!!
										</h3>
									)}
								</div>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</div>
	);
};

export default WorkshopsPage;
