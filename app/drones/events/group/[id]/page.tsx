"use client"
import React, { useState } from 'react';
import { FaUsers, FaCheckCircle, FaTimesCircle, FaUniversity, FaCode, FaCalendarAlt, FaIdCard, FaMobile, FaEnvelope, FaVenusMars } from 'react-icons/fa';

const JoinTeam = () => {
  // ... (previous state and function declarations remain the same)

  return (
    <div className="max-w-md mx-auto p-6 rounded-lg shadow-md bg-gradient-to-br from-blue-100 to-purple-100">
      <h2 className="text-3xl font-bold text-center text-indigo-800 mb-6 flex items-center justify-center">
        <FaUsers className="mr-2 text-indigo-600" /> Join a Team
      </h2>
      {step === 1 && (
        <div className="bg-white p-6 rounded-lg shadow-sm animate-fade-in">
          <h3 className="text-xl font-semibold mb-4 text-indigo-700">Step 1: Enter Group Token</h3>
          <div className="relative">
            <input
              type="text"
              value={groupToken}
              onChange={(e) => setGroupToken(e.target.value)}
              placeholder="Enter group token"
              className="w-full px-4 py-3 mb-4 border-2 border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-indigo-50 text-indigo-800 placeholder-indigo-400"
            />
            <FaIdCard className="absolute right-3 top-3 text-indigo-400" />
          </div>
          <button
            onClick={validateGroupToken}
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-md text-white font-semibold transition-colors duration-300 ${
              isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {isLoading ? 'Validating...' : 'Validate Token'}
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      )}
      {step === 2 && (
        <div className="bg-white p-6 rounded-lg shadow-sm animate-fade-in">
          <h3 className="text-xl font-semibold mb-4 text-indigo-700">Step 2: Complete Your Information</h3>
          <form onSubmit={handleSubmit}>
            {[
              { name: "Member_name", placeholder: "Full Name", icon: FaUsers },
              { name: "Member_college_name", placeholder: "College Name", icon: FaUniversity },
              { name: "Member_branch", placeholder: "Branch", icon: FaCode },
              { name: "Member_year", placeholder: "Year of Study", icon: FaCalendarAlt },
              { name: "Member_roll_no", placeholder: "Roll Number", icon: FaIdCard },
              { name: "Member_mob_no", placeholder: "Mobile Number", icon: FaMobile },
              { name: "Member_email", placeholder: "Email", icon: FaEnvelope },
            ].map((field) => (
              <div key={field.name} className="relative mb-4">
                <input
                  type={field.name === "Member_email" ? "email" : field.name === "Member_mob_no" ? "tel" : "text"}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleInputChange}
                  placeholder={field.placeholder}
                  className="w-full px-4 py-3 pl-10 border-2 border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-indigo-50 text-indigo-800 placeholder-indigo-400"
                  required
                />
                <field.icon className="absolute left-3 top-3 text-indigo-400" />
              </div>
            ))}
            <div className="relative mb-4">
              <select
                name="Member_gender"
                value={formData.Member_gender}
                onChange={handleInputChange}
                className="w-full px-4 py-3 pl-10 border-2 border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-indigo-50 text-indigo-800 appearance-none"
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <FaVenusMars className="absolute left-3 top-3 text-indigo-400" />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-md text-white font-semibold transition-colors duration-300 ${
                isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              {isLoading ? 'Joining...' : 'Join Team'}
            </button>
          </form>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      )}
      {step === 3 && (
        <div className="bg-white p-6 rounded-lg shadow-sm animate-fade-in text-center">
          <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-green-700">Successfully Joined the Team!</h3>
          <p className="text-gray-600">Welcome aboard! You are now part of the team.</p>
        </div>
      )}
    </div>
  );
};

export default JoinTeam;