'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 p-4 md:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Logo and Description */}
        <div className="flex flex-col items-center justify-center md:items-start">
          <Link href="/">
            <Image
              src="/aeronewlogo-removebg.png"
              alt="Aero Club Logo"
              width={200}
              height={200}
              className="w-60 h-60 md:w-32 md:h-32 mb-4"
            />
          </Link>
          <p className="text-center md:text-left text-sm">
            Welcome to the Aero Club NIT Kurukshetra. Join us to explore the exciting world of aeromodelling.
          </p>
          {/* Social Media Links */}
          <div className="flex flex-col  items-center md:items-start">
            <h2 className="text-lg font-bold mb-2">Follow Us</h2>
            <div className="flex space-x-4 ">
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
        </div>
        {/* Navigation Links */}
        <div className="flex flex-col">
          <h2 className="text-lg font-bold mb-2">Quick Links</h2>
          <nav className="space-y-4 md:space-y-0 md:space-x-5 md:flex ">
            <div className="flex flex-col space-y-2">
              <NavLink href="/" text="Home" />
              <NavLink href="/drones" text="Drones" />
              <NavLink href="/workshops" text="Workshops" />
             
            </div>
            <div className="flex flex-col space-y-2">
              <NavLink href="/rcplanes" text="RC-Planes" />
              <NavLink href="/blogs" text="Blogs" />
              <NavLink href="/events" text="Events" />
            </div>
            <div className="flex flex-col space-y-2">
              <NavLink href="/meets" text="Meets" />
              <NavLink href="/gallery" text="Gallery" />
              <NavLink href="/about" text="About Us" />
            </div>
          </nav>
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
  <Link href={href} target="_blank" rel="noopener noreferrer" className="hover:text-white">
    {children}
  </Link>
);

export default Footer;
