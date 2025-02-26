"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Calendar, Clock, MapPin, Users, X, Save, ArrowDown } from "lucide-react";

const EventDashboard = () => {
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [team, setTeam] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGroupId, setEditingGroupId] = useState(null);
  const [timeValue, setTimeValue] = useState("");
  const [savingTime, setSavingTime] = useState(false);
  const [memberTimes, setMemberTimes] = useState({});
  const { id } = useParams();
  
  const baseUrl = process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_BACKEND_URL
    : "http://localhost:5000";

  const fetchEventData = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/api/users/event/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch event data");
      }
      const data = await response.json();
      console.log(data);
      // Sort groups by time (lowest first)
      const sortedGroups = [...data.event.Group_Id].sort((a, b) => {
        const timeA = a.completion_time ? convertTimeToSeconds(a.completion_time) : Infinity;
        const timeB = b.completion_time ? convertTimeToSeconds(b.completion_time) : Infinity;
        return timeA - timeB;
      });
      
      setEventData({...data.event, Group_Id: sortedGroups});
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventData();
  }, [id]);

  const convertTimeToSeconds = (timeString) => {
    if (!timeString) return Infinity;
    const [minutes, seconds] = timeString.split(':').map(Number);
    return minutes * 60 + seconds;
  };

  const formatTime = (timeString) => {
    if (!timeString || timeString === "00:00") return "00:00";
    return timeString;
  };

  const handleTimeChange = (e) => {
    const value = e.target.value;
    // Validate time format (MM:SS)
    console.log("User Typed:", value); 
    setTimeValue(value);
    // if (/^([0-5]?[0-9]):([0-5][0-9])$/.test(value) || value === "") {
    // }
  };

  const saveGroupTime = async (groupId, groupToken) => {
    if (!timeValue || !groupId) return;
    
    try {
      setSavingTime(true);
      const response = await fetch(`${baseUrl}/api/users/update-group-time`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          group_id: groupId,
          group_token: groupToken,
          event_id: id,
          completion_time: timeValue 
        }),
      });


      if (!response.ok) {
        throw new Error("Failed to update time");
      }
      
      // Refresh event data to get updated times and sorting
      await fetchEventData();
      setEditingGroupId(null);
      setTimeValue("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingTime(false);
    }
  };

  const saveMemberTime = async (memberId, groupToken) => {
    if (!memberTimes[memberId] || !memberId) return;
    
    try {
      setSavingTime(true);
      const response = await fetch(`${baseUrl}/api/users/update-member-time`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          member_id: memberId,
          group_token: groupToken,
          event_id: id,
          completion_time: memberTimes[memberId] 
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update member time");
      }
      
      // Refresh team data
      if (team) {
        fetchTeamData(groupToken);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingTime(false);
    }
  };

  const fetchTeamData = async (groupToken) => {
    try {
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
      
      // Initialize member times from fetched data
      const initialMemberTimes = {};
      data.Group_members_team_ids.forEach(member => {
        initialMemberTimes[member._id] = member.completion_time || "00:00";
      });
      setMemberTimes(initialMemberTimes);
      
      setTeam(data);
      setModalOpen(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleMemberTimeChange = (memberId, value) => {
    // Validate time format (MM:SS)
    if (/^([0-5]?[0-9]):([0-5][0-9])$/.test(value) || value === "") {
      setMemberTimes(prev => ({
        ...prev,
        [memberId]: value
      }));
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setTeam(null);
    setMemberTimes({});
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900 border-l-4 border-red-500 text-red-100 p-4 m-4" role="alert">
        <p className="font-bold">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="text-center mt-8 text-gray-400">
        No event data available.
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen text-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gray-800 mt-24 shadow-lg rounded-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
            <h1 className="text-3xl font-bold mb-2">{eventData.E_name}</h1>
            <h2 className="text-lg font-bold">Total Groups: {eventData.Group_Id.length}</h2>
            <h2 className="text-lg font-bold">Total Participants: {eventData.participants_id.length}</h2>
            <h2 className="text-lg font-bold">Current Token No: {eventData.current_token_number}</h2>
          </div>
          <div className="p-6">
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center text-gray-300">
                <Calendar className="w-5 h-5 mr-2" />
                {new Date(eventData.E_date).toLocaleDateString()}
              </div>
              <div className="flex items-center text-gray-300">
                <Clock className="w-5 h-5 mr-2" />
                {eventData.E_timings}
              </div>
              <div className="flex items-center text-gray-300">
                <MapPin className="w-5 h-5 mr-2" />
                {eventData.E_location}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-gray-100">Groups</h2>
              <div className="flex items-center text-sm text-gray-300">
                <ArrowDown className="w-4 h-4 mr-1" />
                <span>Sorted by completion time</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700 ">
                <thead className="bg-gray-700">
                  <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      S no
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Group Token
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Team Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Member Count
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {eventData.Group_Id.map((group, index) => (
                    <tr
                      key={group._id}
                      className="hover:bg-gray-700 transition-colors duration-150 ease-in-out"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                        {index+1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                        {group.Group_token}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {group.team_name || "Unnamed Team"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {group.Group_members_team_ids.length || "0"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {editingGroupId === group._id ? (
                          <div className="flex items-center space-x-2">
                            <input
                              type="text"
                              className="bg-gray-700 text-white px-2 py-1 rounded w-24"
                              placeholder="MM:SS"
                              value={timeValue}
                              onChange={handleTimeChange}
                            />
                            
                            <button 
                              onClick={() => saveGroupTime(group._id, group.Group_token)}
                              disabled={savingTime}
                              className="text-green-400 hover:text-green-300 disabled:text-gray-500"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <span 
                            className="cursor-pointer hover:text-blue-400"
                            onClick={() => {
                              setEditingGroupId(group._id);
                              setTimeValue(group.completion_time || "00:00");
                            }}
                          >
                            {formatTime(group.completion_time)}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm cursor-pointer text-blue-400 hover:text-blue-300"
                        onClick={() => fetchTeamData(group.Group_token)}>
                        View Group
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {modalOpen && team && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-gray-800 w-11/12 md:max-w-3xl mx-auto rounded-lg shadow-xl overflow-hidden">
            <div className="flex justify-between items-center bg-gradient-to-r from-blue-600 to-indigo-700 p-4">
              <h2 className="text-2xl font-bold text-white">
                Team Details - {team.team_name || "Unnamed Team"}
              </h2>
              <button onClick={closeModal} className="text-white hover:text-gray-200">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-gray-300"><strong className="text-gray-100">Group Token:</strong> {team.Group_token}</p>
                  <p className="text-gray-300"><strong className="text-gray-100">Leader Name:</strong> {team.Group_leader_id.full_name}</p>
                </div>
                <div>
                  <p className="text-gray-300"><strong className="text-gray-100">Leader Email:</strong> {team.g_leader_email}</p>
                  <p className="text-gray-300"><strong className="text-gray-100">Leader Mobile:</strong> {team.g_leader_mobile}</p>
                </div>
              </div>
              <div className="flex items-center mb-4">
                <Users className="w-5 h-5 mr-2 text-blue-400" />
                <span className="text-lg font-semibold text-gray-100">Team Members ({team.Group_members_team_ids.length})</span>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Roll No</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Mobile No</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Payment Receipt</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Time</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {team.Group_members_team_ids.map((member) => (
                      <tr key={member._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">{member.Member_name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{member.Member_roll_no}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{member.Member_mob_no}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          <a
                            href={member.Payment_sc}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 transition-colors duration-150 ease-in-out"
                          >
                            View Payment
                          </a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          <div className="flex items-center space-x-2">
                            <input
                              type="text"
                              className="bg-gray-700 text-white px-2 py-1 rounded w-24"
                              placeholder="MM:SS"
                              value={memberTimes[member._id] || "00:00"}
                              onChange={(e) => handleMemberTimeChange(member._id, e.target.value)}
                            />
                            <button 
                              onClick={() => saveMemberTime(member._id, team.Group_token)}
                              disabled={savingTime}
                              className="text-green-400 hover:text-green-300 disabled:text-gray-500"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDashboard;