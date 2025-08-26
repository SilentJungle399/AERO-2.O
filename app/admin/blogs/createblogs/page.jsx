"use client";

import React, {useEffect, useState} from "react";
import Link from 'next/link';
import Cookies from 'js-cookie';
import {
  FaBars,
  FaCalendarAlt,
  FaCog,
  FaFileAlt,
  FaHeading,
  FaImage,
  FaPlane,
  FaSearchPlus,
  FaSignOutAlt,
  FaTags,
  FaTools,
  FaTrophy,
  FaUsers
} from 'react-icons/fa';
import Loader from '@/components/Loader'

const withAdminAuth = (WrappedComponent) => {
  const WithAdminAuth = (props) => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const checkAdmin = async () => {
        const token = Cookies.get('token');

        if (!token) {
          window.location.href = "/unauthorized";
          return;
        }

        try {
          const baseUrl = process.env.NODE_ENV === 'production'
            ? ""
            : 'http://localhost:5000';
          const response = await fetch(`${baseUrl}/api/auth/check-admin`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
          });

          const data = await response.json();
          if (data.isAdmin) {
            setIsLoading(false);
          } else {
            window.location.href = "/unauthorized";
          }
        } catch (error) {
          console.error('Error checking admin status:', error);
          window.location.href = "/unauthorized";
        }
      };

      checkAdmin();
    }, []);

    if (isLoading) {
      return <Loader/>;
    }

    return <WrappedComponent {...props} />;
  };

  // Set the display name for the HOC for better debugging and React DevTools
  WithAdminAuth.displayName = `WithAdminAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithAdminAuth;
};

const BlogForm = () => {
  const [formData, setFormData] = useState({
    uid: "",
    title: "",
    content: "",
    summary: "",
    main_image: null,
    tags: "",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    category: "",
    slug: ''
  });
  const [categories, setCategories] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const uid = localStorage.getItem("_id");
    setFormData((prevFormData) => ({
      ...prevFormData,
      uid: uid || "",
    }));
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/users/getallcategories"
        );
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const {name, value, type, files} = e.target;
    if (type === "file") {
      setFormData({
        ...formData,
        [name]: files[0],
      });
    } else {
      setFormData({...formData, [name]: value});
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const form = new FormData();
      for (const key in formData) {
        if (key === "tags" || key === "seoKeywords") {
          form.append(
            key,
            JSON.stringify(formData[key].split(",").map((item) => item.trim()))
          );
        } else {
          form.append(key, formData[key]);
        }
      }
      const response = await fetch(
        "http://localhost:5000/api/users/addnewblog",
        {
          method: "POST",
          body: form,
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Blog post created:", data);
        alert("Blog post created successfully!");
        // Reset form
        setFormData({
          uid: localStorage.getItem("_id"),
          title: "",
          content: "",
          summary: "",
          main_image: null,
          tags: "",
          seoTitle: "",
          seoDescription: "",
          seoKeywords: "",
          category: "",
          slug: ''
        });
      } else {
        throw new Error("Failed to create blog post");
      }
    } catch (error) {
      console.error("Error creating blog post:", error);
      alert("Failed to create blog post. Please try again.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black">
      {/* Sidebar */}
      <aside
        className={`bg-blue-800 pt-24 text-white w-full md:w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition duration-200 ease-in-out z-20`}>
        <div className="flex items-center justify-between px-4">
          <span className="text-2xl font-extrabold">AERO CLUB</span>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden">
            <FaBars className="text-white text-2xl"/>
          </button>
        </div>
        <nav className="mt-6">
          <Link href="/admin/blogs/editblog" className="flex items-center py-3 px-6 bg-blue-900">
            <FaPlane className="mr-3"/>
            Edit blogs
          </Link>
          <Link href="/admin/blogs/createblogs" className="flex items-center py-3 px-6 hover:bg-blue-700">
            <FaUsers className="mr-3"/>
            Create blogs
          </Link>
          <Link href="/admin/blogs/addcategory" className="flex items-center py-3 px-6 hover:bg-blue-700">
            <FaUsers className="mr-3"/>
            Add category
          </Link>
          <Link href="/admin/blogs/addsection" className="flex items-center py-3 px-6 hover:bg-blue-700">
            <FaCalendarAlt className="mr-3"/>
            Add sections
          </Link>
          <Link href="/admin/blogs/update" className="flex items-center py-3 px-6 hover:bg-blue-700">
            <FaTools className="mr-3"/>
            Update blogs
          </Link>
          <Link href="/admin/blogs/delete" className="flex items-center py-3 px-6 hover:bg-blue-700">
            <FaTrophy className="mr-3"/>
            Delete blogs
          </Link>
          <Link href="/admin/blogs/settings" className="flex items-center py-3 px-6 hover:bg-blue-700">
            <FaCog className="mr-3"/>
            Settings
          </Link>
        </nav>
        <div className="absolute bottom-0 w-64 p-6">
          <Link href="/logout" className="flex items-center text-white opacity-75 hover:opacity-100">
            <FaSignOutAlt className="mr-3"/>
            Logout
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 pt-24 flex flex-col overflow-hidden">
        {/* Top bar */}


        {/* Blog form */}
        <main className="flex-1  bg-black p-6">

          <form onSubmit={handleSubmit} className="mx-auto justify-center items-center space-y-8 max-w-3xl">
            {/* Title input */}
            <h1 className="text-3xl">Create new blog</h1>
            <div className="space-y-2">
              <label htmlFor="title" className="flex items-center text-sm font-medium text-gray-700">
                <FaHeading className="mr-2"/>
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-white border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors text-black"
                placeholder="Enter blog title"
              />
            </div>

            {/* Content textarea */}
            <div className="space-y-2">
              <label htmlFor="content" className="flex items-center text-sm font-medium text-gray-700">
                <FaFileAlt className="mr-2"/>
                Content
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows="8"
                className="w-full px-3 py-2 bg-white border-l-4 border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 rounded-lg text-black"
                placeholder="Write your blog content here..."
              ></textarea>
            </div>

            {/* Summary textarea */}
            <div className="space-y-2">
              <label htmlFor="summary" className="flex items-center text-sm font-medium text-gray-700">
                <FaFileAlt className="mr-2"/>
                Summary
              </label>
              <textarea
                id="summary"
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                required
                rows="3"
                className="w-full px-3 py-2 bg-white border-l-4 border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 rounded-lg text-black"
                placeholder="Provide a brief summary of your blog post"
              ></textarea>
            </div>

            {/* Main Image input */}
            <div className="space-y-2">
              <label htmlFor="main_image" className="flex items-center text-sm font-medium text-gray-700">
                <FaImage className="mr-2"/>
                Main Image
              </label>
              <input
                type="file"
                id="main_image"
                name="main_image"
                onChange={handleChange}
                required
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            {/* Slug input */}
            <div className="space-y-2">
              <label htmlFor="slug" className="flex items-center text-sm font-medium text-gray-700">
                <FaTags className="mr-2"/>
                Slug
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors text-black"
                placeholder="Enter slug for your blog-page"
              />
            </div>

            {/* Tags input */}
            <div className="space-y-2">
              <label htmlFor="tags" className="flex items-center text-sm font-medium text-gray-700">
                <FaTags className="mr-2"/>
                Tags
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors text-black"
                placeholder="Enter tags separated by commas"
              />
            </div>

            {/* SEO Title input */}
            <div className="space-y-2">
              <label htmlFor="seoTitle" className="flex items-center text-sm font-medium text-gray-700">
                <FaSearchPlus className="mr-2"/>
                SEO Title
              </label>
              <input
                type="text"
                id="seoTitle"
                name="seoTitle"
                value={formData.seoTitle}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors text-black"
                placeholder="Enter SEO-friendly title"
              />
            </div>

            {/* SEO Description textarea */}
            <div className="space-y-2">
              <label htmlFor="seoDescription" className="flex items-center text-sm font-medium text-gray-700">
                <FaSearchPlus className="mr-2"/>
                SEO Description
              </label>
              <textarea
                id="seoDescription"
                name="seoDescription"
                value={formData.seoDescription}
                onChange={handleChange}
                rows="2"
                className="w-full px-3 py-2 bg-white border-l-4 border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-200 rounded-lg text-black"
                placeholder="Enter SEO description"
              ></textarea>
            </div>

            {/* SEO Keywords input */}
            <div className="space-y-2">
              <label htmlFor="seoKeywords" className="flex items-center text-sm font-medium text-gray-700">
                <FaSearchPlus className="mr-2"/>
                SEO Keywords
              </label>
              <input
                type="text"
                id="seoKeywords"
                name="seoKeywords"
                value={formData.seoKeywords}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors text-black"
                placeholder="Enter SEO keywords separated by commas"
              />
            </div>

            {/* Categories dropdown */}
            <div className="space-y-2">
              <label htmlFor="category" className="flex items-center text-sm font-medium text-gray-700">
                <FaUsers className="mr-2"/>
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-white border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              >
                <option value="" disabled>Select a category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end pt-6">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
              >
                Publish Blog Post
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default withAdminAuth(BlogForm);
