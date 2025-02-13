'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPlane, FaGraduationCap, FaBlog,
  FaEnvelope, FaMapMarkerAlt,FaDev 
} from 'react-icons/fa';

import { HiMiniUserGroup } from "react-icons/hi2";
import { TbDrone } from "react-icons/tb";
import { RiGalleryLine } from "react-icons/ri";
import { MdPrivacyTip } from "react-icons/md";


const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-200 py-10">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Club Identity */}
        <div className="space-y-1 text-center md:text-left">
          <h3 className="text-xl font-bold text-white border-b-2 border-blue-500 pb-2">Aero Club</h3>
          <div className="flex flex-col items-center justify-center md:items-start">
            <Image
              src="/aeronewlogo-removebg_footer.png"
              alt="Aero Club Logo"
              width={250}
              height={200}
              className="m-auto"
            />
            <p className="text-sm mb-4 text-gray-300 text-center">
              Pioneering aerospace innovation at NIT Kurukshetra. Transforming dreams into flight.
            </p>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-white border-b-2 border-blue-500 pb-2">Explore</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { href: '/', icon: FaGraduationCap, label: 'Home' },
              { href: '/drones', icon: TbDrone, label: 'Drones' },
              { href: '/workshops', icon: FaPlane, label: 'Workshops' },
              { href: '/rcplanes', icon: FaPlane, label: 'RC Planes' },
              { href: '/blogs', icon: FaBlog, label: 'Blogs' },
              { href: '/events', icon: FaBlog, label: 'Events' },
              { href: '/meets', icon: HiMiniUserGroup, label: 'Meets' },
              { href: '/inductions', icon: HiMiniUserGroup, label: 'Inductions' }
            ].map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center space-x-2 hover:text-blue-300 transition-colors"
              >
                <Icon />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-white border-b-2 border-blue-500 pb-2">Additional Links</h3>
          <div className="flex flex-col gap-3">
            {[
              { href: '/gallery', icon: RiGalleryLine, label: 'Gallery' },
              { href: '/devteam', icon: FaDev, label: 'DevTeam' },
              { href: '/members', icon: HiMiniUserGroup, label: 'Members' },
              { href: '/policy', icon: MdPrivacyTip, label: 'Privacy Policy' },
              {
                href: '/about',
                icon: FaGraduationCap,
                label: 'About Us'
              }
            ].map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center space-x-2 hover:text-blue-300 transition-colors"
              >
                <Icon />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Contact & Social */}
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-white border-b-2 border-blue-500 pb-2">Connect</h3>
          <div className="space-y-2">
            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <FaEnvelope />
                <span>aeroclub@nitkkr.ac.in</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaMapMarkerAlt />
                <span>NIT Kurukshetra, Haryana</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex space-x-4 pt-4">
              {[
                { Icon: FaInstagram, href: 'https://www.instagram.com/aeroclub.nitkkr/' },
                { Icon: FaLinkedin, href: 'https://www.linkedin.com/company/aero-club-nit-kurukshetra/' },
                { Icon: FaFacebook, href: 'https://www.facebook.com/aeromodellingnitkkr/' }
                // { Icon: FaTwitter, href: 'https://twitter.com' },
              ].map(({ Icon, href }) => (
                <Link
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  <Icon size={24} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-sm mt-4 pt-4 border-t border-blue-900 text-gray-400">
        &copy; {new Date().getFullYear()} Aero Club NIT Kurukshetra. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;