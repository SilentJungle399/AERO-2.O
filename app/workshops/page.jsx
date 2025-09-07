"use client";
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import { jwtDecode } from "jwt-decode";

const WorkshopCard = ({ event, index }) => {
	const router = useRouter();

	return (
		<motion.div
			className="bg-black bg-opacity-70 rounded-lg shadow-lg w-[300px] p-4 flex flex-col items-start"
			initial={{ opacity: 0, y: 50 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: index * 0.1 }}
		>
			<div className="w-full">
				<img
					src={event.E_main_img || "/default-event-image.jpg"}
					alt={event.E_name}
					className="w-full h-auto rounded-lg shadow-md"
				/>
			</div>

			<div className="font-sans h-full my-4 text-white flex flex-col space-y-3 w-full">
				<span className="text-xl font-bold text-blue-200 break-words whitespace-normal">
					{event.E_name}
				</span>
				<span className="text-sm text-gray-300 break-words whitespace-normal">
					{event.E_mini_description} {/* ?.slice(0, 100)} */}
					{/* {event.E_mini_description && event.E_mini_description.length > 100 ? "..." : ""} */}
				</span>
			</div>
			<motion.button
				onClick={() => router.push(`/workshops/${event._id}`)}
				className="mb-2 w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-4 rounded-lg shadow-sm text-center disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-700 disabled:text-gray-300"
				whileHover={{ scale: 1.02 }}
				whileTap={{ scale: 0.98 }}
				disabled={!event.active_status}
				aria-disabled={!event.active_status}
				title={event.active_status ? "View details" : "Registration closed"}
			>
				{event.active_status ? "View Details" : "Registration Closed"}
			</motion.button>
		</motion.div>
	);
};

const WorkshopsPage = () => {
	const [events, setEvents] = useState([]);
	const [pastEvents, setPastEvents] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const router = useRouter();

	// Prefer env override with sensible default
	const API_BASE = useMemo(
		() => (process.env.NODE_ENV === "development" ? "http://localhost:5000" : ""),
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

	useEffect(() => {
		const fetchEvents = async () => {
			try {
				const response = await fetch(`${API_BASE}/api/users/getallevents`);
				if (!response.ok) {
					throw new Error("Failed to fetch events");
				}
				const data = await response.json();
				setEvents(data.events.filter((event) => event.is_workshop && event.active_status));
				setPastEvents(
					data.events.filter((event) => event.is_workshop && !event.active_status)
				);
				setLoading(false);
			} catch (error) {
				setError(error.message);
				setLoading(false);
			}
		};
		fetchEvents();
	}, [API_BASE]);

	const WorkshopSection = ({ title, items }) => (
		<div className="w-full p-4 sm:p-8 bg-gray-800">
			<h2 className="text-3xl md:text-5xl font-bold mb-12 text-center text-blue-300">
				{title}
			</h2>
			<div className="flex flex-row flex-wrap gap-12 max-w-7xl">
				{items.length > 0 ? (
					items.map((event, index) => (
						<WorkshopCard key={event._id} event={event} index={index} />
					))
				) : (
					<p className="text-center text-gray-400 w-full">
						No workshops coming up.
						{/* this case only happens for upcoming workshops */}
					</p>
				)}
			</div>
		</div>
	);

	if (loading) return <Loader />;
	if (error) return <p className="text-center text-red-500">{error}</p>;

	return (
		<div className="min-h-screen bg-gray-900 text-gray-100">
			<div className="h-[50vh] relative overflow-hidden bg-black">
				<div className="absolute inset-0 flex items-center justify-center text-xl sm:text-4xl md:text-6xl lg:text-8xl text-center">
					<h1 className="z-10 px-4 text-white monoton">Aeromodelling Club Workshops</h1>
				</div>
			</div>

			{/* Render sections */}
			<WorkshopSection title="Upcoming Workshops" items={events} />
			<WorkshopSection title="Previous Workshops" items={pastEvents} />
		</div>
	);
};

export default WorkshopsPage;
