'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Html, ScrollControls, useScroll,useProgress, PerspectiveCamera } from '@react-three/drei';
import EyeModel from './EyeModel';
import Model from './Model';
import RcModel from './RcModel';
import DroneModel from './Drone';
import ContactUsPage from './ContactUs';

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div style={{ textAlign: 'center' }}>
        <div style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>
          {progress.toFixed(1)}% loaded
        </div>
        <div className="spinner"></div>
        <style jsx>{`
          .spinner {
            margin: 20px auto;
            width: 40px;
            height: 40px;
            border: 4px solid rgba(255, 255, 255, 0.1);
            border-left-color: #fff;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            z-index : 1000;
          }

          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    </Html>
  );
}

interface AeroModellingClubProps {
  isMobile: boolean;
}

function AeroModellingClub({ isMobile }: AeroModellingClubProps) {
  const subtitleStyle = isMobile
    ? { fontSize: '11px', marginLeft: '9px', lineHeight: '10px' }
    : { fontSize: '24px', marginLeft: '20px' };

  return (
    <Html>
      <div className="monoton aero-heading-text">
        <div>
          <h1>Aero</h1>
        </div>
        <h1>Modelling</h1>
        <div style={{ display: 'flex' }}>
          <h1>Club</h1>
          <h1 className="subtitle" style={subtitleStyle}>
            NIT&nbsp;&nbsp;&nbsp;&nbsp;Kurukshetra
          </h1>
        </div>
      </div>
    </Html>
  );
}

function Dronesection() {
  return (
    <Html>
      <div className="monoton drones-heading-text">
        <h1>Drones</h1>
      </div>
    </Html>
  );
}

function Rcsection() {
  return (
    <Html>
      <div className="monoton planes-heading-text">
        <h1>Planes</h1>
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
    <>
      <div style={{ height: '100vh' }}>

        <Canvas className="h-screen canvas-container" style={{ overflow: 'hidden' }} gl={{ antialias: true }} dpr={[1, 2]}>
          <PerspectiveCamera makeDefault position={[7, 0, 5]} />
          <directionalLight position={[10, 10, 10]} intensity={4} />
          <AeroModellingClub isMobile={isMobile} />
          <Suspense fallback={<Loader />}>
            <ScrollControls damping={0.1} pages={isMobile ? 2 : 8}>
                <Model isMobile={isMobile} />
                <EyeModel isMobile={isMobile} />
                <group>
                  <Environment preset="sunset" />
                  <DroneModel isMobile={isMobile} />
                  <Dronesection />
                </group>
                <group>
                  <RcModel isMobile={isMobile} />
                  <Rcsection />
                </group>
            </ScrollControls>
          </Suspense>
        </Canvas>
      </div>
    </>
  );
}