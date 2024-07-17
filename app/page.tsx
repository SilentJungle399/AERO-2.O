"use client"
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import ContactUsPage from '@/components/ContactUs';
import Navbar from '@/components/Navbar';
import dynamic from 'next/dynamic';

const Scene = dynamic(() => import('@/components/Scene'), { ssr: false });

export default function Home() {
  useEffect(() => {
    const token = Cookies.get('token');
    console.log('Token:', token);
  }, []);

  return (
    <>
      <Navbar />
      <Scene />
      <ContactUsPage />
    </>
  );
}
