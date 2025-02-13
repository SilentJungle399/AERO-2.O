"use client"
import ContactUsPage from '@/components/ContactUs';
import React, { Suspense } from 'react';
import SaleNotification from "../components/Sale"

const Scene = React.lazy(() => import('@/components/Scene'));
export default function Home() {
  return (
    <>
      {/* <SaleNotification/> */}
    <span className='overflow-hidden backdr hide-scrollbar'>
      <Scene />
    </span>
      <ContactUsPage />
    </>
  );
}
