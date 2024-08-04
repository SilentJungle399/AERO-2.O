"use client";
import React, { useState, useEffect } from 'react';

const UserDisplay = () => {
  const [users, setUsers] = useState({ byYear: {}, alumni: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const baseUrl = process.env.NODE_ENV === 'production' 
          ? process.env.NEXT_PUBLIC_BACKEND_URL 
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

        setUsers({ byYear, alumni });
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch users');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div className="text-center text-2xl mt-8 text-white">Loading amazing people...</div>;
  if (error) return <div className="text-center mt-24 text-red-500 text-2xl">{error}</div>;

  const UserCard = ({ user }) => (
    <div className="bg-gray-800 text-white shadow-xl rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105">
      <div className="px-6 py-8">
        <div className="flex items-center mb-4">
          <img
            className="h-24 w-24 rounded-full object-cover border-4 border-indigo-700"
            src={user.profile_pic || 'https://via.placeholder.com/150'}
            alt={user.full_name}
          />
          <div className="ml-6">
            <h3 className="text-xl font-bold">{user.full_name}</h3>
            <p className="text-sm text-indigo-400">{user.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <InfoItem label="Roll No" value={user.roll_no} />
          <InfoItem label="Session" value={user.session} />
          <InfoItem label="Branch" value={user.branch} />
          <InfoItem label="Team" value={user.team_name} />
          {user.company_name && (
            <>
              <InfoItem label="Company" value={user.company_name} />
              <InfoItem label="Current Post" value={user.current_post} />
            </>
          )}
        </div>
      </div>
    </div>
  );

  const InfoItem = ({ label, value }) => (
    <div>
      <p className="font-medium text-gray-400">{label}</p>
      <p className="text-gray-300">{value || 'N/A'}</p>
    </div>
  );

  const sortedYears = Object.keys(users.byYear).sort((a, b) => a - b);

  return (
    <div className="container mx-auto mt-12 px-4 py-8 bg-black min-h-screen">
      <h1 className="text-5xl font-bold text-center mb-16 text-white">Our Amazing Club Members</h1>

      {sortedYears.map(year => (
        <div key={year} className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-white border-b-2 border-gray-700 pb-2">
            Class of {year}-{parseInt(year) + 4}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {users.byYear[year].map(member => (
              <UserCard key={member._id} user={member} />
            ))}
          </div>
        </div>
      ))}

      {users.alumni.length > 0 && (
        <div className="mt-24 bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl p-10 shadow-2xl">
          <h2 className="text-4xl font-bold mb-10 text-white">Our Distinguished Alumni</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {users.alumni.map(alumnus => (
              <UserCard key={alumnus._id} user={alumnus} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDisplay;
