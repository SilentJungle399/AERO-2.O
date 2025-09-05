"use client";
import { useMemo, useState, useEffect } from "react";
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
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

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
					if (!data.is_workshop || !data.active_status) {
						router.replace("/workshops");
						return;
					}
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

	const registrationOpen = event?.active_status ?? true;

	const handleRegister = () => {
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

		router.push(`/workshops/${id}/register`);
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
					<div className="flex items-start justify-between gap-4">
						<div>
							<h1 className="text-3xl font-bold text-blue-200">{event?.E_name}</h1>
							<p className="mt-1 text-sm text-gray-300">{event?.E_domain}</p>
						</div>
						<div className="text-right">
							<p className="text-sm text-gray-300">Dates</p>
							<p className="font-semibold">{formatTime(event?.E_date)}</p>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<h3 className="text-lg font-semibold text-white">Description</h3>
							<p className="text-gray-300 mt-2">
								{event?.E_description || event?.description}
							</p>
						</div>

						<div>
							<h3 className="text-lg font-semibold text-white">Details</h3>
							<ul className="text-gray-300 mt-2 space-y-2">
								<li>
									<strong className="text-gray-100">Location:</strong>{" "}
									{event?.E_location}
								</li>
								<li>
									<strong className="text-gray-100">Timings:</strong>{" "}
									{event?.E_timings}
								</li>
								<li>
									<strong className="text-gray-100">Team size:</strong>{" "}
									{event?.E_team_size}
								</li>
								<li>
									<strong className="text-gray-100">
										Registration deadline:
									</strong>{" "}
									{formatTime(event?.deadline)}
								</li>
								<li>
									<strong className="text-gray-100">Status:</strong>{" "}
									<span
										className={
											registrationOpen ? "text-green-400" : "text-red-400"
										}
									>
										{registrationOpen ? "Open" : "Closed"}
									</span>
								</li>
							</ul>
						</div>
					</div>

					<div>
						<h3 className="text-lg font-semibold text-white">Guidelines / Rules</h3>
						<ul className="list-disc list-inside text-gray-300 mt-2 space-y-1">
							{(event?.E_guidelines || []).map((g, i) => (
								<li key={i}>{g}</li>
							))}
						</ul>
					</div>

					<div className="flex items-center gap-4">
						<motion.button
							onClick={handleRegister}
							className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-4 rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
							whileHover={{ scale: registrationOpen ? 1.02 : 1 }}
							whileTap={{ scale: registrationOpen ? 0.98 : 1 }}
							disabled={!registrationOpen}
							aria-disabled={!registrationOpen}
							title={
								registrationOpen
									? "Register for this workshop"
									: "Registration closed"
							}
						>
							{registrationOpen ? "Register" : "Registration Closed"}
						</motion.button>

						<button
							onClick={() => router.push("/workshops")}
							className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg"
						>
							Back to workshops
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default WorkshopDetailsPage;
