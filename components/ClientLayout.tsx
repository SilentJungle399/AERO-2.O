'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from "./Navbar";
import Footer from "./Footer";
import AdminNavBar from './AdminNavBar';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');
  return (
    <>
      <Navbar />
      {children}
      {!isAdminPage && <Footer />}
    </>
  );
}