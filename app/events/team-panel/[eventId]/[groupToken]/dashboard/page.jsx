"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Head from "next/head";
import { FaEye, FaCalendarAlt, FaBook, FaDrone } from "react-icons/fa";

const TeamDashboard = () => {
    const [team, setTeam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const params = useParams();
    const groupToken = params?.groupToken;
    const schedule = [
        {
            day : "Day 1",
            venue: "Senate Hall",
            Timing: "5:15 PM - 8:00 PM",
        },
        {
            day : "Day 2",
            venue: "Senate Hall",
            Timing: "10:00 AM - 5:00 PM ",
        },
        {
            day : "Day 3",
            venue: "Sports Complex",
            Timing: "to be conveyed...",
        },
        {
            day : "Day 4",
            venue: "Senate Hall",
            Timing: "to be conveyed...",
        }
    ]
    useEffect(() => {
        const fetchTeamData = async () => {
            try {
                const baseUrl = process.env.NODE_ENV === "production"
                    ? process.env.NEXT_PUBLIC_BACKEND_URL
                    : "http://localhost:5000";

                if (!baseUrl) {
                    throw new Error("Backend URL not set");
                }

                const response = await fetch(`${baseUrl}/api/users/teamdashboard`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ Group_token: groupToken }),
                });

                if (!response.ok) {
                    throw new Error("Failed to verify group token or team not found.");
                }

                const data = await response.json();
                setTeam(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        if (groupToken) {
            fetchTeamData();
        }
    }, [groupToken]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900">
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (!team) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900">
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
                    <p className="font-bold">Warning</p>
                    <p>No team information found.</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>Team Dashboard</title>
            </Head>
            <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 text-white p-4 sm:p-8">
                {/* Background layers */}
                <div className="absolute inset-0 overflow-hidden z-0">
                    <div className="stars"></div>
                    <div className="twinkling"></div>
                    <div className="clouds"></div>
                </div>

                {/* Content with a higher z-index */}
                <div className="relative z-10 max-w-6xl mx-auto pt-24 sm:pt-16">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl monoton mb-4 sm:mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-500">
                        Skyforge 1.0
                    </h1>
                    <div className="text-center">
                        <h2 className="text-xl sm:text-2xl font-mono md:text-3xl mb-8 sm:mb-12 text-center text-blue-300">
                            4-Day Drone Workshop by Aeromodelling Club
                        </h2>
                        <p className="font-bold text-2xl font-mono italic da text-gray-300">Team Name: {team.team_name}</p>

                    </div>

                    <div className="bg-gray-800 mt-4 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl p-4 sm:p-6 mb-8">
                        <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-purple-400">
                            <i className="fas fa-user-tie mr-2"></i> Team Leader & Details
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="font-semibold text-blue-300">Team Name:</p>
                                <p>{team.team_name}</p>
                            </div>
                            <div>
                                <p className="font-semibold text-blue-300">Leader Name:</p>
                                <p>{team.Group_leader_id.full_name}</p>
                            </div>
                            <div>
                                <p className="font-semibold text-blue-300">Email:</p>
                                <p>{team.Group_leader_id.email}</p>
                            </div>
                            <div>
                                <p className="font-semibold text-blue-300">Mobile:</p>
                                <p>{team.g_leader_mobile}</p>
                            </div>
                            <div>
                                <p className="font-semibold text-blue-300">College:</p>
                                <p>{team.g_leader_college_name}</p>
                            </div>
                            <div>
                                <p className="font-semibold text-blue-300">Group Token:</p>
                                <p>{groupToken}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl p-4 sm:p-6 mb-8">
                        <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-purple-400">
                            <i className="fas fa-users mr-2"></i> Team Members
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead>
                                    <tr className="text-left text-blue-300">
                                        <th className="py-2 px-3">Name</th>
                                        <th className="py-2 px-3">College</th>
                                        <th className="py-2 px-3">Year</th>
                                        <th className="py-2 px-3">Branch</th>
                                        <th className="py-2 px-3">Mobile</th>
                                        <th className="py-2 px-3">Email</th>
                                        <th className="py-2 px-3">Payment_sc</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {team.Group_members_team_ids.map((member, index) => (
                                        <tr key={member._id} className={index % 2 === 0 ? "bg-gray-700 bg-opacity-30" : ""}>
                                            <td className="py-2 px-3">{member.Member_name}</td>
                                            <td className="py-2 px-3">{member.Member_college_name}</td>
                                            <td className="py-2 px-3">{member.Member_year}</td>
                                            <td className="py-2 px-3">{member.Member_branch}</td>
                                            <td className="py-2 px-3">{member.Member_mob_no}</td>
                                            <td className="py-2 px-3">{member.Member_email}</td>
                                            <td className="py-2 px-3">
                                                <a href={member.Payment_sc} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                                                    <FaEye className="mr-2" />
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl p-4 sm:p-6 mb-8">
                        <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-purple-400">
                            <FaCalendarAlt className="inline-block mr-2" /> Workshop Schedule
                        </h2>
                        {/* <p className="text-yellow-300 mb-4">The detailed schedule will be available soon. Stay tuned!</p> */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            {schedule.map((day, index) => (
                                <div key={index} className="bg-gray-700 bg-opacity-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-semibold mb-2">{day.day}</h3>
                                    <h6>Venue : {day.venue}</h6>
                                    <h6>Timing : {day.Timing}</h6>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl p-4 sm:p-6 mb-8">
                        <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-purple-400">
                            <FaBook className="inline-block mr-2" /> Workshop Resources
                        </h2>
                        <p className="text-yellow-300 mb-4">Below you will get all resources of workshop once we will start with the workshop will get started!!</p>
                        <ul className="list-disc list-inside text-blue-300">
                            <li>
                                <a href="https://docs.google.com/presentation/d/1Zj_Fzg6LNh6NAWKn1RmH3d4c84XhnWIg/edit?usp=sharing&ouid=108628649323282460611&rtpof=true&sd=true" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-400">
                                    Day 1 : Introduction to Drones
                                </a>
                            </li>
                            <li>
                                <a href="https://docs.google.com/presentation/d/1Ogqio2iLtnQHSw0DBce3mm8zYWoA-lLh/edit?usp=sharing&ouid=108628649323282460611&rtpof=true&sd=true" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-400">
                                    Day 2: Basics of Drone
                                </a>
                            </li>
                            <li>
                                <a href="https://docs.google.com/presentation/d/1jyi86x2pOrv5a4o9kIkh9UJZR26Y3ZQg/edit?usp=sharing&ouid=108628649323282460611&rtpof=true&sd=true" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-400">
                                    Day 2: Advance Topics
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl p-4 sm:p-6 mb-8">
                        <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-purple-400">
                            <FaBook className="inline-block mr-2" /> Feedback
                        </h2>
                        <p className="text-yellow-300 mb-4">Below you will get link to feedback form!!</p> 
                        <ul className="list-disc list-inside text-blue-300">
                            <li>
                                <a href="https://docs.google.com/forms/d/e/1FAIpQLSeOqaIL_guNVc4oXY2VzS3C6jTy7YYfCANnpnjV8qux9UVJfw/viewform?usp=sf_link" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-400">
                                    Feedback Form
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TeamDashboard;
