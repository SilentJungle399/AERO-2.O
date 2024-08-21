'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Html, ScrollControls, PerspectiveCamera } from '@react-three/drei';
import EyeModel from './EyeModel';
import Model from './Model';
import RcModel from './RcModel';
import DroneModel from './Drone';
import Loader from './homePageLoader';
import Image from 'next/image';

interface AeroModellingClubProps {
  isMobile: boolean;
}

function AeroModellingClub({ isMobile }: AeroModellingClubProps) {
  return (
    <Html>
      <div className="monoton absolute z-10 text-blue-500"
        style={{
          top: isMobile ? '35vh' : '30vh',
          left: isMobile ? '10vw' : '10vw',
          fontSize: isMobile ? 'clamp(3rem, 8vw, 8rem)' : 'clamp(3rem, 7vw, 7rem)',
          lineHeight: '1.1'
        }}>
        <div>
          <h1>Aero</h1>
        </div>
        <h1>Modelling</h1>
        <div className="flex items-center">
          <h1>Club</h1>
          <h1 className="subtitle text-red-600 ml-2"
            style={{
              fontSize: isMobile ? 'clamp(0.8rem, 4vw, 4rem)' : 'clamp(1rem, 2vw, 2rem)',
              paddingTop: isMobile ? '0.3rem' : '0.5rem'
            }}>
            NIT&nbsp;&nbsp;&nbsp;&nbsp;Kurukshetra
          </h1>
        </div>
      </div>
    </Html>
  );
}

function DroneSection({ isMobile }: { isMobile: boolean }) {
  return (
    <Html>
      <div className="absolute -z-10 text-orange-600"
        style={{
          top: isMobile ? '100vh' : '150vh',
          left: '5vw',
          fontSize: isMobile ? 'clamp(4rem, 8vw, 8rem)' : 'clamp(2rem, 8vw, 6rem)',
          lineHeight: '1.1',
          animation: 'slideUp 2s ease-out infinite', // Adjust timing and iteration as needed
        }}>
        <h1 className="monoton">Drones</h1>
      </div>
      <div
        className="absolute -z-10 text-center text-white p-4 overflow-auto"
        style={{
          top: isMobile ? '110vh' : '165vh',
          left: '5vw',
          width: '90vw',
          height: '100vh',
          fontSize: '1.875rem', // 30px in rem
          lineHeight: '1.5',
          animation: 'slideDown 2s ease-out infinite', // Adjust timing and iteration as needed
        }}>
        <p className='mt-4 text-2xl text-gray-400 font-mono'>Welcome to the AeroClub!!! Whether you’re a seasoned drone pilot or new to the world of aerovics. Ready to dive deeper to the dreams of roarring into the skies...</p>
        <div className=' m-6'>
          <h1 className='text-4xl text-blue-500 font-serif font-bold'>--Our Ongoing Projects--</h1>
          <div className='flex flex-row justify-evenly flex-wrap p-12 '>
            <div className='bg-white rounded-md shadow-lg p-4 max-w-xs w-full mx-2 mb-4 out'>
              <div className='text-4xl mb-2'>📡</div>
              <h3 className='text-xl font-semibold text-orange-500 mb-2 font-serif'>Interdrone Communication</h3>
              <p className='text-black text-lg font-mono leading-5 text-left pl-2'>Seamless communication between drones ensures effective coordination and data exchange during operations data exchange during operations.</p>
            </div>
            <div className='bg-white rounded-md shadow-lg p-2 max-w-xs w-full'>
              <div className='text-4xl mb-1'>🔍</div>
              <h3 className='text-xl font-semibold text-orange-500 mb-2 font-serif'>Tracing Drone</h3>
              <p className='text-black text-lg font-mono leading-5 text-left pl-5'>Advanced tracing technology to track and monitor drone movements for security and analytics.track and monitor drone movements for security and analytics.</p>
            </div>
            <div className='bg-white rounded-md shadow-lg p-4 max-w-xs w-full mx-2 mb-4'>
              <div className='text-4xl mb-2'>🤖</div>
              <h3 className='text-xl font-semibold text-orange-500 mb-2 font-serif'>AI Drone</h3>
              <p className='text-black text-lg font-mono leading-5 text-left pl-3'>Artificial Intelligence integrated into drones for autonomous navigation and decision-makingnavigation and decision-making.</p>
            </div>
          </div>

        </div>
      </div>
    </Html>


  );
}

function RcSection({ isMobile }: { isMobile: boolean }) {
  return (
    <Html>
      <div className="monoton absolute -z-10 text-orange-600"
        style={{
          top: isMobile ? '210vh' : '250vh',
          left: '5vw',
          fontSize: isMobile ? 'clamp(4rem, 8vw, 8rem)' : 'clamp(2rem, 8vw, 6rem)',
          lineHeight: '1.1'
        }}>
        <h1>Planes</h1>
      </div>
      <div
        className="absolute -z-10 text-center text-white p-4 flex flex-col items-center justify-center"
        style={{
          top: isMobile ? '220vh' : '250vh',
          left: '5vw',
          width: '90vw',
          height: '110vh',
          fontSize: '30px', // Reduced font size to fit text better
          lineHeight: '1.5',
        }}>
        <p className='mt-2 text-2xl font-mono text-gray-400'>Welcome to Aero Modelling Club! ✈️🚀 Whether you're an experienced RC pilot or just discovering the thrill of flying, our club is the perfect place to soar to new heights. We're a vibrant community of enthusiasts passionate about building, flying, and showcasing the incredible world of aero modelling. Dive into our hands-on workshops, participate in thrilling competitions, and connect with fellow hobbyists who share your passion. Ready to take off?</p>
        <div>
          <Image
            src='/Infinity-Loop.gif'
            alt='Loop'
            width={400}
            height={400}
          />
        </div>
      </div>
    </Html>

  );
}

export default function Scene() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    setIsMobile(mediaQuery.matches);

    const handleMediaQueryChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    mediaQuery.addEventListener('change', handleMediaQueryChange);
    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange);
    };
  }, []);

  return (
    <div className="h-screen overflow-hidden hide-scrollbar">
      <Canvas className="h-full w-full overflow-hidden" gl={{ antialias: true }} dpr={[1, 2]}>
        {/* <Suspense fallback={<Loader />}> */}
        <PerspectiveCamera makeDefault position={[0, 0, 0]} />
        <directionalLight position={[10, 10, 10]} intensity={4} />
        <AeroModellingClub isMobile={isMobile} />
        <ScrollControls damping={0.1} pages={isMobile ? 2 : 3}>
          <Suspense fallback={<Loader />}>
            <Model isMobile={isMobile} />
          </Suspense>
          <Suspense fallback={<Loader />}>
            <EyeModel isMobile={isMobile} />
          </Suspense>
          <group>
            <Environment preset="sunset" />
            <Suspense fallback={<Loader />}>
              <DroneModel isMobile={isMobile} />
            </Suspense>
            <DroneSection isMobile={isMobile} />
          </group>
          <group>
            <Suspense fallback={<Loader />}>
              <RcModel isMobile={isMobile} />
            </Suspense>
            <RcSection isMobile={isMobile} />
          </group>
        </ScrollControls>
        {/* </Suspense> */}
      </Canvas>
    </div>
  );
}