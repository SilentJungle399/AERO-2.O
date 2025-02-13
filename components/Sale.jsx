'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const SaleNotification = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 150000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed top-16 right-4 z-50">
          <motion.div
            className="relative flex items-center justify-center cursor-pointer"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
            <Link href="/techevents">
              <motion.div
                className="w-[200px] h-[200px] rounded-full flex items-center justify-center overflow-hidden"
              >
                <div 
                  className="w-[180px] h-[180px] rounded-full flex items-center justify-center"
                  style={{
                    backgroundImage: "url('/R.png')",
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }}
                >
                  <motion.div 
                    className="text-center font-sans -rotate-12"
                    animate={{ color: ["#ff0000", "#0000ff"] }} 
                    transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                  >
                    <p className="text-2xl font-extrabold" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>Techspardha</p>
                    <p className="text-xl font-bold" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>is LIVE!</p>
                  </motion.div>
                </div>
              </motion.div>
            </Link>
            {/* Close button */}
            <motion.button
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-700 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center"
              onClick={handleClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              X
            </motion.button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SaleNotification;
