"use client";
import { useState, useEffect, useRef } from 'react';
import { motion,useScroll,useTransform } from "framer-motion";
import Link from "next/link";
import Brain from './Brain';
import Loader from '@/components/Loader'
import InfiniteCarousel from './InfiniteCarousel';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setEvents(data.events.filter(event => event.is_workshop));
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) {
    return <Loader />;
  }
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <motion.div
      className="h-full"
      initial={{ y: "-200vh" }}
      animate={{ y: "0%" }}
      transition={{ duration: 1 }}
    >
      <div className="h-screen relative">
        <div className="relative w-screen h-screen flex items-center justify-center text-3xl md:text-6xl lg:text-8xl text-center">
          <div className="z-0 mt-20 text-white monoton text-wrap text-center">
            Aeromodelling Club workshops
          </div>
          <div className='absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/4 z-10'>
            <Brain scrollYProgress={scrollYProgress} />
          </div>
        </div>
      </div>
      
      <InfiniteCarousel events={events} />

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
          <Link href="https://www.instagram.com/aeroclub.nitkkr/">
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