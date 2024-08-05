"use client"
// import { useEffect, useState } from 'react';
// import Cookies from 'js-cookie';
import ContactUsPage from '@/components/ContactUs';
import React, { Suspense } from 'react';
// import Navbar from '@/components/Navbar';
// import dynamic from 'next/dynamic';
// import AdminNavBar from '@/components/AdminNavBar';
// import AlumniCarousel from '@/components/AlumniCarousel';

const Scene = React.lazy(() => import('@/components/Scene'));
export default function Home() {
  return (
    <>
    <span className='overflow-hidden backdr hide-scrollbar'>
      <Scene />
    </span>
      {/* <AlumniCarousel/> */}
      <ContactUsPage />
    </>
  );
}
