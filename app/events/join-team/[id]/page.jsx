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
    payment_screenshot: null, // Hold the image file here
  });
  const [isLoading, setIsLoading] = useState(false);
  const [paymentPreview, setPaymentPreview] = useState("");
  const [error, setError] = useState("");

  const validateGroupToken = async () => {
    setIsLoading(true);
    setError("");
    try {
      const baseUrl =
        process.env.NODE_ENV === "production"
          ? process.env.NEXT_PUBLIC_BACKEND_URL
          : "http://localhost:5000";
      const response = await fetch(`${baseUrl}/api/users/checktoken`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Group_token: groupToken }),
      });
      const data = await response.json();
      if (response.ok) {
        if (response.status === 200) {
          setStep(2);
        } else if (response.status === 201) {
          toast("Invalid token! Use a correct token");
        }
      } else {
        setError("Invalid group token. Please check and try again.");
      }
    } catch (error) {
      setError("Error validating group token. Please try again.");
    }
    setIsLoading(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setFormData((prevData) => ({
        ...prevData,
        payment_screenshot: file, // Store the image file
      }));
      handlePreviewFileInputChange(file);
    }
    else{
      setPaymentPreview("")
    }
  };

  const handlePreviewFileInputChange = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setPaymentPreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (!formData.payment_screenshot) {
        setError("Please upload the payment screenshot");
        setIsLoading(false);
        return;
      }

      // Create a FormData object to handle file upload
      const data = new FormData();
      data.append("Member_name", formData.Member_name);
      data.append("Member_college_name", formData.Member_college_name);
      data.append("Member_branch", formData.Member_branch);
      data.append("Member_year", formData.Member_year);
      data.append("Member_roll_no", formData.Member_roll_no);
      data.append("Member_mob_no", formData.Member_mob_no);
      data.append("Member_email", formData.Member_email);
      data.append("Member_gender", formData.Member_gender);
      data.append("Group_token", groupToken);
      data.append("uid", localStorage.getItem("_id"));

      // Append the image file to the FormData object
      data.append("payment_screenshot", formData.payment_screenshot);

      const baseUrl =
        process.env.NODE_ENV === "production"
          ? process.env.NEXT_PUBLIC_BACKEND_URL
          : "http://localhost:5000";

      const response = await fetch(`${baseUrl}/api/users/jointeam`, {
        method: "POST",
        body: data, // Pass the FormData object directly
      });

      const responseData = await response.json();

      if (response.ok) {
        toast.success(responseData.msg);
        setStep(3); // Move to success step
      } else {
        setError(responseData.message || "Error joining team. Please try again.");
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
    <div className="max-w-lg mx-auto mt-52 mb-20 p-6 rounded-lg shadow-md bg-black">
      <h2 className="text-3xl font-bold text-center text-blue-400 mb-6 flex items-center justify-center">
        <FaUsers className="mr-2 text-blue-500" /> Join a Team
      </h2>
      {step === 1 && (
        <div className="bg-gray-900 p-6 rounded-lg shadow-sm animate-fade-in">
          <Toaster
            toastOptions={{
              className: "",
              style: {
                border: "1px solid #1e3a8a",
                padding: "16px",
                color: "white",
                background: "#1e40af",
                width: "600px",
              },
            }}
          />
          <h3 className="text-xl font-semibold mb-4 text-blue-400">
            Enter Group Token
          </h3>
          <div className="relative">
            <input
              type="text"
              value={groupToken}
              onChange={(e) => setGroupToken(e.target.value)}
              placeholder="Enter group token"
              className="w-full px-4 py-3 mb-4 border-2 border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-800 text-blue-100 placeholder-blue-300"
            />
            <FaIdCard className="absolute right-3 top-3 text-blue-400" />
          </div>
          <button
            onClick={validateGroupToken}
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-md text-white font-semibold transition-colors duration-300 ${
              isLoading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoading ? "Validating..." : "Validate Token"}
          </button>
          {error && <p className="text-red-400 mt-2">{error}</p>}
        </div>
      )}
      {step === 2 && (
        <div className="bg-gray-900 p-6 rounded-lg shadow-sm animate-fade-in">
          <h3 className="text-xl font-semibold mb-4 text-blue-400">
            Complete Your Information
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
                placeholder: "Year of Study 1st/2nd/3rd/4th",
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
                  className="w-full px-4 py-3 pl-10 border-2 border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-800 text-blue-100 placeholder-blue-300"
                  required
                />
                <field.icon className="absolute left-3 top-3 text-blue-400" />
              </div>
            ))}
            <div className="relative mb-4">
              <select
                name="Member_gender"
                value={formData.Member_gender}
                onChange={handleInputChange}
                className="w-full px-4 py-3 pl-10 border-2 border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-800 text-blue-100 appearance-none"
                required
              >
                <option value="">Select Gender</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="O">Other</option>
              </select>
              <FaVenusMars className="absolute left-3 top-3 text-blue-400" />
            </div>

            {/* Upload payment screenshot */}
            <div className="relative mb-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-3 border-2 border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-800 text-blue-100 placeholder-blue-300"
              />
              <FaTimesCircle className="absolute right-3 top-3 text-blue-400" />
              <div className="flex justify-between p-2">
              {paymentPreview && (
                <img
                  src={paymentPreview}
                  alt="Payment Screenshot Preview"
                  className="mt-2 w-36 h-36"
                />
              )}
              <img
                  src="/payment_qr.jpg"
                  alt="Payment QR"
                  className="mt-2 w-36 h-36"
                />
              </div>
              
            </div>
            
            {error && <p className="text-red-400 mb-4">{error}</p>}
            
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 my-2 px-4 rounded-md text-white font-semibold transition-colors duration-300 ${
                isLoading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isLoading ? "Submitting..." : "Submit Information"}
            </button>
          </form>
        </div>
      )}
      {step === 3 && (
        <div className="bg-gray-900 p-6 rounded-lg shadow-sm animate-fade-in text-center">
          <h3 className="text-xl font-semibold mb-4 text-green-400">
            <FaCheckCircle className="inline-block mr-2" />
            Success!
          </h3>
          <p className="text-blue-100 mb-2">You have successfully joined the team and check your mail for further Details <strong className="text-red-500">Check Spam</strong>.</p>
          <a className="text-white bg-green-500 p-2 m-3 rounded-lg" href="https://chat.whatsapp.com/DeF1JHnE4dkFWEgPeWkZWJ">Join Our WhatsApp Group</a>
        </div>
      )}
    </div>
  );
};

export default JoinTeam;
