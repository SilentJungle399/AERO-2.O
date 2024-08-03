"use client"

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users/getallblogs');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setBlogs(data);
        const uniqueCategories = ['All', ...new Set(data.flatMap(blog => blog.categories.map(cat => cat.name)))];
        setCategories(uniqueCategories);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchBlogs();
  }, []);

  const filteredBlogs = selectedCategory === 'All' 
    ? blogs 
    : blogs.filter(blog => blog.categories.some(cat => cat.name === selectedCategory));

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto relative">
        <motion.h1 
          className="text-5xl font-extrabold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Explore Our Blogs
        </motion.h1>
        
        <motion.div 
          className="flex justify-center mb-12 space-x-2 overflow-x-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full text-sm font-medium ${
                selectedCategory === category
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              } transition-colors duration-300 transform hover:scale-105`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {filteredBlogs.map((blog, index) => (
            <motion.div
              key={blog._id}
              className="bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition duration-500 hover:scale-105 hover:rotate-1 perspective-1000"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ 
                rotateY: 5,
                rotateX: 5,
                scale: 1.05,
                transition: { duration: 0.3 }
              }}
            >
              <div className="relative h-48">
                <Image
                  src={blog.main_image || '/placeholder.jpg'}
                  alt={blog.title}
                  layout="fill"
                  objectFit="cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <h2 className="text-2xl font-bold text-white text-center px-4">{blog.title}</h2>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-300 mb-4 line-clamp-3">{blog.summary}</p>
                <div className="flex items-center mb-4">
                  
                  <div>
                    <p className="font-medium text-purple-400">author:{blog.author.name}</p>
                    <p className="text-sm text-gray-400">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {blog.categories.map(category => (
                    <span key={category.name} className="bg-gray-700 text-purple-300 text-xs px-2 py-1 rounded-full">
                      {category.name}
                    </span>
                  ))}
                </div>
                <Link href={`editblog/${blog.slug}`} passHref>
                  <div className="block bg-purple-600 hover:bg-purple-700 text-white text-center px-4 py-2 rounded-lg transition-colors duration-300 transform hover:scale-105">
                    Read More
                  </div>
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Blogs;