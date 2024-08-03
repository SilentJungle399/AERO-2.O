"use client"
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaCog, FaPlane, FaSignOutAlt,FaBars, FaTools, FaTrophy, FaUsers } from 'react-icons/fa';

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    parent: '',
  });
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users/getallcategories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else {
        throw new Error('Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleNewCategoryChange = (e) => {
    const { name, value } = e.target;
    setNewCategory({ ...newCategory, [name]: value });
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
        // http://localhost:5000/api/users/getmeets/667b077f0533150ac1e19a78
      const response = await fetch('http://localhost:5000/api/users/addnewcategory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCategory),
      });

      if (response.ok) {
        const addedCategory = await response.json();
        setCategories([...categories, addedCategory]);
        setNewCategory({ name: '', description: '', parent: '' });
        alert('Category added successfully!');
      } else {
        throw new Error('Failed to add category');
      }
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Failed to add category. Please try again.');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100 ">
      {/* Sidebar */}
      <aside className={`bg-blue-800 text-white w-full md:w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition duration-200 ease-in-out z-20`}>
        <div className="flex items-center justify-between px-4">
          <span className="text-2xl font-extrabold">AERO CLUB</span>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden">
            <FaBars className="text-white text-2xl" />
          </button>
        </div>
        <nav className="mt-6">
          <Link href="/admin/blogs/published" className="flex items-center py-3 px-6 bg-blue-900">
            <FaPlane className="mr-3" />
            Published blogs
          </Link>
          <Link href="/admin/blogs/createblogs" className="flex items-center py-3 px-6 hover:bg-blue-700">
            <FaUsers className="mr-3" />
            Create blogs
          </Link>
          <Link href="/admin/blogs/addcategory" className="flex items-center py-3 px-6 hover:bg-blue-700">
            <FaUsers className="mr-3" />
            Add category
          </Link>
          <Link href="/admin/blogs/addsection" className="flex items-center py-3 px-6 hover:bg-blue-700">
            <FaCalendarAlt className="mr-3" />
            Add sections
          </Link>
          <Link href="/admin/blogs/update" className="flex items-center py-3 px-6 hover:bg-blue-700">
            <FaTools className="mr-3" />
            Update blogs
          </Link>
          <Link href="/admin/blogs/delete" className="flex items-center py-3 px-6 hover:bg-blue-700">
            <FaTrophy className="mr-3" />
            Delete blogs
          </Link>
          <Link href="/admin/blogs/settings" className="flex items-center py-3 px-6 hover:bg-blue-700">
            <FaCog className="mr-3" />
            Settings
          </Link>
        </nav>
        <div className="absolute bottom-0 w-64 p-6">
          <Link href="/logout" className="flex items-center text-white opacity-75 hover:opacity-100">
            <FaSignOutAlt className="mr-3" />
            Logout
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden">
            <FaBars className="text-blue-800 text-xl" />
          </button>
          <h1 className="text-xl font-semibold text-blue-800">Category Manager</h1>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 hidden md:inline">Welcome, Admin</span>
            <img src="/avatar.png" alt="Admin" className="h-8 w-8 rounded-full" />
          </div>
        </header>

        {/* Category form */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8">
          <form onSubmit={handleAddCategory} className=" mx-auto space-y-12">
            <h2 className="text-3xl font-bold text-blue-800 mb-8">Create New Category</h2>

            {/* Category Name */}
            <div className="space-y-4">
              <label htmlFor="name" className="block text-lg font-semibold text-gray-500">Category Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={newCategory.name}
                onChange={handleNewCategoryChange}
                required
                className="w-full px-4 py-3 text-lg bg-white bg-opacity-50 rounded-lg shadow-inner focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-200"
                placeholder="e.g., Aircraft Design"
              />
              <p className="text-sm text-gray-500 italic">Choose a clear and concise name for your category.</p>
            </div>

            {/* Category Description */}
            <div className="space-y-4">
              <label htmlFor="description" className="block text-lg font-semibold text-gray-500">Category Description</label>
              <textarea
                id="description"
                name="description"
                value={newCategory.description}
                onChange={handleNewCategoryChange}
                rows="5"
                className="w-full px-4 py-3 text-lg bg-white bg-opacity-50 rounded-lg shadow-inner focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-200"
                placeholder="Provide a brief description of the category..."
              ></textarea>
              <p className="text-sm text-gray-500 italic">A good description helps users understand the category&apos;s purpose.</p>
            </div>

            {/* Parent Category */}
            <div className="space-y-4">
              <label htmlFor="parent" className="block text-lg font-semibold text-blue-700">Parent Category</label>
              <select
                id="parent"
                name="parent"
                value={newCategory.parent}
                onChange={handleNewCategoryChange}
                className="w-full px-4 py-3 text-lg bg-white bg-opacity-50 rounded-lg shadow-inner focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-200"
              >
                <option value="">None (Top-level Category)</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>{category.name}</option>
                ))}
              </select>
              <p className="text-sm text-gray-500 italic">Select a parent category to create a hierarchy, or leave as None for a top-level category.</p>
            </div>

            {/* Submit button */}
            <div className="pt-8">
              <button
                type="submit"
                className="w-full md:w-auto px-8 py-4 bg-blue-600 text-white text-lg font-bold rounded-full hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transform hover:scale-105 transition duration-200 ease-in-out"
              >
                Create Category
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default CategoryManager;