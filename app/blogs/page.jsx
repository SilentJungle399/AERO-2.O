"use client"
import Link from 'next/link';
import { useEffect, useState } from 'react';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const baseUrl = process.env.NODE_ENV === 'production'
          ? process.env.NEXT_PUBLIC_BACKEND_URL
          : 'http://localhost:5000';
        const response = await fetch(`${baseUrl}/api/users/getallblogs`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setBlogs(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchBlogs();
  }, []);

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Blogs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div key={blog._id} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">{blog.title}</h2>
            <p className="text-gray-700 mb-4">{blog.summary}</p>
            <div className="flex items-center text-gray-500 text-sm mb-4">
              <span className="mr-2">
                <svg className="w-4 h-4 inline-block" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm2 2h4a1 1 0 011 1v7.586l2.707-2.707a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L11 10.586V5a1 1 0 011-1zm-1 10a1 1 0 100 2 1 1 0 000-2z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </span>
              {new Date(blog.createdAt).toLocaleDateString()} &nbsp;|&nbsp; {blog.author.name}
            </div>
            <div className="text-gray-500 text-sm mb-4">
              Categories: {blog.categories.map(category => category.name).join(', ')}
            </div>
            <Link
              href={`/blogs/${blog._id}/${blog.slug}`}
              passHref
            >
              <div className="block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors duration-300">
                Read More
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blogs;
