"use client";
import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Brain from "./Brain";
import Loader from "@/components/Loader";
import { jwtDecode } from "jwt-decode";
import Login from "../login/page";
import { FaTeamspeak, FaUser, FaUserFriends } from "react-icons/fa";
const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const ref = useRef(null);

  const { scrollYProgress } = useScroll({ target: ref });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-92%"]);

  function isTokenExpired(token) {
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return parseInt(decodedToken.exp) < currentTime;
    } catch (error) {
      console.error('Invalid token', error);
      return true;
    }
  }

  function LoginCheck() {
    const token = localStorage.getItem('token');
    const isExpired = isTokenExpired(token);
    if (!token) {
      alert('Please log in to Aeromodelling.');
      window.location.href = '/login';
    } else if (isExpired) {
      alert('Session Expired !!! Please log in Again...');
      console.log('Token is valid');
    }
  }


  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
        const response = await fetch(`${baseUrl}/api/users/getallevents`);
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data = await response.json();
        setEvents(data.events.filter((event) => event.is_workshop));
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) return <Loader />;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <motion.div
      className="min-h-screen bg-gray-900 text-gray-100"
      initial={{ y: "-200vh" }}
      animate={{ y: "0%" }}
      transition={{ duration: 1 }}
    >
      {/* First Section */}
      <div className="h-screen relative overflow-hidden bg-black">
        <div className="absolute inset-0 flex items-center justify-center text-3xl sm:text-4xl md:text-6xl lg:text-8xl text-center">
          <h1 className="z-10 px-4 text-white monoton">
            Aeromodelling Club Workshops
          </h1>
        </div>
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/4 z-10 w-full h-full max-w-2xl pr-16 opacity-80 max-h-96">
          <Brain scrollYProgress={scrollYProgress} />
        </div>
      </div>

      {/* Events Listing Section */}
      <div ref={ref} className="w-full p-4 sm:p-8 bg-gray-800">
        <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center text-blue-300">
          Upcoming Workshops
        </h2>
        <div className="flex flex-col gap-12 mx-auto max-w-7xl">
          {events.map((event, index) => (
            <motion.div
              key={event._id}
              className="bg-black bg-opacity-70 rounded-lg shadow-lg p-6"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex space-x-10">
                <h2 className="text-2xl md:text-4xl font-bold font-mono mb-6 text-white">
                  {event.E_name}
                </h2>
                <Link href={`/events/team-panel/${event._id}`} passHref>
                  <div className="mt-2">
                    <motion.a
                      onClick={LoginCheck}
                      className="flex-1 bg-blue-600 border-2 border-green-500 text-white font-semibold py-2 px-4 w-auto rounded-3xl hover:bg-green-500 transition-colors text-center shadow-md flex items-center justify-center"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      MyTeam <FaUserFriends className="ml-2" />
                    </motion.a>
                  </div>
                </Link>


              </div>
              <div className="md:flex md:space-x-6 space-y-6 md:space-y-0">
                <div className="md:w-1/2">
                  <img
                    src={event.E_main_img || "/default-event-image.jpg"}
                    alt={event.E_name}
                    className="w-full h-auto rounded-lg shadow-md"
                  />
                </div>
                <div className="md:w-1/2 space-y-4 font-mono">
                  <p>
                    <strong className="text-blue-300">Date:</strong>{" "}
                    {new Date(event.E_date).toLocaleDateString()}
                  </p>
                  <p>
                    <strong className="text-blue-300">Time:</strong>{" "}
                    {event.E_timings}
                  </p>
                  <p>
                    <strong className="text-blue-300">Location:</strong>{" "}
                    {event.E_location}
                  </p>
                  <p>
                    <strong className="text-blue-300">Domain:</strong>{" "}
                    {event.E_domain}
                  </p>
                  <p>
                    <strong className="text-blue-300">Team Size:</strong>{" "}
                    {event.E_team_size}
                  </p>
                  <p className="text-gray-300">{event.E_mini_description}</p>
                  <div className="flex flex-wrap justify-between gap-4 mt-8">
                    <Link href={event.active_status ? `/events/create-team/${event._id}` : "https://th.bing.com/th/id/OIP._mYdcpBTqU7VJiRimoP9wwHaEV?rs=1&pid=ImgDetMain"} className="mt-2" passHref>
                      <motion.a
                        onClick={LoginCheck}
                        className={`flex-1 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-center shadow-md ${!event.active_status ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-500"
                          }`}
                      >
                        Create Team
                      </motion.a>
                    </Link>
                    <Link href={event.active_status ? `/events/join-team/${event._id}` : "https://th.bing.com/th/id/OIP._mYdcpBTqU7VJiRimoP9wwHaEV?rs=1&pid=ImgDetMain"} className="mt-2" passHref>
                      <motion.a
                        onClick={LoginCheck}
                        className={`flex-1 bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-center shadow-md ${!event.active_status ? "opacity-50 cursor-not-allowed" : "hover:bg-green-500"
                          }`}
                      >
                        Join Team
                      </motion.a>
                    </Link>

                  </div>
                  {!event.active_status && <h3 className="text-center text-red-500">Registration Closed!!!</h3>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Final Section */}
      <div className="w-full min-h-screen flex flex-col gap-8 sm:gap-16 items-center justify-center text-center bg-gradient-to-b from-gray-800 to-black p-4 sm:p-8">
        <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold px-4 text-white">
          Ready to{" "}
          <span className="bg-gradient-to-r from-blue-400 via-green-300 to-purple-400 text-transparent bg-clip-text">
            take flight
          </span>
          ?
        </h2>
        <div className="relative w-full h-64 sm:h-80 md:h-96 flex items-center justify-center">
          <motion.svg
            animate={{ rotate: 360 }}
            transition={{ duration: 8, ease: "linear", repeat: Infinity }}
            viewBox="0 0 300 300"
            className="w-full h-full max-w-sm sm:max-w-md md:max-w-lg"
          >
            <defs>
              <path
                id="circlePath"
                d="M 150, 150 m -60, 0 a 60,60 0 0,1 120,0 a 60,60 0 0,1 -120,0 "
              />
            </defs>
            <text fill="#fff">
              <textPath
                xlinkHref="#circlePath"
                className="text-sm sm:text-base md:text-lg lg:text-xl"
              >
                Join Aeromodelling Club • Explore • Innovate • Soar
              </textPath>
            </text>
          </motion.svg>
          <Link href="https://www.instagram.com/aeroclub.nitkkr/">
            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 sm:w-32 sm:h-32 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg sm:text-xl font-bold cursor-pointer"
            >
              Join Us
            </motion.div>
          </Link>
        </div>
        <div className="text-gray-300 max-w-2xl">
          <h3 className="text-xl font-semibold mb-2">
            Why Join Aeromodelling Club?
          </h3>
          <ul className="list-disc list-inside text-left">
            <li>Develop practical skills in aeronautics and engineering</li>
            <li>Participate in competitions</li>
            <li>Access to state-of-the-art equipment and facilities</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default EventsPage;