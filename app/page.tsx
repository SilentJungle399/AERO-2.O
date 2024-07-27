"use client"
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import ContactUsPage from '@/components/ContactUs';
import Navbar from '@/components/Navbar';
import dynamic from 'next/dynamic';
import AdminNavBar from '@/components/AdminNavBar';
import AlumniCarousel from '@/components/AlumniCarousel';

const Scene = dynamic(() => import('@/components/Scene'), { ssr: false });

export default function Home() {
  

  return (
    <>
      <Scene />
      {/* <AlumniCarousel/> */}
      <ContactUsPage />
    </>
  );
}
