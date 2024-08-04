"use client"
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { FaPlane, FaMapMarkerAlt, FaClock, FaMouse } from 'react-icons/fa';
import { RiTimerLine } from "react-icons/ri";

// This function is for foramting time and date on deadline (line 101)

function formatDateTime(dateString) {
  const date = new Date(dateString);
  const optionsDate = { year: 'numeric', month: 'long', day: 'numeric' };
  const optionsTime = { hour: 'numeric', minute: 'numeric', hour12: true };

  const datePart = date.toLocaleDateString(undefined, optionsDate);
  const timePart = date.toLocaleTimeString(undefined, optionsTime);

  return `${datePart}, ${timePart}`;
}

const InductionSessionsList = () => {
  const [inductionSessions, setInductionSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInductionSessions = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users/getallinduction');
        if (!response.ok) {
          throw new Error('Failed to fetch induction sessions');
        }
        const data = await response.json();
        console.log(data);
        setInductionSessions(data);
      } catch (error) {
        console.error('Error fetching induction sessions:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInductionSessions();
  }, []);

  const sortedSessions = [...inductionSessions].sort((a, b) => {
    const dateA = new Date(a.I_date);
    const dateB = new Date(b.I_date);
    return dateA - dateB;
  });

  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <div className='w-32 h-32 border-b-4 border-t-2 border-blue-500 rounded-full animate-spin'></div>
      </div>
    )
    // return <p className=" animate-spin rounded-full h-32 w-32 border-t-2 border-b-4 border-blue-500"></p>;
  }

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden mb-10">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="stars"></div>
        <div className="twinkling"></div>
        <div className="clouds"></div>
      </div>

      <div className="container mx-auto px-4 mt-28 relative z-10">
        <div className="text-center mb-12">
          <FaPlane className="text-6xl text-blue-500 mx-auto mb-4" />
          <h1 className='text-4xl monoton md:text-6xl  text-white mb-2'>Aeromodeling&nbsp;&nbsp; Club</h1>
          <h3 className='text-xl monoton md:text-4xl text-gray-300'>Induction &nbsp;&nbsp; Sessions</h3>
          <h2 className='text-2xl monoton md:text-3xl  text-blue-400 mb-8'>NIT&nbsp;&nbsp; Kurukshetra</h2>
        </div>
        <div className=" mb-4 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-1">
          {sortedSessions.map(session => (
            <div key={session._id} className="bg-gray-800 border  border-gray-700 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 hover:border-blue-500">
              <div className="lg:flex">
                <img src="/rocket-launching.jpg" alt="Induction Session" className="w-full lg:w-60 h-60 lg:h-auto object-cover" />
                <div className="p-6 flex-grow">
                  <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4'>
                    <h3 className="text-2xl font-semibold mb-2 sm:mb-0 text-white-500">{session.I_name}</h3>
                    <Link
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300"
                      href={`inductions/register/${session._id}`}
                    >
                      Register Now
                    </Link>
                  </div>
                  <hr className="mb-4 border-gray-600" />
                  <p className="text-md mb-6 text-gray-300">{session.I_description}</p>
                  <div className='flex flex-col sm:flex-row justify-between text-sm text-gray-300'>
                    <div>
                      <p className="mb-1"><FaMapMarkerAlt className="inline mr-2 text-red-600" /> {session.I_venue}</p>
                      <p><FaClock className="inline mr-2" />{session.I_timing}</p>
                    </div>
                    <div className="mt-2 sm:mt-0 text-right">
                      <p className="text-left mb-1 text-red-500"><RiTimerLine className="inline mr-1 mb-1 text-red-500" />{formatDateTime(session.I_deadline)}</p>
                      <p className={session.I_active_status ? "text-green-400" : "text-red-400"}>
                        {session.I_active_status ? "Active now " : "Submission closed"}
                        <FaMouse className="inline mr-2" />
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InductionSessionsList;