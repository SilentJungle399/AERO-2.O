import React from 'react';
import Link from 'next/link';
import { FaPlane, FaUsers, FaCalendarAlt, FaTools, FaTrophy, FaCog, FaSignOutAlt } from 'react-icons/fa';

export default function AeroClubAdminDashboard() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-68  bg-blue-800 text-white h-screen fixed">
        <div className="p-6">
          <h1 className="text-2xl font-bold">NIT KKR AERO CLUB</h1>
          <p className="text- mt-1 font-medium">BLog Dashboard</p>
        </div>
        <nav className="mt-6">
          <Link href="/admin/blogs/published" className="flex items-center py-3 px-6 bg-blue-900">
            <FaPlane className="mr-3" />
            Published blogs
          </Link>
          <Link href="/admin/blogs/createblogs" className="flex items-center py-3 px-6 hover:bg-blue-700">
            <FaUsers className="mr-3" />
            Create blogs
          </Link>
          <Link href="/admin/blogs/addcategory" className="flex items-center py-3 px-6 hover:bg-blue-700">
            <FaUsers className="mr-3" />
            Add category
          </Link>
          <Link href="/admin/blogs/addsection" className="flex items-center py-3 px-6 hover:bg-blue-700">
            <FaCalendarAlt className="mr-3" />
            Add sections
          </Link>
          <Link href="/admin/blogs/update" className="flex items-center py-3 px-6 hover:bg-blue-700">
            <FaTools className="mr-3" />
            Update blogs
          </Link>
          <Link href="/admin/blogs/delete" className="flex items-center py-3 px-6 hover:bg-blue-700">
            <FaTrophy className="mr-3" />
            Delete blogs
          </Link>
          <Link href="/admin/blogs/settings" className="flex items-center py-3 px-6 hover:bg-blue-700">
            <FaCog className="mr-3" />
            Settings
          </Link>
        </nav>
        <div className="absolute bottom-0 w-64 p-6">
          <Link href="/logout" className="flex items-center text-white opacity-75 hover:opacity-100">
            <FaSignOutAlt className="mr-3" />
            Logout
          </Link>
        </div>
      </div>

     
    </div>
  );
}