// components/Navbar.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { FaArrowCircleDown, FaBell, FaCaretDown, FaDropbox } from "react-icons/fa";

import { initializeApp } from "firebase/app";
import firebaseConfig from "@/Backend/Firebseconfig/FirebaseConfig";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

interface Notification {
  _id: string;
  notifications_title: string;
  created_at: string;
}

interface NotificationWithRead {
  notification: Notification;
  read: boolean;
}

interface NotificationModalProps {
  notifications: NotificationWithRead[];
  closeModal: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({ notifications, closeModal }) => {
  const sortedNotifications = notifications.sort((a, b) => {
    return a.read === b.read
      ? new Date(b.notification.created_at).getTime() - new Date(a.notification.created_at).getTime()
      : a.read ? 1 : -1;
  });

  const unreadNotifications = sortedNotifications.filter(notification => !notification.read);
  const readNotifications = sortedNotifications.filter(notification => notification.read);

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white text-gray-900 rounded-lg shadow-lg w-1/2 p-6">
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="flex items-center space-x-2 text-xl font-semibold">
            <FaBell className="text-yellow-400 mr-3" /> Notifications
          </h2>
          <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">&times;</button>
        </div>
        <div className="overflow-y-auto max-h-80">
          {unreadNotifications.length > 0 && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Unread Notifications</h3>
              {unreadNotifications.map((notification, index) => (
                <Link key={index} href={`/notifications/${notification.notification._id}`} onClick={closeModal}>
                  <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
                    <p className="text-sm text-gray-700 font-medium">{notification.notification.notifications_title}</p>
                    <span className="text-xs text-gray-500">
                      {new Date(notification.notification.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {readNotifications.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Read Notifications</h3>
              {readNotifications.map((notification, index) => (
                <Link key={index} href={`/notifications/${notification.notification._id}`} onClick={closeModal}>
                  <div className="mb-4 p-3 bg-gray-100 rounded-lg">
                    <p className="text-sm text-gray-700">{notification.notification.notifications_title}</p>
                    <span className="text-xs text-gray-500">
                      {new Date(notification.notification.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {unreadNotifications.length === 0 && readNotifications.length === 0 && (
            <p className="text-sm text-gray-500">No notifications available</p>
          )}
        </div>
      </div>
    </div>
  );
};

const Navbar: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [username, setUserName] = useState("");
  const [profile, setProfile] = useState("");
  const [error, setError] = useState("");
  const [newNotificationCount, setNewNotificationCount] = useState(0);
  const [isAdmin, setAdmin] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationWithRead[]>([]);
  const [id, setId] = useState("");

  const router = useRouter();
  const pathname = usePathname();

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const token = await user.getIdToken();

      const res = await fetch("http://localhost:5000/api/auth/google-signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials:'include',
        body: JSON.stringify({ user }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log(data);
        localStorage.setItem("token", data.token);
        localStorage.setItem("_id", data._id);
        localStorage.setItem("name", data.full_name);
        localStorage.setItem("profile_pic", data.profile_pic);
        localStorage.setItem("role", data.role);
        setTimeout(() => {
          window.location.href = "/";
        }, 100);
      } else {
        setError("Failed to sign in with Google");
      }
    } catch (error) {
      setError("Error signing in with Google");
    }
  };

  const fetchNotifications = async () => {
    const id = localStorage.getItem("_id");
    if (!id) {
      console.error("User ID not found in localStorage");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/users/notifications/${id}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      const notifications = data.notifications;
      const unreadCount = data.unreadCount;

      const sortedNotifications = notifications.sort((a: NotificationWithRead, b: NotificationWithRead) => {
        if (a.read === b.read) {
          return new Date(b.notification.created_at).getTime() - new Date(a.notification.created_at).getTime();
        }
        return a.read ? 1 : -1;
      });

      setNewNotificationCount(unreadCount);
      setNotifications(sortedNotifications);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const logout = async () => {
    try {
      localStorage.clear();
      const baseUrl = process.env.NODE_ENV === 'production'
        ? process.env.NEXT_PUBLIC_BACKEND_URL
        : 'http://localhost:5000';
      const response = await fetch(`${baseUrl}/api/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (response.ok) {
        console.log("Logout successful");
        router.push("/login");
        router.refresh();
        window.location.reload();
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const name = localStorage.getItem("name");
    const profile_pic = localStorage.getItem("profile_pic");
    const id = localStorage.getItem("_id");
    const userRole = localStorage.getItem("role");

    if (name && profile_pic) {
      setUserName(name);
      setProfile(profile_pic);
    }

    setId(id || "");
    if (userRole === "admin") {
      console.log("dksfjs")
      setAdmin(true);
    }

    if (!id) {
      const timeoutId = setTimeout(() => {
        signInWithGoogle();
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, []);

  const handleBellClick = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 w-full pointer-events-none">
      <nav className="bg-black bg-opacity-0 w-full pointer-events-auto">
        <div className="w-full px-0">
          <div className="flex items-center justify-between h-24 px-2 md:px-4">
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

            <div className="hidden md:flex items-center space-x-2 md:space-x-4 w-full justify-end mr-20">
              {isAdmin && (
                <>
                  <Link
                    href="/admin/blogs"
                    className="text-white hover:text-[#3494D1] px-1 md:px-3 py-2 rounded-md text-base md:text-xl lg:text-2xl font-medium bebas-neue-regular"
                  >
                    Blogs-dashboard
                  </Link>
                  <Link
                    href="/admin/events/create"
                    className="text-white hover:text-[#3494D1] px-1 md:px-3 py-2 rounded-md text-base md:text-xl lg:text-2xl font-medium bebas-neue-regular"
                  >
                    Events-dashboard
                  </Link>
                  <Link
                    href="/admin/inductions"
                    className="text-white hover:text-[#3494D1] px-1 md:px-3 py-2 rounded-md text-base md:text-xl lg:text-2xl font-medium bebas-neue-regular"
                  >
                    Inductions-dashboard
                  </Link>
                  <Link
                    href="/admin/meets"
                    className="text-white hover:text-[#3494D1] px-1 md:px-3 py-2 rounded-md text-base md:text-xl lg:text-2xl font-medium bebas-neue-regular"
                  >
                    Meets-dashboard
                  </Link>
                </>
              )}

              {!isAdmin && (
                <>
                  <Link
                    href="/rcplanes/blogs"
                    className="text-white hover:text-[#3494D1] px-1 md:px-3 py-2 rounded-md text-base md:text-xl lg:text-2xl font-medium bebas-neue-regular"
                  >
                    Blogs
                  </Link>
                  <Link
                    href="/drones"
                    className="text-white hover:text-[#3494D1] px-1 md:px-3 py-2 rounded-md text-base md:text-xl lg:text-2xl font-medium bebas-neue-regular"
                  >
                    Drones
                  </Link>
                  <Link
                    href="/rcplanes"
                    className="text-white hover:text-[#3494D1] px-1 md:px-3 py-2 rounded-md text-base md:text-xl lg:text-2xl font-medium bebas-neue-regular"
                  >
                    Rc Planes
                  </Link>
                  <div className="relative group">
                    <button className="flex items-center text-white hover:text-[#3494D1] px-1 md:px-3 py-2 rounded-md text-base md:text-xl lg:text-2xl font-medium bebas-neue-regular">
                      Activities <FaCaretDown className="ml-1 w-5 h-5" />
                    </button>
                    <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="py-1" role="menu" aria-orientation="vertical">
                        <Link
                          href="/events"
                          className="bebas-neue-regular block px-4 py-2 text-md text-gray-300 hover:text-[#3494D1]"
                        >
                          Events
                        </Link>
                        <Link
                          href="/workshops"
                          className="bebas-neue-regular block px-4 py-2 text-md text-gray-300 hover:text-[#3494D1]"
                        >
                          Workshops
                        </Link>
                        <Link
                          href="/techevents"
                          className="bebas-neue-regular block px-4 py-2 text-md text-gray-300 hover:text-[#3494D1]"
                        >
                          Techspardha Events
                        </Link>
                      </div>
                    </div>
                  </div>
                  <Link
                    href="/meets"
                    className="text-white hover:text-[#3494D1] px-1 md:px-3 py-2 rounded-md text-base md:text-xl lg:text-2xl font-medium bebas-neue-regular"
                  >
                    Meets
                  </Link>
                  <Link
                    href="/inductions"
                    className="text-white hover:text-[#3494D1] px-1 md:px-3 py-2 rounded-md text-base md:text-xl lg:text-2xl font-medium bebas-neue-regular"
                  >
                    Inductions
                  </Link>
                  <Link
                    href="/gallery"
                    className="text-white hover:text-[#3494D1] px-1 md:px-3 py-2 rounded-md text-base md:text-xl lg:text-2xl font-medium bebas-neue-regular"
                  >
                    Gallery
                  </Link>
                  <Link
                    href="/members"
                    className="text-white hover:text-[#3494D1] px-1 md:px-3 py-2 rounded-md text-base md:text-xl lg:text-2xl font-medium bebas-neue-regular"
                  >
                    Members
                  </Link>
                </>
              )}

              {!id ? (
                <Link
                  href="/login"
                  className="bg-[#3494D1] text-white hover:text-[#3494D1] hover:bg-white px-7 py-1 rounded-md text-md font-sm bebas-neue-regular"
                >
                  Login
                </Link>
              ) : (
                <div className="relative flex items-center text-yellow-300 justify-center">
                  <div className="flex items-center cursor-pointer">
                    <div className="relative flex items-center">
                      <FaBell
                        className={`w-8 h-8 cursor-pointer ${newNotificationCount > 0 ? "text-yellow-400" : "text-white"}`}
                        onClick={handleBellClick}
                      />
                      {newNotificationCount > 0 && (
                        <div
                          className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full -translate-x-1/2 translate-y-1/2"
                          onClick={handleBellClick}
                        >
                          {newNotificationCount}
                        </div>
                      )}
                    </div>
                    <button
                      className="nav-link ml-3"
                      onClick={() => setProfileOpen(!profileOpen)}
                    >
                      <img
                        src={profile}
                        alt="Profile Picture"
                        width={44}
                        height={44}
                        className="rounded-full"
                      />
                    </button>
                  </div>
                  {profileOpen && (
                    <div className="top-16 absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                      <div
                        className="py-1"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="options-menu"
                      >
                        <Link
                          href={`/myprofile/${id}`}
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
                        {isAdmin && (
                          <Link
                            href="/admin-dashboard"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Admin Dashboard
                          </Link>
                        )}
                        <Link
                          href="/notifications"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Notifications
                        </Link>
                        <Link
                          href={`/myprofile/${id}`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Profile
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
                  {isModalOpen && (
                    <NotificationModal
                      notifications={notifications}
                      closeModal={() => setIsModalOpen(false)}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar for Mobile */}
        <div
          className={`fixed inset-y-0 left-0 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
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
              onClick={() => setSidebarOpen(!sidebarOpen)}
              href="/login"
              className="bg-[#3494D1] text-white hover:text-[#3494D1] px-4 rounded-sm text-sm font-medium bebas-neue-regular"
            >
              Login
            </Link>
          )}
          {id && (
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
          )}
          {profileOpen && (
            <div className="origin-top-right absolute right-0 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
              <div
                className="py-1"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu"
              >
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  My Profile
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin-dashboard"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <Link
                  href="/notifications"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Notifications
                </Link>
                <Link
                  href="/complete-profile"
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

          <div className="flex flex-col space-y-4">
            <Link
              onClick={() => setSidebarOpen(!sidebarOpen)}
              href="/rcplanes/blogs"
              className="text-white hover:text-[#3494D1] px-1 md:px-3 py-2 rounded-md text-base md:text-xl lg:text-2xl font-medium bebas-neue-regular"
            >
              Blogs
            </Link>
            <Link
              onClick={() => setSidebarOpen(!sidebarOpen)}
              href="/rcplanes/events"
              className="text-white hover:text-[#3494D1] px-1 md:px-3 py-2 rounded-md text-base md:text-xl lg:text-2xl font-medium bebas-neue-regular"
            >
              Events
            </Link>
            <Link
              onClick={() => setSidebarOpen(!sidebarOpen)}
              href="/drones"
              className="text-white hover:text-[#3494D1] px-1 md:px-3 py-2 rounded-md text-base md:text-xl lg:text-2xl font-medium bebas-neue-regular"
            >
              Drones
            </Link>
            <Link
              onClick={() => setSidebarOpen(!sidebarOpen)}
              href="/rcplanes"
              className="text-white hover:text-[#3494D1] px-1 md:px-3 py-2 rounded-md text-base md:text-xl lg:text-2xl font-medium bebas-neue-regular"
            >
              Rc Planes
            </Link>
            <Link
              onClick={() => setSidebarOpen(!sidebarOpen)}
              href="/meets"
              className="text-white hover:text-[#3494D1] px-1 md:px-3 py-2 rounded-md text-base md:text-xl lg:text-2xl font-medium bebas-neue-regular"
            >
              Meets
            </Link>
            <Link
              onClick={() => setSidebarOpen(!sidebarOpen)}
              href="/inductions"
              className="text-white hover:text-[#3494D1] px-1 md:px-3 py-2 rounded-md text-base md:text-xl lg:text-2xl font-medium bebas-neue-regular"
            >
              Inductions
            </Link>
            <Link
              onClick={() => setSidebarOpen(!sidebarOpen)}
              href="/gallery"
              className="text-white hover:text-[#3494D1] px-1 md:px-3 py-2 rounded-md text-base md:text-xl lg:text-2xl font-medium bebas-neue-regular"
            >
              Gallery
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;