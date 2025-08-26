"use client";
import {useEffect, useState} from "react";
import {motion} from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import Loader from "@/components/Loader";

const FractalTree = dynamic(() => import("../../components/Fractletree"), {
  ssr: false,
});

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const baseUrl =
          process.env.NODE_ENV === "production"
            ? ""
            : "http://localhost:5000";
        const response = await fetch(`${baseUrl}/api/users/getallevents`);
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data = await response.json();
        setEvents(data.events.filter((event) => !event.is_workshop));
        setLoading(false);
      } catch (error) {
        console.error(error.message);
        setLoading(false);
      }
    };
    fetchEvents();

    // Add smooth scrolling behavior
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  if (loading) {
    return <Loader/>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-blue-300 text-white">
      <header className="relative h-screen mt-20 flex items-center justify-center">
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <FractalTree/>
        </div>
        <h1 className="text-4xl md:text-6xl text-white text-center z-20 monoton px-4">
          AEROMODELLING&nbsp;&nbsp; CLUB&nbsp;&nbsp; EVENTS
        </h1>
      </header>

      <main className="mr-2 ml-2 mx-auto py-8 space-y-12">
        {events.map((event, index) => (
          <motion.div
            key={event._id}
            className="bg-black bg-opacity-70 rounded-lg shadow-lg p-6"
            initial={{opacity: 0, y: 50}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5, delay: index * 0.1}}
          >
            <h2 className="text-2xl md:text-4xl font-bold font-mono mb-6 text-white">
              {event.E_name}
            </h2>
            <div className="md:flex md:space-x-6 space-y-6 md:space-y-0">
              <div className="md:w-1/2">
                <img
                  src={event.E_main_img || "/default-event-image.jpg"}
                  alt={event.E_name}
                  className="w-full h-64 object-cover rounded-lg shadow-md"
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
                <div className="flex flex-wrap justify-between">
                  <Link
                    href={`/events/create-team/${event._id}`}
                    passHref
                    className="mt-8"
                  >
                    <motion.a
                      className="flex-1 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-500 transition-colors text-center shadow-md"
                      whileHover={{scale: 1.05}}
                      whileTap={{scale: 0.95}}
                    >
                      {event.E_team_size == 1 ? "Participate" : "Create Team"}
                    </motion.a>
                  </Link>
                  {event.E_team_size != 1 ? "" : <Link
                    href={`/events/lederboard/${event._id}`}
                    passHref
                    className="mt-8"
                  >
                    <motion.a
                      className="flex-1 bg-red-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-500 transition-colors text-center shadow-md"
                      whileHover={{scale: 1.05}}
                      whileTap={{scale: 0.95}}
                    >
                      Leaderboard
                    </motion.a>
                  </Link>}
                  <Link
                    href={`/events/join-team/${event._id}`}
                    passHref
                    className="mt-8"
                  >
                    {event.E_team_size == 1 ? "" : <motion.a
                      className="flex-1 bg-green-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-500 transition-colors text-center shadow-md"
                      whileHover={{scale: 1.05}}
                      whileTap={{scale: 0.95}}
                    >
                      Join Team
                    </motion.a>}
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </main>

      <footer
        className="w-full min-h-screen flex flex-col items-center justify-center text-center bg-gradient-to-b from-blue-900 to-black p-8">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-12">
          Ready to{" "}
          <span className="bg-gradient-to-r from-blue-400 via-green-300 to-indigo-400 text-transparent bg-clip-text">
            take flight
          </span>
          ?
        </h2>
        <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 flex items-center justify-center">
          <motion.svg
            animate={{rotate: 360}}
            transition={{duration: 20, ease: "linear", repeat: Infinity}}
            viewBox="0 0 300 300"
            className="w-full h-full"
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
                className="text-sm md:text-base lg:text-lg"
              >
                Join Aeromodelling Club • Explore • Innovate • Soar
              </textPath>
            </text>
          </motion.svg>
          <Link href="https://www.instagram.com/aeroclub.nitkkr/">
            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold shadow-lg"
              // whileHover={{ scale: 1.1 }}
              // whileTap={{ scale: 0.95 }}
            >
              Join Us
            </motion.div>
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default EventsPage;
