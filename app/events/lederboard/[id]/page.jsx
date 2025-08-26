"use client";
import React, {useEffect, useState} from "react";
import {useParams} from "next/navigation";
import {ArrowUpCircle, Calendar, Clock, MapPin, Trophy} from "lucide-react";

const EventLeaderboard = () => {
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const {id} = useParams();

  const baseUrl =
    process.env.NODE_ENV === "production"
      ? ""
      : "http://localhost:5000";

  const fetchEventData = async () => {
    if (!id) return;
    try {
      // setLoading(true);
      const response = await fetch(`${baseUrl}/api/users/event/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch event data");
      }
      const data = await response.json();
      console.log(data)

      // Sort groups by time (lowest first)
      const sortedGroups = [...data.event.Group_Id].sort((a, b) => {
        const timeA = a.completion_time
          ? convertTimeToSeconds(a.completion_time)
          : Infinity;
        const timeB = b.completion_time
          ? convertTimeToSeconds(b.completion_time)
          : Infinity;
        return timeA - timeB;
      });

      // make sure they have a completion time
      const filteredGroups = sortedGroups.filter((group) => group.completion_time && group.completion_time !== "00:00");

      setEventData({...data.event, Group_Id: filteredGroups});
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // setTimeout(fetchEventData, 5000);
  useEffect(() => {
    fetchEventData();
    const interval = setInterval(() => {
      fetchEventData();
    }, 4000); // Fetch every 5 seconds

    return () => clearInterval(interval);
  }, [id]);

  const convertTimeToSeconds = (timeString) => {
    if (!timeString) return Infinity;
    const [minutes, seconds] = timeString.split(":").map(Number);
    return minutes * 60 + seconds;
  };

  const formatTime = (timeString) => {
    if (!timeString || timeString === "00:00") return "Not Completed";
    return timeString;
  };

  const getInitials = (teamName) => {
    if (!teamName) return "?";
    const words = teamName.split(" ");
    if (words.length === 1) return teamName.charAt(0).toUpperCase();
    return (
      words[0].charAt(0) + words[words.length - 1].charAt(0)
    ).toUpperCase();
  };

  // Get random gradient for team avatars
  const getTeamGradient = (teamId) => {
    const gradients = [
      "from-purple-600 to-indigo-600",
      "from-cyan-500 to-blue-500",
      "from-emerald-500 to-teal-500",
      "from-pink-500 to-rose-500",
      "from-amber-500 to-orange-500",
    ];

    // Use team ID to get consistent color
    const index = teamId ? teamId.charCodeAt(0) % gradients.length : 0;
    return gradients[index];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-b from-gray-900 to-black">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-cyan-400"></div>
          <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
            <span className="text-cyan-400 text-xs">LOADING</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-gradient-to-r from-red-900 to-red-800 border-l-4 border-red-500 text-red-100 p-6 m-4 rounded-lg shadow-lg"
        role="alert"
      >
        <p className="font-bold text-xl mb-2">Unable to Load Data</p>
        <p className="opacity-80">{error}</p>
        <button
          className="mt-4 bg-red-700 hover:bg-red-600 px-4 py-2 rounded-md text-sm font-medium transition-colors"
          onClick={fetchEventData}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="text-center mt-16 text-gray-400 p-8 bg-gray-900 rounded-lg shadow-inner">
        <div className="inline-block p-4 rounded-full bg-gray-800 mb-4">
          <Trophy className="w-12 h-12 text-gray-600"/>
        </div>
        <h3 className="text-xl font-semibold">No Event Data Available</h3>
        <p className="mt-2 text-gray-500">
          The requested event may not exist or has been removed.
        </p>
      </div>
    );
  }

  let topThree = eventData.Group_Id.slice(0, 3).filter(
    (group) => group.completion_time && group.completion_time !== "00:00"
  );

  // Remove top 3 from remaining groups
  const groupsForTable = eventData.Group_Id.filter(
    (group) => !topThree.find((topGroup) => topGroup._id === group._id)
  );

  // Calculate completion percentage
  const completedTeams = eventData.Group_Id.filter(
    (group) => group.completion_time && group.completion_time !== "00:00"
  ).length;
  const completionPercentage =
    eventData.Group_Id.length > 0
      ? Math.round((completedTeams / eventData.Group_Id.length) * 100)
      : 0;

  return (
    <div className="bg-gradient-to-r  from-blue-900 to-indigo-900 min-h-screen text-gray-100 pb-2">
      {/* Header with blurred background */}
      <div className="relative pt-20  ">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-indigo-600/20 backdrop-blur-sm"></div>
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-cyan-500 rounded-full opacity-10 blur-2xl"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-500 rounded-full opacity-10 blur-2xl"></div>
        </div>

        <div className="container mx-auto px-3 py-3 relative z-10">
          {/* Grid Layout for Header */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Event Info Section */}
            <div className="py-9">
              <div
                className="inline-block bg-cyan-500/20 px-2 py-1 rounded-full text-cyan-300 text-[0.6rem] font-semibold mb-1">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse"></span>
                LIVE LEADERBOARD
              </div>
              <h1 className="text-xl md:text-2xl font-bold mb-1 text-white">
                {eventData.E_name}
              </h1>
              <div className="flex flex-wrap gap-2 text-xs mt-1">
                <div className="flex items-center text-gray-300">
                  <Calendar className="w-3 h-3 mr-1 text-cyan-400"/>
                  {new Date(eventData.E_date).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
                <div className="flex items-center text-gray-300">
                  <Clock className="w-3 h-3 mr-1 text-cyan-400"/>
                  {eventData.E_timings}
                </div>
                <div className="flex items-center text-gray-300">
                  <MapPin className="w-3 h-3 mr-1 text-cyan-400"/>
                  {eventData.E_location}
                </div>
              </div>
              {/* Action Buttons (Moved to be below Event Info on small screens) */}
              <div className="flex gap-2 mt-2">
                {/* <Link className="bg-indigo-600 hover:bg-indigo-500 px-3 py-1 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                href={`/se`}>
                  <Share2 className="w-3 h-3" /> Share
                </Link> */}
                <button
                  className="bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                  onClick={fetchEventData}
                >
                  <ArrowUpCircle className="w-3 h-3"/> Refresh
                </button>
                <button
                  className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                  disabled
                >
                  <Clock className="w-3 h-3"/> Benchmark Time: 14.8s
                </button>
              </div>
            </div>

            {/* Top Performers Section (Taking up the other grid column) */}
            <div className="p-8">
              {topThree.length > 0 && (
                <div className="mb-2">
                  <div className="flex flex-row justify-center items-end gap-2 md:gap-4">
                    {/* Second place */}
                    {topThree[1] && (
                      <div className="relative flex flex-col items-center">
                        <div
                          className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-br from-gray-300 to-gray-400 text-gray-900 rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-md text-[0.5rem]">
                          2
                        </div>
                        <div
                          className={`w-16 h-16 md:w-20 md:h-20 rounded-xl bg-gradient-to-br ${getTeamGradient(
                            topThree[1]._id
                          )} flex items-center justify-center shadow-lg shadow-indigo-900/20 border-2 border-gray-700 overflow-hidden`}
                        >
                          <div className="text-white text-2xl md:text-3xl font-bold">
                            {getInitials(topThree[1]?.team_name)}
                          </div>
                        </div>
                        <div className="mt-1 text-center">
                          <h3 className="text-white text-sm font-semibold">
                            {topThree[1]?.team_name || "Unnamed Team"}
                          </h3>
                          <p
                            className="text-gray-300 text-[0.6rem] mt-1 bg-gray-800/50 px-2 py-1 rounded-full inline-block">
                            {formatTime(topThree[1]?.completion_time)}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* First place */}
                    {topThree[0] && (
                      <div className="relative flex flex-col items-center transform md:scale-110 z-10">
                        <div
                          className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-br from-yellow-300 to-yellow-500 text-yellow-900 rounded-full w-6 h-6 flex items-center justify-center font-bold text-sm shadow-md">
                          1
                        </div>
                        <div
                          className={`w-20 h-20 md:w-24 md:h-24 rounded-xl bg-gradient-to-br ${getTeamGradient(
                            topThree[0]._id
                          )} flex items-center justify-center shadow-lg border-2 border-yellow-400 overflow-hidden`}
                        >
                          <div className="text-white text-3xl md:text-4xl font-bold">
                            {getInitials(topThree[0]?.team_name)}
                          </div>
                        </div>
                        <div className="mt-1 text-center">
                          <h3 className="text-white text-lg font-semibold">
                            {topThree[0]?.team_name || "Unnamed Team"}
                          </h3>
                          <p
                            className="text-yellow-400 text-xs mt-1 bg-gray-800/50 px-2 py-1 rounded-full inline-block font-medium">
                            {formatTime(topThree[0]?.completion_time)}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Third place */}
                    {topThree[2] && (
                      <div className="relative flex flex-col items-center">
                        <div
                          className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-br from-amber-600 to-amber-700 text-amber-100 rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-md text-[0.5rem]">
                          3
                        </div>
                        <div
                          className={`w-16 h-16 md:w-20 md:h-20 rounded-xl bg-gradient-to-br ${getTeamGradient(
                            topThree[2]._id
                          )} flex items-center justify-center shadow-lg shadow-indigo-900/20 border-2 border-gray-700 overflow-hidden`}
                        >
                          <div className="text-white text-2xl md:text-3xl font-bold">
                            {getInitials(topThree[2]?.team_name)}
                          </div>
                        </div>
                        <div className="mt-1 text-center">
                          <h3 className="text-white text-sm font-semibold">
                            {topThree[2]?.team_name || "Unnamed Team"}
                          </h3>
                          <p
                            className="text-gray-300 text-[0.6rem] mt-1 bg-gray-800/50 px-2 py-1 rounded-full inline-block">
                            {formatTime(topThree[2]?.completion_time)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 py-4 flex items-center justify-center">
        <div
          className="bg-gradient-to-b from-gray-800 to-gray-900 shadow-lg lg:w-3/4 rounded-xl overflow-hidden mb-12 border border-gray-700">
          <div className="p-3">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700 ">
                <thead className="bg-gray-800/60">
                <tr>
                  <th className="px-3 py-2 text-left text-[0.6rem] font-medium text-gray-300 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-3 py-2 text-left text-[0.6rem] font-medium text-gray-300 uppercase tracking-wider">
                    Team
                  </th>

                  <th className="px-3 py-2 text-left text-[0.6rem] font-medium text-gray-300 uppercase tracking-wider">
                    Time
                  </th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                {groupsForTable.map((group, index) => (
                  <tr
                    key={group._id}
                    className="hover:bg-gray-800/60 transition-colors duration-150 ease-in-out"
                  >
                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-100">
                      <div className="flex items-center">
                          <span
                            className="bg-gray-700 w-4 h-4 rounded-full flex items-center justify-center text-[0.5rem] mr-2">
                            {index + 4}
                          </span>
                      </div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className={`w-6 h-6 rounded-lg bg-gradient-to-br ${getTeamGradient(
                            group._id
                          )} flex items-center justify-center mr-2`}
                        >
                            <span className="text-white text-[0.5rem] font-bold">
                              {getInitials(group.team_name)}
                            </span>
                        </div>
                        <span className="text-xs font-medium text-gray-100">
                            {group.team_name || "Unnamed Team"}
                          </span>
                      </div>
                    </td>

                    <td className="px-3 py-2 whitespace-nowrap">
                        <span
                          className={`text-[0.6rem] px-2 py-1 rounded-full ${
                            group.completion_time &&
                            group.completion_time !== "00:00"
                              ? "bg-green-900/30 text-green-400"
                              : "bg-gray-800/50 text-gray-400"
                          }`}
                        >
                          {formatTime(group.completion_time)}
                        </span>
                    </td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed bottom status bar */}
      <div
        className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-gray-900 to-gray-900 border-t border-gray-800 py-2 backdrop-blur-sm z-20">
        <div className="container mx-auto px-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              <div className="bg-cyan-500/10 p-1 rounded-lg">
                <Trophy className="w-4 h-4 text-cyan-400"/>
              </div>
              <div>
                <p className="text-sm text-gray-400">Completed</p>
                <p className="text-sm font-bold text-white">
                  {completedTeams} / {eventData.Group_Id.length}
                </p>
              </div>
            </div>

            <div className="hidden md:flex flex-col items-center bg-gray-800/70 px-2 py-1 rounded-lg">
              <div className="text-[0.6rem] text-gray-400">Event Status</div>
              <div className="flex  items-center mt-1">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                <span className="text-green-400 font-medium text-xs">LIVE</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <div>
                <p className="text-sm text-right font-bold text-green-600">
                  Now Serving
                </p>
                <div className="flex justify-end items-center">
                  <p className="text-sm font-bold text-green-400 text-right">
                    {eventData.current_token_number}
                  </p>
                  <div className="bg-indigo-500/10 p-1 rounded-lg">
                    <span className="font-bold text-indigo-400 text-sm">#</span>
                  </div>
                </div>

                <p className="text-[0.6rem]  text-white text-right">
                  If your token is ≤{eventData.current_token_number}{" "}, attend now.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventLeaderboard;
