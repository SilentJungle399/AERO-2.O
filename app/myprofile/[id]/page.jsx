"use client";
import {useParams} from 'next/navigation';
import React, {useEffect, useState} from 'react';
import {FaEdit} from 'react-icons/fa';

const MyProfile = () => {
  const {id} = useParams();
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState({
    full_name: '',
    email: '',
    roll_no: '',
    year: '',
    branch: '',
    session: '',
    college_name: '',
    mobile_no: '',
    profile_pic: '',
    team_name: '',
    current_post: '',
  });
  useEffect(() => {
    console.log(id)
    if (!id)
      window.location.href = "/";
    fetchUserData();
  }, [id]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');
      const baseUrl = process.env.NODE_ENV === 'production'
        ? ""
        : 'http://localhost:5000';
      const response = await fetch(`${baseUrl}/api/users/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch user data');

      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleInputChange = (e) => {
    setUser({...user, [e.target.name]: e.target.value});
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('profile_file', file);
      setLoading(true)
      try {
        const token = localStorage.getItem('token');
        const baseUrl = process.env.NODE_ENV === 'production'
          ? ""
          : 'http://localhost:5000';
        const response = await fetch(`${baseUrl}/api/users/profile/${id}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });

        if (!response.ok) throw new Error('Failed to upload profile picture');

        const {profilePicUrl} = await response.json();
        setUser({...user, profile_pic: profilePicUrl});
        localStorage.setItem("profile_pic", profilePicUrl)
      } catch (error) {
        console.error('Error uploading profile picture:', error);
        alert('Failed to upload profile picture.');
      } finally {
        setLoading(false)
        window.location.reload()
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const baseUrl = process.env.NODE_ENV === 'production'
        ? ""
        : 'http://localhost:5000';
      const response = await fetch(`${baseUrl}/api/users/update/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) throw new Error('Failed to update profile');

      const updatedUser = await response.json();
      setUser(updatedUser.user);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    }
  };


  return (
    <div className="bg-black min-h-screen py-24 px-4 sm:px-6 lg:px-8 lg:py-24">
      <div className="max-w-4xl mx-auto bg-gray-800 shadow-xl rounded-lg overflow-hidden">
        <div className="bg-blue-900 h-[400px] flex items-center justify-center">
          <div className="  mb-8 relative">
            <div className="relative pt-12  ml-auto max-md:pt-12 mb-3">
              <img
                src={user.profile_pic || "/default-avatar.png"}
                alt="Profile Picture"
                width={200}
                height={200}
                className="rounded-full object-cover w-56 h-56 border-4  border-blue-600 mb-4 sm:mb-0 sm:mr-8"
              />
              <button
                type="button"
                className="absolute bottom-9 w-10 h-10 right-5 lg:right-8 p-2  text-white rounded-full"
                onClick={() => document.getElementById('profile-pic-input').click()}
              >
                {loading ? <div
                  className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                  role="status">
                  <span
                    className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                  >Loading...</span
                  >
                </div> : <FaEdit className='w-10 h-10  text-yellow-300'/>}
              </button>
            </div>
            <div className='text-center'>
              <h2 className="text-2xl font-semibold text-white">{user.full_name}</h2>
              <p className="text-gray-400">{user.current_post} - {user.team_name} Team</p>
            </div>
          </div>

        </div>

        <div className="p-8 bg-gray-900">


          <form onSubmit={handleSubmit} className="space-y-6 text-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {Object.keys(user)
                .filter(key => key !== 'profile_pic' && key !== '_id' && key !== 'email' && key !== 'roll_no' && key !== 'college_name' && key !== 'branch' && key !== 'current_post' && key !== 'team_name') // Exclude fields
                .map(key => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-300 capitalize">
                      {key.replace('_', ' ')}
                    </label>
                    <input
                      type={key === 'email' ? 'email' : 'text'}
                      name={key}
                      value={user[key]}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-b border-gray-600 focus:border-blue-500 focus:ring-0 sm:text-sm bg-gray-900 text-gray-300"
                    />
                  </div>
                ))}
            </div>

            <input
              type="file"
              id="profile-pic-input"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Display current_post and team_name fields as disabled */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 capitalize">Current Post</label>
                <input
                  type="text"
                  name="current_post"
                  value={user.current_post || ''}
                  disabled
                  className="mt-1 block w-full border-b border-gray-600 bg-gray-800 text-gray-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 capitalize">Team Name</label>
                <input
                  type="text"
                  name="team_name"
                  value={user.team_name || ''}
                  disabled
                  className="mt-1 block w-full border-b border-gray-600 bg-gray-800 text-gray-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 capitalize">Current Post</label>
                <input
                  type="text"
                  name="current_post"
                  value={user.current_post || ''}
                  disabled
                  className="mt-1 block w-full border-b border-gray-600 bg-gray-800 text-gray-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 capitalize">Email</label>
                <input
                  type="text"
                  name="current_post"
                  value={user.email || ''}
                  disabled
                  className="mt-1 block w-full border-b border-gray-600 bg-gray-800 text-gray-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 capitalize"> Branch</label>
                <input
                  type="text"
                  name="current_post"
                  value={user.branch || ''}
                  disabled
                  className="mt-1 block w-full border-b border-gray-600 bg-gray-800 text-gray-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 capitalize">College name</label>
                <input
                  type="text"
                  name="current_post"
                  value={user.college_name || ''}
                  disabled
                  className="mt-1 block w-full border-b border-gray-600 bg-gray-800 text-gray-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 capitalize">Roll no</label>
                <input
                  type="text"
                  name="current_post"
                  value={user.roll_no || ''}
                  disabled
                  className="mt-1 block w-full border-b border-gray-600 bg-gray-800 text-gray-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 capitalize">Current Post</label>
                <input
                  type="text"
                  name="current_post"
                  value={user.current_post || ''}
                  disabled
                  className="mt-1 block w-full border-b border-gray-600 bg-gray-800 text-gray-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 capitalize">session</label>
                <input
                  type="text"
                  name="current_post"
                  value={user.session || ''}
                  disabled
                  className="mt-1 block w-full border-b border-gray-600 bg-gray-800 text-gray-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 capitalize">Team name</label>
                <input
                  type="text"
                  name="current_post"
                  value={user.team_name || ''}
                  disabled
                  className="mt-1 block w-full border-b border-gray-600 bg-gray-800 text-gray-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Update Profile
              </button>
            </div>
          </form>


        </div>
      </div>
    </div>
  );
};

export default MyProfile;
