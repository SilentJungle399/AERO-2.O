'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 p-4 md:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Navigation Links */}
        <div className="flex flex-col items-center md:items-start">
          <h2 className="text-lg font-bold mb-2">Quick Links</h2>
          <nav className="flex space-y-2 flex-wrap">
            <NavLink href="/" text="Home" />
            <div className="flex-col space-x-8 ">
            <NavLink href="/drones" text="Drones" />
            <NavLink href="/drones/blogs" text="Drone-Blogs" />
            <NavLink href="/drones/events" text="Drone-Events" />
            <NavLink href="/drones/workshops" text="Drone-Workshops" />
            <NavLink href="/drones/members" text="Drone-Members" />
            </div>
            <div className="flex-col space-x-8">
            <NavLink href="/rcplanes" text="RC-Planes" />
            <NavLink href="/rcplanes/blogs" text="RC-Plane-Blogs" />
            <NavLink href="/rcplanes/events" text="RC-Plane-Events" />
            <NavLink href="/rcplanes/workshops" text="RC-Plane-Workshops" />
            <NavLink href="/rcplanes/members" text="RC-Plane-Members" />
            </div>
            <div className="flex-col space-x-8">
            <NavLink href="/meets" text="Meets" />
            <NavLink href="/gallery" text="Gallery" />
            <NavLink href="/alluminai" text="ALLuminai" />
            <NavLink href="/about" text="About Us" />
            </div>
          </nav>
        </div>

        {/* Social Media Links */}
        <div className="flex flex-col items-center md:items-start ">
          <h2 className="text-lg font-bold mb-2">Follow Us</h2>
          <div className="flex space-x-4 flex-wrap">
            <SocialLink href="https://facebook.com">
              <FaFacebook size={24} />
            </SocialLink>
            <SocialLink href="https://twitter.com">
              <FaTwitter size={24} />
            </SocialLink>
            <SocialLink href="https://instagram.com">
              <FaInstagram size={24} />
            </SocialLink>
            <SocialLink href="https://linkedin.com">
              <FaLinkedin size={24} />
            </SocialLink>
          </div>
        </div>

        
        {/* Logo and Description */}
        <div className="flex flex-col items-center md:items-start">

          <Link href="/">
            <Image
              src="/aeronewlogo-removebg.png"
              alt="Aero Club Logo"
              width={150}
              height={150}
              className="w-20 h-20 md:w-32 md:h-32 mb-4"
            />
          </Link>
          <p className="text-center md:text-left text-sm">
            Welcome to the Aero Club NIT Kurukshetra. Join us to explore the exciting world of aeromodelling.
          </p>
        </div>

        
      </div>

      {/* Copyright */}
      <div className="text-center text-sm mt-4">
        &copy; {new Date().getFullYear()} Aero Club NIT Kurukshetra. All rights reserved.
      </div>
    </footer>
  );
};

// Helper component for navigation links
const NavLink = ({ href, text }) => (
  <Link href={href} className="hover:text-white">
    {text}
  </Link>
);

// Helper component for social media links
const SocialLink = ({ href, children }) => (
  <Link href={href} target="_blank" rel="noopener noreferrer">
    {children}
  </Link>
);

export default Footer;