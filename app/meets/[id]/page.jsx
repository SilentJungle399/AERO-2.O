"use client";
import {useEffect, useState} from "react";
import {useParams} from "next/navigation";
import {motion} from "framer-motion";
import {FaCalendar, FaClock, FaLaptop, FaMapMarkerAlt, FaQrcode, FaUsers} from "react-icons/fa";
import Loader from '@/components/Loader';
import Message from "@/components/Message";
import {Html5Qrcode} from 'html5-qrcode';

const MeetDetailPage = () => {
  const id = useParams().id;
  const [meet, setMeet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQrScanner, setShowQrScanner] = useState(false);
  const [qrResult, setQrResult] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [html5QrCode, setHtml5QrCode] = useState(null); // Declare html5QrCode as state

  useEffect(() => {
    const fetchMeetDetails = async () => {
      try {
        const baseUrl = process.env.NODE_ENV === 'production'
          ? ""
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

  useEffect(() => {
    if (showQrScanner) {
      const qrCodeScanner = new Html5Qrcode("reader", true);
      setHtml5QrCode(qrCodeScanner);

      const requestCameraPermission = async () => {
        try {
          // Request camera access
          const stream = await navigator.mediaDevices.getUserMedia({
            video: {facingMode: 'environment'}
          });

          // Set permission and start the QR code scanner
          setHasPermission(true);

          // Assuming qrCodeScanner is properly initialized before this
          qrCodeScanner.start(
            {facingMode: 'environment'}, // Ensures back camera is used
            {
              fps: 1,
              qrbox: {width: 500, height: 500}
            },
            (decodedText) => {
              console.log(decodedText);
              setQrResult(decodedText);
              setShowQrScanner(false);
              handleScan(decodedText);
              // Stop the QR code scanner after successful scan
              if (qrCodeScanner.isRunning) { // Ensure scanner is running before stopping
                qrCodeScanner.stop()
                  .then(() => {

                    console.log("QR Code scanning stopped successfully.");
                  })
                  .catch(err => {
                    console.error("Error stopping QR scanner:", err);
                  });
              }
            },
            (error) => {
              if (error.name === 'NotFoundException') {
                console.log("No QR code found in the scanned frame.");
              } else {
                console.error("QR Code Scan Error: ", error);
              }
            }
          )
            .catch(err => {
              console.error("Error starting QR scanner:", err);
              setHasPermission(false);
              setError(true);
              setMessage('Failed to start QR scanner.');
            });

          // Check which camera is being used
          const track = stream.getVideoTracks()[0];
          console.log("Selected Camera Device:", track.label);

          if (track.label.toLowerCase().includes('back')) {
            console.log("Using back camera.");
          } else {
            console.log("Using front camera or another available camera.");
          }

          // Stop the stream tracks
          stream.getTracks().forEach(track => track.stop());
        } catch (err) {
          console.error('Error requesting camera permission:', err);
          setHasPermission(false);
          setError(true);
          setMessage('Camera permission denied or no camera available. Please allow camera access or connect a camera.');
        }
      };
      requestCameraPermission();

      return () => {
        qrCodeScanner.stop().catch(err => console.error("Error stopping QR scanner:", err));
      };
    }
  }, [showQrScanner]);

  const handleScan = async (decodedText) => {

    const url = new URL(decodedText);
    console.log(url);

    const id = url.pathname.split('/').pop();
    const token = url.searchParams.get('token');

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
        window.location.href = `/meets/${id}`;
      }, 100);
    } catch (error) {
      setMessage('Error marking attendance');
      setError(true);
    }

  };

  const handleError = (err) => {
    console.error("QR Code Scan Error:", err);
  };

  const handleMarkAttendance = () => {
    setShowQrScanner(true);
  };

  if (loading) {
    return <Loader/>;
  }

  if (!meet) {
    return <div className="text-center text-2xl mt-10 text-white">Meet not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8">
      <motion.div
        className="max-w-4xl mx-auto bg-gray-800 mt-24 rounded-xl shadow-2xl overflow-hidden"
        initial={{opacity: 0, y: 50}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.5}}
      >
        <div className="p-8">
          <h1
            className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r text-blue-400">{meet.meet_team_type} Meet</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <FaCalendar className="text-green-500 mr-3"/>
                <p><span className="font-semibold">Date:</span> {new Date(meet.meet_date).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center mb-4">
                <FaClock className="text-green-500 mr-3"/>
                <p><span className="font-semibold">Time:</span> {meet.meet_time}</p>
              </div>
              <div className="flex items-center mb-4">
                <FaMapMarkerAlt className="text-green-500 mr-3"/>
                <p><span className="font-semibold">Venue:</span> {meet.meet_venue}</p>
              </div>
              <div className="flex items-center mb-4">
                <FaLaptop className="text-green-500 mr-3"/>
                <p><span className="font-semibold">Mode:</span> {meet.meet_mode}</p>
              </div>
              <p className="mb-4"><span className="font-semibold">Status:</span>
                <span
                  className={`ml-2 px-2 py-1 rounded-full text-xs ${meet.meet_active_status ? 'bg-green-500' : 'bg-red-500'}`}>
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
              <FaUsers className="text-green-500 mr-3"/>
              <p><span className="font-semibold">Total Participants:</span> {meet.participants_ids.length}</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full w-full border-blue-900 border-2 border-collapse">
                <thead>
                <tr className="bg-gray-700">
                  <th className="border border-blue-900 p-2 sm:p-4">#</th>
                  <th className="border border-blue-900 p-2 sm:p-4">Roll No</th>
                  <th className="border border-blue-900 p-2 sm:p-4">Name</th>
                  <th className="border border-blue-900 p-2 sm:p-4">Email</th>
                </tr>
                </thead>
                <tbody>
                {meet.participants_ids.map((participant, index) => (
                  <tr key={participant._id}>
                    <td className="border border-blue-900 p-2 sm:p-4">{index + 1}</td>
                    <td className="border border-blue-900 p-2 sm:p-4">{participant.roll_no}</td>
                    <td className="border border-blue-900 p-2 sm:p-4">{participant.full_name}</td>
                    <td className="border border-blue-900 p-2 sm:p-4">{participant.email}</td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
          </div>

          <button
            onClick={handleMarkAttendance}
            disabled={!meet.meet_active_status} // Disable button if the meet is inactive
            className={`mt-8 px-4 py-2 rounded-md transition 
    ${meet.meet_active_status ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-400 text-gray-700 cursor-not-allowed'}`}
          >
            <FaQrcode className="inline mr-2"/>
            Mark Attendance
          </button>


          {showQrScanner && (
            <div id="reader" className="mt-8 w-full h-96 bg-gray-700"></div>
          )}

          {error && <Message type="error" message={message}/>}
          {success && <Message type="success" message={message}/>}
        </div>
      </motion.div>
    </div>
  );
};

export default MeetDetailPage;
