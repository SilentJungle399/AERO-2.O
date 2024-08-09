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
//         top-[-90px] left-[1080px] text-[55px] leading-[60px]
//         md:top-[-104px] md:left-[320px] md:text-[37px] md:leading-[45px]
//         lg:top-[-150px] lg:left-[400px] lg:text-[80px] lg:leading-[90px]
//         xl:top-[-210px] xl:left-[500px] xl:text-[140px] xl:leading-[150px]`}>
//         <div>
//           <h1>Aero</h1>
//         </div>
//         <h1>Modelling</h1>
//         <div className="flex items-center">
//           <h1>Club</h1>
//           <h1 className={`subtitle text-red-600 ml-2
//             text-[17px] pt-[7px]
//             md:text-[11px] md:pt-[7px]
//             lg:text-[20px] lg:pt-[15px]
//             xl:text-[40px] xl:pt-[25px] xl:ml-[30px]`}>
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
//       <div className="monoton absolute z-10 text-orange-600
//         top-[700px] left-[1100px] text-[50px] leading-[60px]
//         md:top-[650px] md:left-[1000px] md:text-[70px] md:leading-[80px]
//         lg:top-[600px] lg:left-[900px] lg:text-[100px] lg:leading-[110px]
//         xl:top-[900px] xl:left-[400px] xl:text-[140px] xl:leading-[150px]">
//         <h1>Drones</h1>
//       </div>
//     </Html>
//   );
// }

// function Rcsection() {
//   return (
//     <Html>
//       <div className="monoton absolute z-10 text-orange-600
//         top-[1500px] left-[1100px] text-[50px] leading-[60px]
//         md:top-[1450px] md:left-[1000px] md:text-[70px] md:leading-[80px]
//         lg:top-[1400px] lg:left-[900px] lg:text-[100px] lg:leading-[110px]
//         xl:top-[1700px] xl:left-[400px] xl:text-[140px] xl:leading-[150px]">
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
//           <PerspectiveCamera makeDefault position={[7, 0, 5]} />
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
      <div className={`monoton absolute z-10 text-blue-500
        xs:top-[300px] xs:left-[50px] xs:text-[45px] xs:leading-[50px]
        sm:top-[250px] sm:left-[70px] sm:text-[50px] sm:leading-[55px]
        md:top-[200px] md:left-[80px] md:text-[37px] md:leading-[45px]
        lg:top-[200px] lg:left-[200px] lg:text-[100px] lg:leading-[90px]`}>
        <div>
          <h1>Aero</h1>
        </div>
        <h1>Modelling</h1>
        <div className="flex items-center">
          <h1>Club</h1>
          <h1 className={`subtitle text-red-600 ml-2
            text-[17px] pt-[7px]
            xs:text-[13px] xs:pt-[5px]
            sm:text-[15px] sm:pt-[6px]
            md:text-[11px] md:pt-[7px]
            lg:text-[35px] lg:pt-[15px]`}>
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
        xs:top-[1000px] xs:left-[25px] xs:text-[40px] xs:leading-[50px]
        sm:top-[1000px] sm:left-[35px] sm:text-[45px] sm:leading-[55px]
        md:top-[1000px] md:left-[40px] md:text-[70px] md:leading-[80px]
        lg:top-[1000px] lg:left-[150px] lg:text-[100px] lg:leading-[110px]">
        <h1>Drones</h1>
      </div>
    </Html>
  );
}

function Rcsection() {
  return (
    <Html>
      <div className="monoton absolute z-10 text-orange-600
        xs:top-[1800px] xs:left-[25px] xs:text-[40px] xs:leading-[50px]
        sm:top-[1800px] sm:left-[35px] sm:text-[45px] sm:leading-[55px]
        md:top-[1800px] md:left-[40px] md:text-[70px] md:leading-[80px]
        lg:top-[1800px] lg:left-[150px] lg:text-[100px] lg:leading-[110px]">
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
        <Suspense fallback={<Loader />}>
          <PerspectiveCamera makeDefault position={[0, 0, 0]} />
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
