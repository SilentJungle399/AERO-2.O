"use client";

import {useEffect, useState} from 'react';
import {useParams} from 'next/navigation';
import {FaBell, FaDownload, FaFile, FaImage, FaVideo} from 'react-icons/fa';

const Notification = () => {
  const {id} = useParams();
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchNotification(id);
    }
  }, [id]);

  const fetchNotification = async (notificationId) => {
    const userId = localStorage.getItem("_id"); // Retrieve user ID from localStorage

    if (!userId) {
      console.error("User ID not found in localStorage");
      return;
    }

    try {
      const baseUrl = process.env.NODE_ENV === 'production'
        ? ""
        : 'http://localhost:5000';
      const response = await fetch(`${baseUrl}/api/users/${notificationId}/notifications`, {
        method: 'POST', // Use POST method to send the request body
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({userId}) // Send userId in the request body
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Error fetching notification');
        return;
      }

      const data = await response.json();
      setNotification(data);
    } catch (error) {
      setError('Error fetching notification');
    } finally {
      setLoading(false);
    }
  };


  if (loading) return <p className="text-center mt-10 text-white">Loading...</p>;
  if (error) return <p className="text-center text-red-400 mt-10">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className=" mx-auto mt-44">
        <div className="flex items-center mb-8">
          <FaBell className="w-12 h-12 text-yellow-400 mr-4"/>
          <h1 className="text-3xl font-bold text-white">{notification.notifications_title}</h1>
        </div>
        <div className="mb-8 bg-gray-800 rounded-lg p-6">
          {notification.notifications_text.map((text, index) => (
            <p key={index} className="mb-4 text-gray-300">{text}</p>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {notification.notificaitons_files.map((file, index) => (
            <div key={index} className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  {file.file_type.includes('image') && <FaImage className="text-blue-400 mr-2"/>}
                  {file.file_type.includes('pdf') && <FaFile className="text-red-400 mr-2"/>}
                  {file.file_type.includes('video') && <FaVideo className="text-green-400 mr-2"/>}
                  <span className="text-lg font-semibold">File {index + 1}</span>
                </div>
                <a
                  href={file.url}
                  download
                  target="_blank"
                  className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-300"
                >
                  <FaDownload className="mr-2"/>
                  Download
                </a>
              </div>
              {file.file_type.includes('image') && (
                <img
                  src={file.url}
                  alt={`File ${index}`}
                  className="w-full h-48 object-cover rounded mb-4"
                />
              )}
              {file.file_type.includes('pdf') && (
                <div className="relative w-full h-80 mb-4">
                  <iframe
                    src={file.url}
                    title={`PDF Preview ${index}`}
                    className="absolute inset-0 w-full h-full rounded"
                    frameBorder="0"
                  />
                </div>
              )}
              {file.file_type.includes('video') && (
                <video src={file.url} controls className="w-full rounded mt-4"/>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notification;
