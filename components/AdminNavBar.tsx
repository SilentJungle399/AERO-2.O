import React from 'react';
import Link from 'next/link';
import { FaPlane, FaUsers, FaCalendarAlt, FaTools, FaTrophy, FaCog, FaSignOutAlt } from 'react-icons/fa';

export default function AdminNavBar() {
  return (
    <div className="bg-blue-800 text-white h-16 flex items-center justify-between px-6 fixed w-full top-0 z-10">
      <h1 className="text-2xl font-bold">NIT KKR AERO CLUB</h1>
      <nav className="flex items-center space-x-4">
        <Link href="/admin" className="flex items-center hover:bg-blue-700 p-2 rounded">
          <FaPlane className="mr-2" /> Dashboard
        </Link>
        <Link href="/admin/blogs" className="flex items-center hover:bg-blue-700 p-2 rounded">
          <FaUsers className="mr-2" /> Blogs
        </Link>
        <Link href="/admin/members" className="flex items-center hover:bg-blue-700 p-2 rounded">
          <FaUsers className="mr-2" /> Members
        </Link>
        <Link href="/admin/events/create" className="flex items-center hover:bg-blue-700 p-2 rounded">
          <FaCalendarAlt className="mr-2" /> Events
        </Link>
        <Link href="/admin/projects" className="flex items-center hover:bg-blue-700 p-2 rounded">
          <FaTools className="mr-2" /> Projects
        </Link>
        <Link href="/admin/competitions" className="flex items-center hover:bg-blue-700 p-2 rounded">
          <FaTrophy className="mr-2" /> Competitions
        </Link>
        <Link href="/admin/settings" className="flex items-center hover:bg-blue-700 p-2 rounded">
          <FaCog className="mr-2" /> Settings
        </Link>
        <Link href="/logout" className="flex items-center hover:bg-blue-700 p-2 rounded">
          <FaSignOutAlt className="mr-2" /> Logout
        </Link>
      </nav>
    </div>
  );
}
