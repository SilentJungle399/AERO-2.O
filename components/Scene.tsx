'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Html, ScrollControls, PerspectiveCamera } from '@react-three/drei';
import EyeModel from './EyeModel';
import Model from './Model';
import RcModel from './RcModel';
import DroneModel from './Drone';
import Image from 'next/image';
import LoadingBar from './slimloader'

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
          fontSize: isMobile ? '1.6rem' : '1.875rem', // 30px in rem
          lineHeight: '1.5',
          animation: 'slideDown 2s ease-out infinite', // Adjust timing and iteration as needed
        }}>
        <p className='mt-4 font-mono text-gray-400'>Welcome to the Drone Enthusiasts Club! 🚁 Whether you’re a seasoned drone pilot or new to the world of aerial technology. Ready to take your flying skills to new heights?</p>
        <style jsx>{`
  @keyframes slideCards {
    0% { transform: translateX(0); }
    33.33% { transform: translateX(-100%); }
    66.66% { transform: translateX(-200%); }
    100% { transform: translateX(0); }
  }

  .mobile-slider {
    display: flex;
    animation: slideCards 15s infinite linear;
  }

  .mobile-slider:hover {
    animation-play-state: paused;
  }

  .card {
    flex: 0 0 100%;
  }
`}</style>
        <div className='m-6'>
          <h1 className='text-2xl text-blue-500 font-bold lg:text-4xl'>--Our Ongoing Projects--</h1>
          <div className={`${isMobile ? "overflow-hidden mt-4" : "flex flex-row justify-evenly p-12 flex-wrap"}`}>
            <div className={`${isMobile ? "mobile-slider" : "flex flex-row justify-between w-full"}`}>
              <div className={`bg-white rounded-md p-4 max-w-xs w-full card ${isMobile ? "mx-2" : ""}`}>
                <div className='text-4xl mb-2'>📡</div>
                <h3 className='text-xl font-semibold text-orange-500 mb-2'>InterDrone Communication</h3>
                <p className='text-black text-lg leading-5 font-mono text-center'>Seamless communication between drones ensures effective coordination and data exchange during operations.</p>
              </div>
              <div className={`bg-white rounded-md p-2 max-w-xs w-full card ${isMobile ? "mx-2" : ""}`}>
                <div className='text-4xl mb-1'>🔍</div>
                <h3 className='text-xl font-semibold text-orange-500 mb-2'>Tracing Drone</h3>
                <p className='text-black text-lg leading-5 font-mono text-center'>Advanced tracing technology to track and monitor drone movements for security and analytics.</p>
              </div>
              <div className={`bg-white rounded-md p-4 max-w-xs w-full card ${isMobile ? "mx-2" : ""}`}>
                <div className='text-4xl mb-2'>🤖</div>
                <h3 className='text-xl font-semibold text-orange-500 mb-2'>AI Drone</h3>
                <p className='text-black text-lg leading-5 font-mono text-center'>Artificial Intelligence integrated into drones for autonomous navigation and decision-making.</p>
              </div>
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
          top: isMobile ? '212vh' : '250vh',
          left: '5vw',
          fontSize: isMobile ? 'clamp(4rem, 8vw, 8rem)' : 'clamp(2rem, 8vw, 6rem)',
          lineHeight: '1.1'
        }}>
        <h1>Planes</h1>
      </div>
      <div
        className="absolute -z-10 text-center text-white p-4 flex flex-col items-center justify-center"
        style={{
          top: isMobile ? '203vh' : '250vh',
          left: '5vw',
          width: '90vw',
          height: '120vh',
          fontSize: isMobile ? '1.6rem' : '1.875rem',
          lineHeight: '1.1',
        }}>
        <p className='font-mono text-gray-400'>Join a passionate community where you can build, fly, and showcase incredible models. Dive into workshops, compete in events, and connect with fellow enthusiasts. Ready to take off?</p>
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
        <PerspectiveCamera makeDefault position={[0, 0, 0]} />
        <directionalLight position={[10, 10, 10]} intensity={4} />
        <AeroModellingClub isMobile={isMobile} />
        <ScrollControls damping={0.1} pages={isMobile ? 2 : 3}>
          <Suspense fallback={<LoadingBar />}>
            <Model isMobile={isMobile} />
          </Suspense>
          <Suspense fallback={<LoadingBar />}>
            <EyeModel isMobile={isMobile} />
          </Suspense>
          <group>
            <Environment preset="sunset" />
            <Suspense fallback={<LoadingBar />}>
              <DroneModel isMobile={isMobile} />
            </Suspense>
            <DroneSection isMobile={isMobile} />
          </group>
          <group>
            <Suspense fallback={<LoadingBar />}>
              <RcModel isMobile={isMobile} />
            </Suspense>
            <RcSection isMobile={isMobile} />
          </group>
        </ScrollControls>
      </Canvas>
    </div>
  );
}