"use client";

import React, {useEffect, useState} from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import {FaCalendarAlt, FaCog, FaPlane, FaTools, FaTrophy, FaUsers} from 'react-icons/fa';
import Loader from '@/components/Loader'

const withAdminAuth = (WrappedComponent) => {
  const WithAdminAuth = (props) => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const checkAdmin = async () => {
        const token = Cookies.get('token');

        if (!token) {
          window.location.href = "/login"
          return;
        }

        try {
          const baseUrl = process.env.NODE_ENV === 'production'
            ? ""
            : 'http://localhost:5000';
          const response = await fetch(`${baseUrl}/api/auth/check-admin`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
          });

          const data = await response.json();
          if (data.isAdmin) {
            setIsLoading(false);
          } else {
            window.location.href = "/unauthorized"
          }
        } catch (error) {
          console.error('Error checking admin status:', error);
          window.location.href = "/unauthorized"
        }
      };

      checkAdmin();
    }, []);

    if (isLoading) {
      <Loader/>
    }

    return <WrappedComponent {...props} />;
  };

  // Set the display name for the HOC for better debugging and React DevTools
  WithAdminAuth.displayName = `WithAdminAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithAdminAuth;
};

const AeroClubAdminDashboard = () => {
  return (
    <div className="flex h-screen bg-black">
      {/* Sidebar */}
      <div className="w-68 pt-24 bg-blue-800 text-white h-screen fixed">
        <div className="p-6">
          <h1 className="text-2xl font-bold">NIT KKR AERO CLUB</h1>
          <p className="text-sm mt-1 font-medium">Blog Dashboard</p>
        </div>
        <nav className="mt-6">
          <Link href="/admin/blogs/editblog" className="flex items-center py-3 px-6 bg-blue-900">
            <FaPlane className="mr-3"/>
            Edit blogs
          </Link>
          <Link href="/admin/blogs/createblogs" className="flex items-center py-3 px-6 hover:bg-blue-700">
            <FaUsers className="mr-3"/>
            Create blogs
          </Link>
          <Link href="/admin/blogs/addcategory" className="flex items-center py-3 px-6 hover:bg-blue-700">
            <FaUsers className="mr-3"/>
            Add category
          </Link>
          <Link href="/admin/blogs/addsection" className="flex items-center py-3 px-6 hover:bg-blue-700">
            <FaCalendarAlt className="mr-3"/>
            Add sections
          </Link>
          <Link href="/admin/blogs/update" className="flex items-center py-3 px-6 hover:bg-blue-700">
            <FaTools className="mr-3"/>
            Update blogs
          </Link>
          <Link href="/admin/blogs/delete" className="flex items-center py-3 px-6 hover:bg-blue-700">
            <FaTrophy className="mr-3"/>
            Delete blogs
          </Link>
          <Link href="/admin/blogs/settings" className="flex items-center py-3 px-6 hover:bg-blue-700">
            <FaCog className="mr-3"/>
            Settings
          </Link>
        </nav>
      </div>
    </div>
  );
};

// Set the display name for the AeroClubAdminDashboard component
AeroClubAdminDashboard.displayName = 'AeroClubAdminDashboard';

export default withAdminAuth(AeroClubAdminDashboard);
