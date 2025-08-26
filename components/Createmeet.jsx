// pages/create-meet.js
import {useState} from 'react';

export default function CreateMeet() {
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

  const handleChange = (e) => {
    const {name, value, type, checked} = e.target;
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
    const baseUrl =
      process.env.NODE_ENV === "production"
        ? ""
        : "http://localhost:5000";

    // Retrieve the token from local storage
    const token = localStorage.getItem('authToken');

    try {
      const response = await fetch(`${baseUrl}/api/users/createmeet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Add the authorization header
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        setStatusMessage('Meeting created successfully!');
        console.log('Response:', result);
      } else {
        const error = await response.text();
        setStatusMessage(`Error: ${error}`);
      }
    } catch (error) {
      setStatusMessage(`Network error: ${error.message}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Create Meeting</h1>
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

      {statusMessage && (
        <div className="mt-4 p-4 bg-gray-100 rounded-md">
          <p>{statusMessage}</p>
        </div>
      )}
    </div>
  );
}
