// 'use client';
// import React, { useState, useEffect, Suspense } from 'react';
// import { Canvas } from '@react-three/fiber';
// import { Environment, Html, ScrollControls, PerspectiveCamera } from '@react-three/drei';
// import EyeModel from './EyeModel';
// import Model from './Model';
// import RcModel from './RcModel';
// import DroneModel from './Drone';
// import Loader from './homePageLoader';

// interface AeroModellingClubProps {
//   isMobile: boolean;
// }

// function AeroModellingClub({ isMobile }: AeroModellingClubProps) {
//   return (
//     <Html>
//       <div className={`monoton absolute z-10 text-blue-500
//         xs:top-[300px] xs:left-[50px] xs:text-[45px] xs:leading-[50px]
//         sm:top-[250px] sm:left-[70px] sm:text-[50px] sm:leading-[55px]
//         md:top-[200px] md:left-[80px] md:text-[37px] md:leading-[45px]
//         lg:top-[200px] lg:left-[200px] lg:text-[100px] lg:leading-[90px]`}>
//         <div>
//           <h1>Aero</h1>
//         </div>
//         <h1>Modelling</h1>
//         <div className="flex items-center">
//           <h1>Club</h1>
//           <h1 className={`subtitle text-red-600 ml-2
//             text-[17px] pt-[7px]
//             xs:text-[13px] xs:pt-[5px]
//             sm:text-[15px] sm:pt-[6px]
//             md:text-[11px] md:pt-[7px]
//             lg:text-[35px] lg:pt-[15px]`}>
//             NIT&nbsp;&nbsp;&nbsp;&nbsp;Kurukshetra
//           </h1>
//         </div>
//       </div>
//     </Html>
//   );
// }

// function Dronesection() {
//   return (
//     <Html>
//       <div className="monoton absolute -z-10 text-orange-600
//         xs:top-[1000px] xs:left-[25px] xs:text-[40px] xs:leading-[50px]
//         sm:top-[1000px] sm:left-[35px] sm:text-[45px] sm:leading-[55px]
//         md:top-[1000px] md:left-[40px] md:text-[70px] md:leading-[80px]
//         lg:top-[1000px] lg:left-[150px] lg:text-[100px] lg:leading-[110px]">
//         <h1>Drones</h1>
//       </div>
//     </Html>
//   );
// }

// function Rcsection() {
//   return (
//     <Html>
//       <div className="monoton absolute -z-10 text-orange-600
//         xs:top-[1800px] xs:left-[25px] xs:text-[40px] xs:leading-[50px]
//         sm:top-[1800px] sm:left-[35px] sm:text-[45px] sm:leading-[55px]
//         md:top-[1800px] md:left-[40px] md:text-[70px] md:leading-[80px]
//         lg:top-[1800px] lg:left-[150px] lg:text-[100px] lg:leading-[110px]">
//         <h1>Planes</h1>
//       </div>
//     </Html>
//   );
// }

// export default function Scene() {
//   const [isMobile, setIsMobile] = useState(false);

//   useEffect(() => {
//     const mediaQuery = window.matchMedia('(max-width: 768px)');
//     setIsMobile(mediaQuery.matches);

//     const handleMediaQueryChange = (event: MediaQueryListEvent) => {
//       setIsMobile(event.matches);
//     };

//     mediaQuery.addEventListener('change', handleMediaQueryChange);
//     return () => {
//       mediaQuery.removeEventListener('change', handleMediaQueryChange);
//     };
//   }, []);

//   return (
//     <div className="h-screen overflow-hidden hide-scrollbar">
//       <Canvas className="h-full w-full overflow-hidden" gl={{ antialias: true }} dpr={[1, 2]}>
//         <Suspense fallback={<Loader />}>
//           <PerspectiveCamera makeDefault position={[0, 0, 0]} />
//           <directionalLight position={[10, 10, 10]} intensity={4} />
//           <AeroModellingClub isMobile={isMobile} />
//           <ScrollControls damping={0.1} pages={isMobile ? 2 : 3}>
//             <Model isMobile={isMobile} />
//             <EyeModel isMobile={isMobile} />
//             <group>
//               <Environment preset="sunset" />
//               <DroneModel isMobile={isMobile} />
//               <Dronesection />
//             </group>
//             <group>
//               <RcModel isMobile={isMobile} />
//               <Rcsection />
//             </group>
//           </ScrollControls>
//         </Suspense>
//       </Canvas>
//     </div>
//   );
// }

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
      <div className="monoton absolute -z-10 text-orange-600"
        style={{
          top: isMobile ? '100vh' : '150vh',
          left: '5vw',
          fontSize: isMobile ? 'clamp(4rem, 8vw, 8rem)' : 'clamp(2rem, 8vw, 6rem)',
          lineHeight: '1.1'
        }}>
        <h1>Drones</h1>
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