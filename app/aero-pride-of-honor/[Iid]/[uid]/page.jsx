"use client";

import React, { useState, useEffect } from "react";
import { Camera } from "lucide-react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";

const InstagramShareBadge = () => {
  const [badgeData, setBadgeData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { Iid, uid } = useParams();

  useEffect(() => {
    const fetchBadgeData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const baseUrl = process.env.NODE_ENV === 'production'
        ? process.env.NEXT_PUBLIC_BACKEND_URL
        : 'http://localhost:5000';
        
        // Construct the exact URL as provided
        const apiUrl = `${baseUrl}/api/users/induction/${Iid}/inductee/${uid}`;

        console.log("Fetching data from:", apiUrl);

        const response = await fetch(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        console.log(response)
        // if (!response.ok) {
        //   const errorText = await response.text();
        //   throw new Error(`Failed to fetch badge data: ${response.status} ${response.statusText}\n${errorText}`);
        // }

        const data = await response.json();
        console.log("Received data:", data);
        setBadgeData(data);
      } catch (error) {
        console.error("Error fetching badge data:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (Iid && uid) {
      fetchBadgeData();
    } else {
      console.error("Missing Iid or uid");
      setError("Missing induction or inductee ID");
      setIsLoading(false);
    }
  }, [Iid, uid]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!badgeData) {
    return <div className="text-red-500">No data available</div>;
  }

  const handleShare = async () => {
    const shareUrl = `https://aeronitkkr.in/aero-pride-of-honor/${uid}`;
    const shareText = `Check out ${badgeData.name}'s profile on AeroNIT!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "AeroNIT Profile",
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      const instagramUrl = `https://www.instagram.com/share?url=${encodeURIComponent(shareUrl)}`;
      window.open(instagramUrl, "_blank");
    }
  };

  return (
    <motion.div
      className="mt-52 max-w-sm mx-auto bg-white shadow-lg rounded-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-6">
        <h2 className="text-2xl text-black font-bold mb-2">{badgeData.name}</h2>
        <p className="text-gray-600 mb-4">{badgeData.team}</p>
        <motion.div
          className="mb-4"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ yoyo: Infinity, duration: 1.5 }}
        >
          <img
            src={badgeData.imageUrl || "https://firebasestorage.googleapis.com/v0/b/aeromodelling-faeee.appspot.com/o/sy.jpg?alt=media&token=c033de6b-166f-40e2-8448-51ef6c334ec5"}
            alt={badgeData.full_name}
            className="w-full h-48 object-cover rounded"
          />
        </motion.div>
        <motion.button
          onClick={handleShare}
          className="flex items-center justify-center w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-2 px-4 rounded hover:from-purple-600 hover:to-pink-600 transition-colors duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Camera className="mr-2" size={20} />
          Share Profile
        </motion.button>
      </div>
    </motion.div>
  );
};

export default InstagramShareBadge;