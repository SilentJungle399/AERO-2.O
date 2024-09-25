"use client";
import { useState } from "react";
import { useRouter } from "next/router";
import { useParams } from "next/navigation";
import { FaUsers, FaIdCard } from "react-icons/fa";
import { Toaster } from "react-hot-toast";

const GroupTokenVerification = () => {
  const [groupToken, setGroupToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { eventId } = useParams();

  const handleTokenSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const baseUrl =
        process.env.NODE_ENV === "production"
          ? process.env.NEXT_PUBLIC_BACKEND_URL
          : "http://localhost:5000";

      const response = await fetch(`${baseUrl}/api/users/teamdashboard`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Group_token: groupToken }),
      });

      if (response.ok) {
        setLoading(false);
        window.location.href = `/events/team-panel/${eventId}/${groupToken}/dashboard`;
      } else {
        throw new Error("Invalid Group Token or team not found");
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="max-w-lg mx-auto mt-52 mb-20 p-6 rounded-lg shadow-md bg-black">
        <h2 className="text-3xl font-bold text-center text-blue-400 mb-6 flex items-center justify-center">
          <FaUsers className="mr-2 text-blue-500" /> Join a Team
        </h2>
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
              required
            />
            <FaIdCard className="absolute right-3 top-3 text-blue-400" />
          </div>
          <button
            onClick={handleTokenSubmit}
            disabled={loading}
            className={`w-full py-3 px-4 rounded-md text-white font-semibold transition-colors duration-300 ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Validating..." : "Validate Token"}
          </button>
          {error && <p className="text-red-400 mt-2">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default GroupTokenVerification;
