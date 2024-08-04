"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaLaptop, FaPlane } from 'react-icons/fa';

const MeetListPage = () => {
  const [meets, setMeets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeets = async () => {
      try {
        console.log( process.env.NEXT_PUBLIC_BACKEND_URL )
        const baseUrl = process.env.NODE_ENV === 'production' 
          ? process.env.NEXT_PUBLIC_BACKEND_URL 
          : 'http://localhost:5000';
        const response = await fetch(`${baseUrl}/api/users/getallmeets`);
        if (!response.ok) {
          throw new Error('Failed to fetch induction sessions');
        }
        const data = await response.json();
        setMeets(data.sort((a, b) => new Date(a.meet_date).getTime() - new Date(b.meet_date).getTime()));
      } catch (error) {
        console.error('Error fetching induction sessions:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchMeets();
  }, []);

  if (loading) {
    return (
      <div className="loader-container bg-black">
        <video className="loader-video" autoPlay loop muted>
          <source src="/loading.webm" type="video/webm" />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex justify-center items-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(1000)].map((_, i) => (
          <div key={i} className="absolute bg-white rounded-full"
            style={{
              top: `${Math.random() * 90}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 5}px`,
              height: `${Math.random() * 5}px`,
              opacity: 0.1,
              animation: `twinkle ${Math.random() * 2 + 1}s linear infinite`,
            }}
          />
        ))}
      </div>
      <div className="w-full mt-20 max-w-7xl relative">
        <div className="text-center">
          <FaPlane className="text-6xl text-blue-500 mx-auto mb-4" />
          <h1 className='text-4xl monoton md:text-6xl text-white mb-2'>Aeromodeling&nbsp;&nbsp; Club</h1>
          <h2 className='text-2xl monoton md:text-3xl text-blue-400 mb-8'>NIT&nbsp;&nbsp; Kurukshetra</h2>
        </div>
        <h1 className="text-4xl monoton mb-6 text-center text-white">Upcoming &nbsp;&nbsp; Meets &nbsp;&nbsp; Timeline</h1>
        <div className="relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-blue-500" />
          {meets.map((meet, index) => (
            <MeetCard key={meet._id} meet={meet} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

const MeetCard = ({ meet, index }) => {
  const isLeft = index % 2 === 0;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`mb-16 flex justify-center items-center w-full ${isLeft ? 'flex-row-reverse' : ''}`}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`md:w-5/6 lg:w-5/12 ${isLeft ? 'pr-8' : 'pl-8'}`}>
        <div className="bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-102 hover:translate-y-[-2px] relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10 flex flex-col p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-blue-300">{meet.meet_team_type} Meet</h2>
              <Link href={`/meets/${meet._id}`}>
                <button className="bg-gradient-to-r from-blue-900 to-green-700 text-white px-3 py-1 text-sm rounded-full hover:from-white-500 hover:to-green-500 transition duration-300 transform hover:scale-105 shadow-md">
                  View
                </button>
              </Link>
            </div>
            <div className="flex items-center space-x-4 text-sm text-white mb-2">
              <div className="flex items-center">
                <FaCalendarAlt className="mr-2 text-green-400" />
                <p>{new Date(meet.meet_date).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center">
                <FaClock className="mr-2 text-green-400" />
                <p>{meet.meet_time}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-white mb-2">
              <div className="flex items-center">
                <FaMapMarkerAlt className="mr-2 text-green-400" />
                <p>{meet.meet_venue}</p>
              </div>
              <div className="flex items-center">
                <FaLaptop className="mr-2 text-green-400" />
                <p>{meet.meet_mode}</p>
              </div>
            </div>
            <p className="text-sm text-gray-300 mt-2">{meet.meet_description}</p>
          </div>
        </div>
      </div>
      <div className="w-2/12 flex justify-center">
        <div className={`w-6 h-6 bg-blue-500 rounded-full border-4 border-gray-900 z-10 transition-all duration-300 ${isHovered ? 'scale-150 bg-green-500 shadow-lg shadow-pink-500/50' : ''}`} />
      </div>
      <div className="w-5/12" />
    </motion.div>
  );
};

export default MeetListPage;
