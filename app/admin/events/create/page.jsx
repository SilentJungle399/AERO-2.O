"use client"
import { useState } from 'react';

const CreateEvent = () => {
  

  // ... (keep all the handler functions as they were)\
  const [formData, setFormData] = useState({
    E_name: '',
    E_guidelines: [''],
    E_mini_description: '',
    E_description: '',
    E_location: '',
    E_timings: '',
    E_date: '',
    deadline: '',
    E_perks: '',
    E_team_size: '',
    E_fee_type: '',
    E_fee: '',
    E_domain: '',
    E_main_img: null
  });
  const [message, setMessage] = useState('');
//   const router = useRouter();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'E_main_img') {
      setFormData((prevData) => ({ ...prevData, [name]: files[0] }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleGuidelineChange = (index, value) => {
    const newGuidelines = [...formData.E_guidelines];
    newGuidelines[index] = value;
    setFormData((prevData) => ({ ...prevData, E_guidelines: newGuidelines }));
  };

  const addGuideline = () => {
    setFormData((prevData) => ({ ...prevData, E_guidelines: [...prevData.E_guidelines, ''] }));
  };

  const removeGuideline = (index) => {
    const newGuidelines = formData.E_guidelines.filter((_, i) => i !== index);
    setFormData((prevData) => ({ ...prevData, E_guidelines: newGuidelines }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSubmit = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === 'E_guidelines') {
        formDataToSubmit.append(key, JSON.stringify(formData[key]));
      } else {
        formDataToSubmit.append(key, formData[key]);
      }
    });

    try {
      const response = await fetch('http://localhost:5000/api/users/createevent', {
        method: 'POST',
        body: formDataToSubmit,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Event created successfully!');
        // router.push('/events');
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-full mx-auto bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 pt-6">Create Event</h1>
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <div className="space-y-2">
            <label htmlFor="E_name" className="block text-sm font-medium text-gray-700">Event Name</label>
            <input
              type="text"
              id="E_name"
              name="E_name"
              value={formData.E_name}
              onChange={handleChange}
              className="w-full px-3 py-2 text-gray-700 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="E_main_img" className="block text-sm font-medium text-gray-700">Event Image</label>
            <input
              type="file"
              id="E_main_img"
              name="E_main_img"
              onChange={handleChange}
              className="w-full px-3 py-2 text-gray-700 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Guidelines</label>
            {formData.E_guidelines.map((guideline, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={guideline}
                  onChange={(e) => handleGuidelineChange(index, e.target.value)}
                  placeholder={`Guideline ${index + 1}`}
                  className="flex-grow px-3 py-2 text-gray-700 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => removeGuideline(index)}
                  className="text-red-500 font-bold"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addGuideline}
              className="mt-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
            >
              Add Guideline
            </button>
          </div>

          <div className="space-y-2">
            <label htmlFor="E_mini_description" className="block text-sm font-medium text-gray-700">Mini Description</label>
            <textarea
              id="E_mini_description"
              name="E_mini_description"
              value={formData.E_mini_description}
              onChange={handleChange}
              className="w-full px-3 py-2 text-gray-700 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="E_description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="E_description"
              name="E_description"
              value={formData.E_description}
              onChange={handleChange}
              className="w-full px-3 py-2 text-gray-700 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="E_location" className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                id="E_location"
                name="E_location"
                value={formData.E_location}
                onChange={handleChange}
                className="w-full px-3 py-2 text-gray-700 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="E_timings" className="block text-sm font-medium text-gray-700">Timings</label>
              <input
                type="text"
                id="E_timings"
                name="E_timings"
                value={formData.E_timings}
                onChange={handleChange}
                className="w-full px-3 py-2 text-gray-700 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="E_date" className="block text-sm font-medium text-gray-700">Event Date</label>
              <input
                type="date"
                id="E_date"
                name="E_date"
                value={formData.E_date}
                onChange={handleChange}
                className="w-full px-3 py-2 text-gray-700 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">Deadline</label>
              <input
                type="date"
                id="deadline"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full px-3 py-2 text-gray-700 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="E_perks" className="block text-sm font-medium text-gray-700">Perks</label>
            <input
              type="text"
              id="E_perks"
              name="E_perks"
              value={formData.E_perks}
              onChange={handleChange}
              className="w-full px-3 py-2 text-gray-700 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="E_team_size" className="block text-sm font-medium text-gray-700">Team Size</label>
              <input
                type="number"
                id="E_team_size"
                name="E_team_size"
                value={formData.E_team_size}
                onChange={handleChange}
                className="w-full px-3 py-2 text-gray-700 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="E_fee_type" className="block text-sm font-medium text-gray-700">Fee Type</label>
              <select
                id="E_fee_type"
                name="E_fee_type"
                value={formData.E_fee_type}
                onChange={handleChange}
                className="w-full px-3 py-2 text-gray-700 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                required
              >
                <option value="">Select Fee Type</option>
                <option value="free">Free</option>
                <option value="paid">Paid</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="E_fee" className="block text-sm font-medium text-gray-700">Fee</label>
              <input
                type="number"
                id="E_fee"
                name="E_fee"
                value={formData.E_fee}
                onChange={handleChange}
                className="w-full px-3 py-2 text-gray-700 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="E_domain" className="block text-sm font-medium text-gray-700">Domain</label>
              <input
                type="text"
                id="E_domain"
                name="E_domain"
                value={formData.E_domain}
                onChange={handleChange}
                className="w-full px-3 py-2 text-gray-700 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300"
          >
            Create Event
          </button>
        </form>
        {message && <p className="mt-4 text-center text-gray-700">{message}</p>}
      </div>
    </div>
  );
};

export default CreateEvent;