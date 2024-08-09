"use client";

import { useState, useEffect } from 'react';
import TimelineCard from '../../../components/TimelineCards';
import Loader from '@/components/Loader'
export default function AdminMeetListPage  () {
  const [meets, setMeets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeets = async () => {
      try {
        const baseUrl = process.env.NODE_ENV === 'production' 
          ? process.env.NEXT_PUBLIC_BACKEND_URL 
          : 'http://localhost:5000';
        const response = await fetch(`${baseUrl}/api/users/getallmeets`);
        if (!response.ok) {
          throw new Error('Failed to fetch meets');
        }
        const data = await response.json();
        setMeets(data.sort((a, b) => new Date(a.meet_date).getTime() - new Date(b.meet_date).getTime()));
      } catch (error) {
        console.error('Error fetching meets:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMeets();
  }, []);

  if (loading) {
    return <Loader/>
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Admin Meet Timeline</h1>
      <div className="max-w-4xl mx-auto">
        {meets.map((meet, index) => (
          <TimelineCard key={meet._id} meet={meet} index={index} />
        ))}
      </div>
    </div>
  );
};


