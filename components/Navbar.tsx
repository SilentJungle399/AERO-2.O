// components/Navbar.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { div } from "three/examples/jsm/nodes/Nodes.js";
import { useRouter } from "next/navigation";

const Navbar: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false); // State for profile dropdown
  const [username, setUserName] = useState("");
  const [profile, setProfile] = useState("");

  const router = useRouter();
  const logout = async () => {
    try {
      // Clear localStorage
      localStorage.clear();

      // Send a logout request to the backend
      const response = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (response.ok) {
        console.log("Logout successful");
        router.push("/login");
        router.refresh()
        window.location.reload() 
        // router.push('/');
        // Optionally redirect to login or homepage after successful logout
        // router.push('/login'); // if using Next.js router
      } else {
        console.error("Logout failed");
        // Handle logout failure as needed
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Handle logout error as needed
    }
  };

  const pathname = usePathname();
  const [id, setId] = useState("");
  useEffect(() => {
    const name = localStorage.getItem("name");
    const profile_pic = localStorage.getItem("profile_pic");
    const id = localStorage.getItem("_id");
    

    if (name && profile_pic) {
      setUserName(name);
      setProfile(profile_pic);
    }

    setId(id || ""); // Use an empty string as fallback if id is null
  }, []);

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
          href="/inductions"
          className="md:block text-white hover:text-[#3494D1] px-1 md:px-3 py-2 rounded-md text-base md:text-xl lg:text-2xl font-medium caesar-dressing-regular"
        >
          Inductions
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
              {!id ? (
                <Link
                  href="/login"
                  style={{ marginLeft: "77px", marginBottom: "3px" }}
                  className="bg-[#3494D1] text-white hover:text-[#3494D1] hover:bg-white px-7 py-1 rounded-sm text-sm font-medium caesar-dressing-regular "
                >
                  Login
                </Link>
              ) : (
                <div className="relative">
                  <button
                    className="nav-link ml-10"
                    onClick={() => setProfileOpen(!profileOpen)}
                  >
                    <img
                      src={profile}
                      alt="Profile Picture"
                      width={44}
                      height={44}
                      className="rounded-full mr-2"
                    />
                  </button>
                  {profileOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                      <div
                        className="py-1"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="options-menu"
                      >
                        {/* Example dropdown items */}
                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                        >
                          {username ? (
                            <div className="flex items-center">
                              <img
                                src={profile}
                                alt="Profile Picture"
                                width={24}
                                height={24}
                                className="rounded-full mr-2"
                              />
                              {username}
                            </div>
                          ) : (
                            "My Profile"
                          )}
                        </Link>
                        <Link
                          href="/settings"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Notifications
                        </Link>
                        
                        <Link
                          href="/settings"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Complete Profile
                        </Link>
                        <Link
                          href="/settings"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Settings
                        </Link>
                        <hr />
                        <button
                          onClick={logout}
                          className="block px-4 py-2 text-sm text-red-700 hover:bg-gray-100 w-full text-left"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
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
          {!id && (
            <Link
              href="/login"
              style={{ marginLeft: "77px", marginBottom: "3px" }}
              className="bg-[#3494D1] text-white hover:text-[#3494D1]  px-4 rounded-sm text-sm font-medium caesar-dressing-regular "
            >
              Login
            </Link>
          )}
          {/* Profile dropdown */}

          <button
            className="nav-link"
            style={{
              marginLeft: "140px",
              marginBottom: "3px",
              zIndex: "12",
              position: "relative",
            }}
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <img
              src={profile}
              alt="Profile Picture"
              width={44}
              height={44}
              className="rounded-full mr-2"
            />
          </button>
          {profileOpen && (
            <div className="origin-top-right absolute right-90  w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
              <div
                className="py-1"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu"
              >
                {/* Example dropdown items */}
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  My Profile
                </Link>
                <Link
                  href="/settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Settings
                </Link>
                <hr />
                <button
                  onClick={logout}
                  className="block px-4 py-2 text-sm text-red-700 hover:bg-gray-100 w-full text-left"
                >
                  Logout
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-col space-y-4">{renderLinks()}</div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
