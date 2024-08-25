"use client";

import { useState, useEffect } from 'react';
import TimelineCard from '../../../components/TimelineCards';
import Loader from '@/components/Loader';

export default function AdminMeetListPage() {
  const [meets, setMeets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    meet_date: '',
    meet_time: '',
    meet_team_type: '',
    meet_venue: '',
    meet_description: '',
    meet_essentials: [],
    meet_mode: '',
  });
  const [statusMessage, setStatusMessage] = useState('');
  const [token, setToken] = useState("");

  useEffect(() => {
    const adminCheckToken = localStorage.getItem('token');
    setToken(adminCheckToken);
    console.log("adminCheckToken", adminCheckToken);

    fetchMeets(adminCheckToken);
  }, []);

  const fetchMeets = async (adminCheckToken) => {
    try {
      const baseUrl = process.env.NODE_ENV === 'production'
        ? process.env.NEXT_PUBLIC_BACKEND_URL
        : 'http://localhost:5000';
      const response = await fetch(`${baseUrl}/api/users/getallmeets`, {
        headers: {
          'Authorization': `Bearer ${adminCheckToken}`
        }
      });

      if (response.status === 401) {
        console.error('Unauthorized: Token may be invalid.');
        setStatusMessage('Unauthorized: Please log in again.');
        return;
      } else if (response.status === 403) {
        console.error('Forbidden: Insufficient permissions.');
        setStatusMessage('Forbidden: You do not have permission to view meets.');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch meets');
      }

      const data = await response.json();
      setMeets(data.sort((a, b) => new Date(a.meet_date).getTime() - new Date(b.meet_date).getTime()));
      console.log("Fetched meets:", data);
    } catch (error) {
      console.error('Error fetching meets:', error.message);
      setStatusMessage(`Error fetching meets: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prevData => ({
        ...prevData,
        meet_essentials: checked
          ? [...prevData.meet_essentials, value]
          : prevData.meet_essentials.filter(item => item !== value),
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      console.error('No token found');
      setStatusMessage('No authentication token found. Please log in again.');
      return;
    }

    const baseUrl = process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_BACKEND_URL
      : 'http://localhost:5000';

    try {
      const response = await fetch(`${baseUrl}/api/users/createmeet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 401) {
        console.error('Unauthorized: Token may be invalid.');
        setStatusMessage('Unauthorized: Please log in again.');
        return;
      } else if (response.status === 403) {
        console.error('Forbidden: Insufficient permissions.');
        setStatusMessage('Forbidden: You do not have permission to create meets.');
        return;
      }

      if (response.ok) {
        const result = await response.json();
        setMeets(prevMeets => [result, ...prevMeets]);
        setStatusMessage('Meeting created successfully!');
        setFormData({
          meet_date: '',
          meet_time: '',
          meet_team_type: '',
          meet_venue: '',
          meet_description: '',
          meet_essentials: [],
          meet_mode: '',
        });
        // setShowForm(false);
      } else {
        const error = await response.text();
        setStatusMessage(`Error creating meet: ${error}`);
      }
    } catch (error) {
      console.error('Network error:', error.message);
      setStatusMessage(`Network error: ${error.message}`);
    }
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-800 p-8">
      <h1 className="mt-16 text-4xl monoton mb-8 text-center text-white">Admin &nbsp;&nbsp;&nbsp; Meet&nbsp;&nbsp;&nbsp; Timeline</h1>
      
      <div className="max-w-4xl mx-auto mb-8">
        <button
          onClick={toggleForm}
          className="w-full py-2 px-4 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {showForm ? 'Close Form' : 'Create New Meeting'}
        </button>
      </div>

      {showForm && (
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">Create Meeting</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="meet_date" className="block text-gray-700">Meeting Date</label>
              <input
                type="date"
                id="meet_date"
                name="meet_date"
                value={formData.meet_date}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="meet_time" className="block text-gray-700">Meeting Time</label>
              <input
                type="text"
                id="meet_time"
                name="meet_time"
                value={formData.meet_time}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="meet_team_type" className="block text-gray-700">Team Type</label>
              <input
                type="text"
                id="meet_team_type"
                name="meet_team_type"
                value={formData.meet_team_type}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="meet_venue" className="block text-gray-700">Venue</label>
              <input
                type="text"
                id="meet_venue"
                name="meet_venue"
                value={formData.meet_venue}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="meet_description" className="block text-gray-700">Description</label>
              <textarea
                id="meet_description"
                name="meet_description"
                value={formData.meet_description}
                onChange={handleChange}
                rows="4"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <span className="block text-gray-700">Essentials</span>
              <label className="inline-flex items-center mt-2">
                <input
                  type="checkbox"
                  value="Laptop"
                  checked={formData.meet_essentials.includes('Laptop')}
                  onChange={handleChange}
                  className="form-checkbox"
                />
                <span className="ml-2">Laptop</span>
              </label>
              <label className="inline-flex items-center mt-2">
                <input
                  type="checkbox"
                  value="Notebook"
                  checked={formData.meet_essentials.includes('Notebook')}
                  onChange={handleChange}
                  className="form-checkbox"
                />
                <span className="ml-2">Notebook</span>
              </label>
              <label className="inline-flex items-center mt-2">
                <input
                  type="checkbox"
                  value="Pen"
                  checked={formData.meet_essentials.includes('Pen')}
                  onChange={handleChange}
                  className="form-checkbox"
                />
                <span className="ml-2">Pen</span>
              </label>
            </div>

            <div className="mb-4">
              <label htmlFor="meet_mode" className="block text-gray-700">Mode</label>
              <select
                id="meet_mode"
                name="meet_mode"
                value={formData.meet_mode}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              >
                <option value="">Select Mode</option>
                <option value="offline">Offline</option>
                <option value="online">Online</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Create Meeting
            </button>
          </form>
        </div>
      )}

      {statusMessage && (
        <div className="max-w-4xl mx-auto mt-4 p-4 bg-gray-100 rounded-md">
          <p>{statusMessage}</p>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {meets.length > 0 ? (
          meets.map((meet, index) => (
            <TimelineCard key={meet._id} meet={meet} index={index} />
          ))
        ) : (
          <p className="text-center text-white">No meetings found.</p>
        )}
      </div>
    </div>
  );
}