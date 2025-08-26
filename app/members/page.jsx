"use client";
import React, {useEffect, useState} from 'react';
import {motion} from 'framer-motion';

const UserDisplay = () => {
  const [users, setUsers] = useState({byYear: {}, alumni: []});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const baseUrl = process.env.NODE_ENV === 'production'
          ? ""
          : 'http://localhost:5000';
        const response = await fetch(`${baseUrl}/api/users/getourmembers`);
        if (!response.ok) throw new Error('Network response was not ok');
        const allUsers = await response.json();

        const currentYear = new Date().getFullYear();
        const getStartYear = (session) => Number(session.split('-')[0]);

        const byYear = {};
        const alumni = [];

        allUsers.forEach(user => {
          if (user.role === 'member') {
            const startYear = getStartYear(user.session);
            if (currentYear - startYear < 4) {
              if (!byYear[startYear]) byYear[startYear] = [];
              byYear[startYear].push(user);
            } else {
              alumni.push(user);
            }
          }
        });

        // Sort years in descending order to show seniors first
        const sortedYears = Object.keys(byYear).sort((a, b) => b - a);

        setUsers({
          byYear: sortedYears.reduce((acc, year) => {
            acc[year] = byYear[year];
            return acc;
          }, {}), alumni
        });
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch users');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div className="text-center text-2xl mt-8 text-white">Preparing for takeoff...</div>;
  if (error) return <div className="text-center mt-24 text-red-500 text-2xl">{error}</div>;

  const UserCard = ({user}) => (
    <motion.div
      className="relative rounded-lg bg-gray-800 text-white cursor-pointer transform transition-transform duration-300 hover:scale-105"
      initial={{opacity: 0, y: 50}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.5}}
    >
      <div className="relative h-80 bg-gray-700 overflow-hidden rounded-t-lg">
        <img
          src={user.profile_pic || 'https://source.unsplash.com/random/400x200/?airplane'}
          alt={user.full_name}
          className="w-full h-full object-cover"
        />
      </div>
      <div
        className="absolute inset-0 flex flex-col justify-center items-center p-6 bg-gray-900 bg-opacity-80 transition-opacity duration-300 opacity-0 hover:opacity-100">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-2">{user.full_name}</h3>
          <p className="text-sm mb-2">{user.email}</p>
          <p className="text-sm mb-2">{user.roll_no} | {user.session} | {user.branch}</p>
          {user.company_name && (
            <p className="text-sm mt-2">{user.company_name} - {user.current_post}</p>
          )}
        </div>
      </div>
      {/* Section for name and team below the image */}
      <div className="bg-gray-800 p-4 rounded-b-lg text-center">
        <h3 className="text-xl font-bold mb-2">{user.full_name}</h3>
        <p className="text-sm">{user.team_name} Team</p>
      </div>
    </motion.div>
  );


  return (
    <div className="relative min-h-screen bg-gray-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white opacity-10"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              borderRadius: '50%',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -1000],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-32 relative z-10">
        <motion.h1
          className="text-3xl text-center monoton mb-16 text-white lg:text-6xl"
          initial={{opacity: 0, y: -50}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.8}}
        >
          Aeromodelling &nbsp; Club &nbsp; NIT &nbsp;&nbsp;Kurukshetra
        </motion.h1>

        {Object.keys(users.byYear).map(year => (
          <motion.div
            key={year}
            className="mb-20"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 0.8, delay: 0.2}}
          >
            <h2 className="text-4xl font-bold mb-8 text-white border-b-2 border-sky-300 pb-2">
              Batch of {year}-{parseInt(year) + 4}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {users.byYear[year].map(member => (
                <UserCard key={member._id} user={member}/>
              ))}
            </div>
          </motion.div>
        ))}

        {users.alumni.length > 0 && (
          <motion.div
            className="mt-24"
            initial={{opacity: 0, y: 50}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.8}}
          >
            <h2 className="text-5xl font-bold mb-10 text-white">Our Distinguished Alumni</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {users.alumni.map(alumnus => (
                <UserCard key={alumnus._id} user={alumnus}/>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default UserDisplay;
