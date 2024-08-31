import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const gradients = [
  "from-red-300 to-blue-300",
  "from-blue-300 to-violet-300",
  "from-violet-300 to-purple-300",
  "from-purple-300 to-red-300",
  "from-red-300 to-blue-300",
];

const InfiniteCarousel = ({ events }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [events.length]);

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + events.length) % events.length);
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  };

  return (
    <div className="relative h-screen overflow-hidden">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.5 }}
          className={`absolute inset-0 flex items-center justify-center bg-gradient-to-r ${gradients[currentIndex % gradients.length]}`}
        >
          <div className="flex flex-col lg:flex-row gap-8 text-white p-6 md:p-10 lg:p-16 max-w-6xl">
            <div className="lg:w-1/2 space-y-6">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold">{events[currentIndex].E_name}</h1>
              <div className="space-y-4 text-lg md:text-xl">
                <p><span className="font-bold">Date:</span> {new Date(events[currentIndex].E_date).toLocaleDateString()}</p>
                <p><span className="font-bold">Time:</span> {events[currentIndex].E_timings}</p>
                <p><span className="font-bold">Location:</span> {events[currentIndex].E_location}</p>
                <p><span className="font-bold">Domain:</span> {events[currentIndex].E_domain}</p>
                <p><span className="font-bold">Team Size:</span> {events[currentIndex].E_team_size}</p>
              </div>
              <p className="text-lg md:text-xl">{events[currentIndex].E_mini_description}</p>
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <Link href={`/events/create-team/${events[currentIndex]._id}`} passHref>
                  <motion.a
                    className="flex-1 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-500 transition-colors text-center text-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Create Team
                  </motion.a>
                </Link>
                <Link href={`/events/join-team/${events[currentIndex]._id}`} passHref>
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
                  src={events[currentIndex].E_main_img || "/default-event-image.jpg"}
                  alt={events[currentIndex].E_name}
                  className="w-full h-full object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
      >
        &#8249;
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
      >
        &#8250;
      </button>
    </div>
  );
};

export default InfiniteCarousel;