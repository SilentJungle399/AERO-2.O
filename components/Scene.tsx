'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Html, ScrollControls, PerspectiveCamera } from '@react-three/drei';
import EyeModel from './EyeModel';
import Model from './Model';
import RcModel from './RcModel';
import DroneModel from './Drone';
import Loader from './homePageLoader';

interface AeroModellingClubProps {
  isMobile: boolean;
}

function AeroModellingClub({ isMobile }: AeroModellingClubProps) {
  return (
    <Html>
      <div className={`monoton absolute z-10 text-blue-500
        xs:top-[-90px] xs:left-[1200px] xs:text-[60px] xs:leading-[60px]
        sm:top-[-104px] sm:left-[320px] sm:text-[37px] sm:leading-[45px]
        md:top-[-150px] md:left-[400px] md:text-[80px] md:leading-[90px]
        lg:top-[-210px] lg:left-[500px] lg:text-[140px] lg:leading-[150px]`}>
        <div>
          <h1>Aero</h1>
        </div>
        <h1>Modelling</h1>
        <div className="flex items-center">
          <h1>Club</h1>
          <h1 className={`subtitle text-red-600 ml-2
            xs:text-[20px] xs:pt-[7px]
            sm:text-[11px] sm:pt-[7px]
            md:text-[20px] md:pt-[15px]
            lg:text-[40px] lg:pt-[25px] lg:ml-[30px]`}>
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
      <div className="monoton absolute z-10 text-orange-600
        xs:top-[700px] xs:left-[1200px] xs:text-[50px] xs:leading-[60px]
        sm:top-[450px] sm:left-[20px] sm:text-[70px] sm:leading-[80px]
        md:top-[600px] md:left-[150px] md:text-[100px] md:leading-[110px]
        lg:top-[900px] lg:left-[350px] lg:text-[140px] lg:leading-[150px]">
        <h1>Drones</h1>
      </div>
    </Html>
  );
}

function Rcsection() {
  return (
    <Html>
      <div className="monoton absolute z-10 text-orange-600
        xs:top-[1500px] xs:left-[1200px] xs:text-[50px] xs:leading-[60px]
        sm:top-[700px] sm:left-[20px] sm:text-[70px] sm:leading-[80px]
        md:top-[1000px] md:left-[150px] md:text-[100px] md:leading-[110px]
        lg:top-[1700px] lg:left-[350px] lg:text-[140px] lg:leading-[150px]">
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
    <div className="h-screen overflow-hidden">
      <Canvas className="h-full w-full overflow-hidden" gl={{ antialias: true }} dpr={[1, 2]}>
        <Suspense fallback={<Loader />}>
          <PerspectiveCamera makeDefault position={[7, 0, 5]} />
          <directionalLight position={[10, 10, 10]} intensity={4} />
          <AeroModellingClub isMobile={isMobile} />
          <ScrollControls damping={0.1} pages={isMobile ? 2 : 3}>
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
  );
}
