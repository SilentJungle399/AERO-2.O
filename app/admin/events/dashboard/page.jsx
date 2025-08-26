"use client";
import React, {useEffect, useState} from 'react';
import Link from 'next/link';
import {FaCalendarAlt, FaClock, FaMapMarkerAlt, FaMouse} from 'react-icons/fa';

const EventsDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const baseUrl = process.env.NODE_ENV === 'production'
          ? ""
          : 'http://localhost:5000';
        const response = await fetch(`${baseUrl}/api/users/getAllEvents`);
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        setEvents(data.events);
      } catch (error) {
        console.error('Error fetching events:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const sortedEvents = [...events].sort((a, b) => new Date(a.E_date) - new Date(b.E_date));

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mt-16 mb-16">
          <h1 className="text-5xl font-bold mb-4 animate-fade-in-down">Event Dashboard</h1>
          <h3 className="text-2xl text-gray-300 animate-fade-in-up">All Upcoming Events</h3>
        </div>
        <div className="flex flex-col ">
          {sortedEvents.map(event => (
            <div key={event._id}
                 className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105">
              <img src={event.E_main_img || "/default-event.jpg"} alt={event.E_name}
                   className="w-full h-48 object-cover"/>
              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-2">{event.E_name}</h3>
                <p className="text-gray-300 mb-4">{event.E_mini_description}</p>
                <div className="flex flex-col space-y-2 text-sm text-gray-300 mb-4">
                  <p><FaMapMarkerAlt className="inline mr-2 text-red-500"/>{event.E_location}</p>
                  <p><FaClock className="inline mr-2 text-yellow-500"/>{event.E_timings}</p>
                  <p><FaCalendarAlt
                    className="inline mr-2 text-green-500"/>{new Date(event.E_date).toLocaleDateString()}</p>
                  <p className={`flex items-center ${event.active_status ? "text-green-400" : "text-red-400"}`}>
                    <FaMouse className="mr-2"/>
                    {event.active_status ? "Active now" : "Registration closed"}
                  </p>
                </div>
                <Link
                  href={`/admin/events/dashboard/${event._id}/manage`}
                  className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-300"
                >
                  Manage Event
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className='flex m-4  items-center justify-center'>
          <Link
            className='bg-green-500 font-bold p-4 rounded-lg font-mono transform transition-transform duration-300 ease-in-out hover:scale-110 '
            href="/admin/events/create">Create Event</Link>
        </div>
      </div>
    </div>
  );
};

export default EventsDashboard;