"use client";
import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import dynamic from 'next/dynamic';
// import FractalTree from '../../components/Fractletree';
import Loader from '@/components/Loader'
const gradients = [
  "from-red-300 to-blue-300",
  "from-blue-300 to-violet-300",
  "from-violet-300 to-purple-300",
  "from-purple-300 to-red-300",
  "from-red-300 to-blue-300",
];

const FractalTree = dynamic(() => import('../../components/Fractletree'), {
  ssr: false
});


const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  const ref = useRef();
  const { scrollYProgress } = useScroll({ target: ref });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-92%"]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const baseUrl = process.env.NODE_ENV === 'production'
          ? process.env.NEXT_PUBLIC_BACKEND_URL
          : 'http://localhost:5000';
        const response = await fetch(`${baseUrl}/api/users/getallevents`);
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        setEvents(data.events);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <Loader />
    );
  }
  // if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <motion.div
      className="h-full"
      initial={{ y: "-200vh" }}
      animate={{ y: "0%" }}
      transition={{ duration: 1 }}
    >
      <div className="h-[900vh] relative" ref={ref}>
        <div className="relative w-screen h-screen flex items-center justify-center text-3xl md:text-6xl lg:text-8xl text-center">
          <div className='absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10'>
            <FractalTree />
          </div>
          <div className="z-0 text-white text-center monoton">
            Aeromodelling Club Events
          </div>
        </div>
        <div className="sticky top-0 flex h-screen gap-4 items-center overflow-hidden">
          <motion.div style={{ x }} className="flex">
            <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-r from-purple-300 to-red-300" />
            {events.filter(event => !event.is_workshop).map((event, index) => (
              <div
                className={`h-screen w-screen flex-shrink-0 flex items-center justify-center bg-gradient-to-r ${gradients[index % gradients.length]}`}
                key={event._id}
              >
                <div className="flex flex-col lg:flex-row gap-8 p-6 md:p-10 lg:p-16 max-w-6xl">
                  <div className="lg:w-1/2 space-y-6">
                    <h1 className="text-3xl md:text-5xl lg:text-6xl bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 text-transparent bg-clip-text font-bold">{event.E_name}</h1>
                    <div className="space-y-4 text-lg md:text-xl">
                      <p><span className="font-bold">Date:</span> {new Date(event.E_date).toLocaleDateString()}</p>
                      <p><span className="font-bold">Time:</span> {event.E_timings}</p>
                      <p><span className="font-bold">Location:</span> {event.E_location}</p>
                      <p><span className="font-bold">Domain:</span> {event.E_domain}</p>
                      <p><span className="font-bold">Team Size:</span> {event.E_team_size}</p>
                    </div>
                    <p className="text-lg md:text-xl">{event.E_mini_description}</p>
                    <div className="flex flex-col sm:flex-row gap-4 mt-6">
                      <Link className='m-1' href={`/events/create-team/${event._id}`} passHref>
                        <motion.a
                          className="flex-1 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-500 transition-colors text-center text-lg"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Create Team
                        </motion.a>
                      </Link>
                      <Link className='m-1' href={`/events/join-team/${event._id}`} passHref>
                        <motion.a
                          className="flex-1 bg-green-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-500 transition-colors text-center text-lg"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Join Team
                        </motion.a>
                      </Link>
                    </div>
                  </div>
                  <div className="lg:w-1/2">
                    <div className="relative w-full h-64 md:h-96 lg:h-[500px]">
                      <img
                        src={event.E_main_img || "/default-event-image.jpg"}
                        alt={event.E_name}
                        className="w-full h-full object-cover rounded-lg shadow-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div
              className={`h-screen w-screen flex-shrink-0 flex items-center justify-center bg-gradient-to-r ${gradients[5 % gradients.length]}`}

            >
              <div className="flex flex-col lg:flex-row gap-8 text-white p-6 md:p-10 lg:p-16 max-w-6xl">
                <div className="lg:w-1/2 space-y-6">
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold">Easteeemed for seeing you in our upcoming events</h1>



                </div>
                <div className="lg:w-1/2">

                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <div className="w-screen h-screen flex flex-col gap-16 items-center justify-center text-center bg-gradient-to-b from-blue-100 to-red-100 p-8">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold">
          Ready to <span className="bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 text-transparent bg-clip-text">take flight</span>?
        </h1>
        <div className="relative w-full h-full flex items-center justify-center">
          <motion.svg
            animate={{ rotate: 360 }}
            transition={{ duration: 8, ease: "linear", repeat: Infinity }}
            viewBox="0 0 300 300"
            className="w-96 h-96 md:w-80 md:h-80 lg:w-96 lg:h-96"
          >
            <defs>
              <path
                id="circlePath"
                d="M 150, 150 m -60, 0 a 60,60 0 0,1 120,0 a 60,60 0 0,1 -120,0 "
              />
            </defs>
            <text fill="#000">
              <textPath xlinkHref="#circlePath" className="text-lg md:text-xl lg:text-2xl">
                Join Aeromodelling Club • Explore • Innovate • Soar
              </textPath>
            </text>
          </motion.svg>
          <Link href="/contact">
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-black text-white rounded-full flex items-center justify-center text-xl font-bold transition-transform duration-300 ease-in-out hover:scale-110"
            >
              Join Us
            </div>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default EventsPage;