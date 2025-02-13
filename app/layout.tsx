import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "../components/ClientLayout";
import Script from 'next/script';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aero Club || NIT KURUKSHETRA",
  description: "We think >> we build >> we innnovate >>.Join NIT Kurukshetra's Aeromodeling Club for exploring the realm of diving deeper into the skies of your aviation dream.",
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: "AeroModelling Club || NIT KURUKSHETRA",
    description: "We think >> we build >> we innnovate >>.Join NIT Kurukshetra's Aeromodeling Club for exploring the realm of diving deeper into the skies of your aviation dream.",
    url: "https://aeronitkkr.in",
    siteName: "AeroModelling Club",
    images: [
      {
        url: '/aeronewlogo.jpg',
        width: 1200,
        height: 630,
        alt: 'AeroModelling Club at NIT Kurukshetra',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Codystar:wght@300;400&family=Monoton&family=Fuggles&display=swap"
          rel="stylesheet"
        />
        <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet"/>
        <link 
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" 
          rel="stylesheet"
        />
        <link 
          href="https://fonts.googleapis.com/css2?family=Headland+One&display=swap" 
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        
        {/* Open Graph meta tags */}
        <meta property="og:title" content="AeroModelling Club || NIT KURUKSHETRA" />
        <meta property="og:description" content="Join NIT Kurukshetra's Aeromodeling Club to explore aviation dreams. Think, build, and innovate with our vibrant community." />
        <meta property="og:url" content="https://aeronitkkr.in" />
        <meta property="og:image" content="/favicon.ico" />
        <meta property="og:site_name" content="AeroModelling Club" />
      </head>
      <body className={inter.className}>
        <Script
          async
          src="https://pagead.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2566086108871666"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}