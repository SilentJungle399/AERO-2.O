"use client";
import React, { useState } from "react";
import {
  FaUsers,
  FaCheckCircle,
  FaTimesCircle,
  FaUniversity,
  FaCode,
  FaCalendarAlt,
  FaIdCard,
  FaMobile,
  FaEnvelope,
  FaVenusMars,
} from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

const JoinTeam = () => {
  // ... (previous state and function declarations remain the same)
  const [step, setStep] = useState(1);
  const [groupToken, setGroupToken] = useState("");
  const [formData, setFormData] = useState({
    Member_name: "",
    Member_college_name: "",
    Member_branch: "",
    Member_year: "",
    Member_roll_no: "",
    Member_mob_no: "",
    Member_email: "",
    Member_gender: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const validateGroupToken = async () => {
    setIsLoading(true);
    setError("");
    try {
      // Replace this with your actual API call
      const response = await fetch(
        "http://localhost:5000/api/users/checktoken",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Group_token: groupToken }),
        }
      );
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        if (response.status == 200) {
          setStep(2);
        }
        if (response.status == 201) {
          const notify = () => toast("Invalid token !! use a correct token");
          notify();
        }
      } else {
        setError("Invalid group token. Please check and try again.");
      }
    } catch (error) {
      setError("Error validating group token. Please try again.");
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      // Replace this with your actual API call
      const response = await fetch("http://localhost:5000/api/users/jointeam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          Group_token: groupToken,
          uid: localStorage.getItem("_id"),
        }),
      });
      const data = await response.json();
      if (response.ok) {
        const notify = () => toast(data.msg);
        notify();
        // setStep(3); // Success step
      } else {
        setError(data.message || "Error joining team. Please try again.");
      }
    } catch (error) {
      setError("Error joining team. Please try again.");
    }
    setIsLoading(false);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  return (
    <div className="max-w-md mx-auto p-6 rounded-lg shadow-md bg-gradient-to-br from-blue-100 to-purple-100">
      <h2 className="text-3xl font-bold text-center text-indigo-800 mb-6 flex items-center justify-center">
        <FaUsers className="mr-2 text-indigo-600" /> Join a Team
      </h2>
      {step === 1 && (
        <div className="bg-white p-6 rounded-lg shadow-sm animate-fade-in">
          <Toaster
            toastOptions={{
              className: "",
              style: {
                border: "1px solid #713200",
                padding: "16px",
                color: "white",
                background: "red",
                width: "600px",
              },
            }}
          />
          <h3 className="text-xl font-semibold mb-4 text-indigo-700">
            Step 1: Enter Group Token
          </h3>
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
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {isLoading ? "Validating..." : "Validate Token"}
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      )}
      {step === 2 && (
        <div className="bg-white p-6 rounded-lg shadow-sm animate-fade-in">
          <h3 className="text-xl font-semibold mb-4 text-indigo-700">
            Step 2: Complete Your Information
          </h3>
          <form onSubmit={handleSubmit}>
            {[
              { name: "Member_name", placeholder: "Full Name", icon: FaUsers },
              {
                name: "Member_college_name",
                placeholder: "College Name",
                icon: FaUniversity,
              },
              { name: "Member_branch", placeholder: "Branch", icon: FaCode },
              {
                name: "Member_year",
                placeholder: "Year of Study",
                icon: FaCalendarAlt,
              },
              {
                name: "Member_roll_no",
                placeholder: "Roll Number",
                icon: FaIdCard,
              },
              {
                name: "Member_mob_no",
                placeholder: "Mobile Number",
                icon: FaMobile,
              },
              { name: "Member_email", placeholder: "Email", icon: FaEnvelope },
            ].map((field) => (
              <div key={field.name} className="relative mb-4">
                <input
                  type={
                    field.name === "Member_email"
                      ? "email"
                      : field.name === "Member_mob_no"
                      ? "tel"
                      : "text"
                  }
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
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>
              <FaVenusMars className="absolute left-3 top-3 text-indigo-400" />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-md text-white font-semibold transition-colors duration-300 ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {isLoading ? "Joining..." : "Join Team"}
            </button>
          </form>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          <Toaster
            toastOptions={{
              className: "",
              style: {
                border: "1px solid #713200",
                padding: "16px",
                color: "white",
                background: "red",
                width: "40px",
              },
            }}
          />
        </div>
      )}
      {step === 3 && (
        <div className="bg-white p-6 rounded-lg shadow-sm animate-fade-in text-center">
          <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-green-700">
            Successfully Joined the Team!
          </h3>
          <p className="text-gray-600">
            Welcome aboard! You are now part of the team.
          </p>
        </div>
      )}
    </div>
  );
};

export default JoinTeam;
