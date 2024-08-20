"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { FaCalendar, FaClock, FaMapMarkerAlt, FaLaptop, FaUsers, FaQrcode, FaCamera } from "react-icons/fa";
import QrReader from "react-qr-scanner";
import Loader from '@/components/Loader';
import Message from "@/components/Message";

const MeetDetailPage = () => {
  const id = useParams().id;
  const [meet, setMeet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQrScanner, setShowQrScanner] = useState(false);
  const [qrResult, setQrResult] = useState(null);
  const [cameraFacingMode, setCameraFacingMode] = useState('environment'); // Default to back camera

  const [Error, setError] = useState(false);
  const [Success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchMeetDetails = async () => {
      try {
        const baseUrl = process.env.NODE_ENV === 'production'
          ? process.env.NEXT_PUBLIC_BACKEND_URL
          : 'http://localhost:5000';
        const response = await fetch(`${baseUrl}/api/users/getmeets/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch meet details");
        }
        const data = await response.json();
        setMeet(data);
      } catch (error) {
        console.error("Error fetching meet details:", error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMeetDetails();
    }
  }, [id]);

  const handleScan = async (data) => {
    if (data) {
      setQrResult(data);
      setShowQrScanner(false);

      // Extract URL from the data object
      const url = new URL(data.text);
      console.log("URL:", url);

      // Extract ID and token from the URL
      const id = url.pathname.split('/').pop();
      const token = url.searchParams.get('token');

      // Retrieve UID from local storage
      const uid = localStorage.getItem('_id');

      if (!uid) {
        setMessage('Please Login to mark your attendance!!!');
        setError(true);
        return;
      }

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uid: uid,
            token: token,
          }),
        });
        const result = await response.json();
        if (response.ok) {
          setSuccess(true);
          setMessage(result.message);
        } else {
          setError(true);
          setMessage(result.message);
        }
        setTimeout(() => {
          window.location.href = "/";
        }, 100);
      } catch (error) {
        setMessage('Error marking attendance');
        setError(true);
      }
    }
  };

  const handleError = (err) => {
    console.error("QR Code Scan Error:", err);
  };

  const handleMarkAttendance = () => {
    setShowQrScanner(true);
  };

  const toggleCamera = () => {
    setCameraFacingMode(prevMode => prevMode === 'environment' ? 'user' : 'environment');
  };

  if (loading) {
    return <Loader />;
  }

  if (!meet) {
    return <div className="text-center text-2xl mt-10 text-white">Meet not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8">
      <motion.div
        className="max-w-4xl mx-auto bg-gray-800 mt-24 rounded-xl shadow-2xl overflow-hidden"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r text-blue-400">{meet.meet_team_type} Meet</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <FaCalendar className="text-green-500 mr-3" />
                <p><span className="font-semibold">Date:</span> {new Date(meet.meet_date).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center mb-4">
                <FaClock className="text-green-500 mr-3" />
                <p><span className="font-semibold">Time:</span> {meet.meet_time}</p>
              </div>
              <div className="flex items-center mb-4">
                <FaMapMarkerAlt className="text-green-500 mr-3" />
                <p><span className="font-semibold">Venue:</span> {meet.meet_venue}</p>
              </div>
              <div className="flex items-center mb-4">
                <FaLaptop className="text-green-500 mr-3" />
                <p><span className="font-semibold">Mode:</span> {meet.meet_mode}</p>
              </div>
              <p className="mb-4"><span className="font-semibold">Status:</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${meet.meet_active_status ? 'bg-green-500' : 'bg-red-500'}`}>
                  {meet.meet_active_status ? 'Active' : 'Inactive'}
                </span>
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-blue-300">Description</h2>
              <p className="mb-6">{meet.meet_description}</p>

              <h2 className="text-2xl font-semibold mb-4 text-blue-300">Essentials</h2>
              <ul className="list-disc list-inside mb-6">
                {meet.meet_essentials.map((item, index) => (
                  <li key={index} className="mb-2">{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-300">Participants</h2>
            <div className="flex items-center mb-4">
              <FaUsers className="text-green-500 mr-3" />
              <p><span className="font-semibold">Total Participants:</span> {meet.participants_ids.length}</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full w-full border-blue-900 border-2 border-collapse">
                <thead>
                  <tr className="bg-gray-700">
                    <th className="border border-blue-900 p-2 sm:p-4">Sr.</th>
                    <th className="border border-blue-900 p-2 sm:p-4">Roll No.</th>
                    <th className="border border-blue-900 p-2 sm:p-4">Name</th>
                  </tr>
                </thead>
                <tbody>
                  {meet.participants_ids.slice(0, 6).map((participant, idx) => (
                    <tr key={participant._id} className="bg-slate-600">
                      <td className="border border-blue-900 p-2 sm:p-4">{idx + 1}</td>
                      <td className="border border-blue-900 p-2 sm:p-4">{participant.roll_no}</td>
                      <td className="border border-blue-900 p-2 sm:p-4">{participant.full_name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {meet.participants_ids.length > 6 && (
              <p className="mt-4 text-blue-400 cursor-pointer hover:underline">
                View all participants
              </p>
            )}
          </div>

          <div className="mt-8">
            <button
              disabled={!meet.meet_active_status}
              onClick={handleMarkAttendance}
              className={`flex items-center justify-center w-full text-white py-3 px-6 rounded-lg font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition duration-300 transform hover:scale-105 ${meet.meet_active_status ? " bg-green-500" : "cursor-not-allowed bg-green-300"}`}
            >
              <FaQrcode className="mr-3" />
              Mark Attendance
            </button>
            {(Error || Success) && <Message error={Error} success={Success} message={message} />}
          </div>
        </div>
      </motion.div>

      {showQrScanner && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-4 rounded-lg relative">
            <h2 className="text-xl font-semibold mb-4 text-white">Scan QR Code</h2>
            <QrReader
              delay={300}
              onError={handleError}
              onScan={handleScan}
              facingMode={cameraFacingMode}
              style={{ width: "100%" }}
            />
            <button
              onClick={toggleCamera}
              className="absolute top-4 right-4 bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold flex items-center"
            >
              <FaCamera className="mr-2" />
              Switch Camera
            </button>
            <button
              onClick={() => setShowQrScanner(false)}
              className="mt-4 w-full bg-red-500 text-white py-2 px-4 rounded-lg font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetDetailPage;
