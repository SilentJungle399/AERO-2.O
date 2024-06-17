// components/Navbar.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const Navbar: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const renderLinks = () => {
    if (pathname.startsWith("/drones")) {
      return (
        <>
          <Link
            href="/"
            className="text-white hover:text-[#3494D1] px-1 md:px-3 py-2 rounded-md text-base md:text-xl lg:text-2xl font-medium caesar-dressing-regular"
          >
            Home
          </Link>
          <Link
            href="/drones/blogs"
            className="text-white hover:text-[#3494D1] px-1 md:px-3 py-2 rounded-md text-base md:text-xl lg:text-2xl font-medium caesar-dressing-regular"
          >
            Blogs
          </Link>
          <Link
            href="/drones/events"
            className="text-white hover:text-[#3494D1] px-1 md:px-3 py-2 rounded-md text-base md:text-xl lg:text-2xl font-medium caesar-dressing-regular"
          >
            Events
          </Link>
          <Link
            href="/drones/workshops"
            className="text-white hover:text-[#3494D1] px-1 md:px-3 py-2 rounded-md text-base md:text-xl lg:text-2xl font-medium caesar-dressing-regular"
          >
            Workshops
          </Link>
          <Link
            href="/drones/members"
            className="text-white hover:text-[#3494D1] px-1 md:px-3 py-2 rounded-md text-base md:text-xl lg:text-2xl font-medium caesar-dressing-regular"
          >
            Members
          </Link>
        </>
      );
    }
    if (pathname.startsWith("/rcplanes")) {
      return (
        <>
          <Link
            href="/"
            className="text-white hover:text-[#3494D1] px-1 md:px-3 py-2 rounded-md text-base md:text-xl lg:text-2xl font-medium caesar-dressing-regular"
          >
            Home
          </Link>
          <Link
            href="/rcplanes/blogs"
            className="text-white hover:text-[#3494D1] px-1 md:px-3 py-2 rounded-md text-base md:text-xl lg:text-2xl font-medium caesar-dressing-regular"
          >
            Blogs
          </Link>
          <Link
            href="/rcplanes/events"
            className="text-white hover:text-[#3494D1] px-1 md:px-3 py-2 rounded-md text-base md:text-xl lg:text-2xl font-medium caesar-dressing-regular"
          >
            Events
          </Link>
          <Link
            href="/rcplanes/workshops"
            className="text-white hover:text-[#3494D1] px-1 md:px-3 py-2 rounded-md text-base md:text-xl lg:text-2xl font-medium caesar-dressing-regular"
          >
            Workshops
          </Link>
          <Link
            href="/rcplanes/members"
            className="text-white hover:text-[#3494D1] px-1 md:px-3 py-2 rounded-md text-base md:text-xl lg:text-2xl font-medium caesar-dressing-regular"
          >
            Members
          </Link>
        </>
      );
    }
    return (
      <>
        <Link
          href="/"
          className="text-white hover:text-[#3494D1] px-1 md:px-3 py-2 rounded-md text-base md:text-xl lg:text-2xl font-medium caesar-dressing-regular"
        >
          Home
        </Link>
        <Link
          href="/drones"
          className="text-white hover:text-[#3494D1] px-1 md:px-3 py-2 rounded-md text-base md:text-xl lg:text-2xl font-medium caesar-dressing-regular"
        >
          Drones
        </Link>
        <Link
          href="/rcplanes"
          className="text-white hover:text-[#3494D1] px-1 md:px-3 py-2 rounded-md text-base md:text-xl lg:text-2xl font-medium caesar-dressing-regular"
        >
          Rc Planes
        </Link>
        <Link
          href="/meets"
          className="md:block text-white hover:text-[#3494D1] px-1 md:px-3 py-2 rounded-md text-base md:text-xl lg:text-2xl font-medium caesar-dressing-regular"
        >
          Meets
        </Link>
        <Link
          href="/gallery"
          className="md:block text-white hover:text-[#3494D1] px-1 md:px-3 py-2 rounded-md text-base md:text-xl lg:text-2xl font-medium caesar-dressing-regular"
        >
          Gallery
        </Link>
        <Link
          href="/alluminai"
          className="text-white hover:text-[#3494D1] px-1 md:px-3 py-2 rounded-md text-base md:text-xl lg:text-2xl font-medium caesar-dressing-regular"
        >
          ALLuminai
        </Link>
        <Link
          href="/about"
          className="text-white hover:text-[#3494D1] px-1 md:px-3 py-2 rounded-md text-base md:text-xl lg:text-2xl font-medium caesar-dressing-regular"
        >
          About Us
        </Link>
      </>
    );
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 w-full pointer-events-none">
      <nav className="bg-black bg-opacity-0 w-full pointer-events-auto">
        <div className="w-full px-0">
          <div className="flex items-center justify-between h-24 px-2 md:px-4">
            {/* Hamburger Menu Icon for Mobile */}
            <button
              className="xl:hidden text-white focus:outline-none"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/">
                <Image
                  src="/aeronewlogo-removebg.png"
                  alt="Aeromodelling Logo"
                  width={150}
                  height={150}
                  className="mt-1 w-20 h-20 md:w-32 md:h-32 lg:w-48 lg:h-48"
                />
              </Link>
            </div>

            {/* Links for Desktop */}
            <div className="hidden md:flex items-center space-x-2 md:space-x-4 w-full justify-end mr-20">
              {renderLinks()}
              <Link
                href="/login"
                style={{ marginLeft: "77px", marginBottom: "3px" }}
                className="bg-[#3494D1] text-white hover:text-[#3494D1] hover:bg-white px-7 py-1 rounded-sm text-sm font-medium caesar-dressing-regular "
              >
                Login
              </Link>
            </div>
          </div>
        </div>

        {/* Sidebar for Mobile */}
        <div
          className={`fixed inset-y-0 left-0 transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:hidden transition-transform duration-300 ease-in-out bg-black bg-opacity-90 w-64 p-4 z-50`}
        >
          <button
            className="text-white focus:outline-none mb-4"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <Link
            href="/login"
            style={{ marginLeft: "77px", marginBottom: "3px" }}
            className="bg-[#3494D1] text-white hover:text-[#3494D1]  px-4 rounded-sm text-sm font-medium caesar-dressing-regular "
          >
            Login
          </Link>
          <div className="flex flex-col space-y-4">{renderLinks()}</div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
