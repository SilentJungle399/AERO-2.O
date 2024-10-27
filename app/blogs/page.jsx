"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaEye, FaThumbsUp, FaUser, FaCalendarAlt, FaStar } from "react-icons/fa";
import AutoAdSense from '../../components/AutoAdSense'

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const baseUrl =
          process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_BACKEND_URL
            : "http://localhost:5000";
        const response = await fetch(`${baseUrl}/api/users/getallblogs`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        const sortedBlogs = data.sort((a, b) => b.views - a.views);
        setBlogs(sortedBlogs);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchBlogs();
  }, []);

  if (error) {
    return (
      <div className="container mx-auto p-4 text-red-500">Error: {error}</div>
    );
  }

  const renderBlogSection = (sectionBlogs) => {
    const [featured, ...others] = sectionBlogs;

    return (
      <div className="mb-8">
        {/* Featured Blog */}
        <Link href={`/blogs/${featured.slug}`} passHref>
  <div
    className="relative bg-cover bg-center h-96 shadow-lg overflow-hidden flex items-end mb-6 transform hover:scale-105 transition-transform duration-300"
    style={{ backgroundImage: `url(${featured.main_image})` }}
  >
    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60"></div>
    <div className="flex absolute top-0 left-0 m-4">
    <FaStar className="text-yellow-300"/>
    </div>
    <div className="absolute bottom-0 left-0 p-6">
      <h2 className="text-3xl font-bold text-white mb-4">
        {featured.title}
      </h2>
      <div className="flex items-center text-sm space-x-4 text-white">
        <span className="flex items-center">
          <FaUser className="mr-2" /> {featured.author.name}
        </span>
        <span className="flex items-center">
          <FaCalendarAlt className="mr-2" />{" "}
          {new Date(featured.createdAt).toLocaleDateString()}
        </span>
        <span className="flex items-center">
          <FaEye className="mr-2" /> {featured.views}
        </span>
        <span className="flex items-center">
          <FaThumbsUp className="mr-2" /> {featured.upvotes}
        </span>
      </div>
    </div>
  </div>
</Link>

        {/* Other Blogs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {others.map((blog) => (
            <Link href={`/blogs/${blog.slug}`} key={blog._id}>
            <div className="bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
              <div className="relative">
                <img
                  src={blog.main_image}
                  alt={blog.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60"></div>
                <div className="absolute bottom-0 left-0 p-4">
                  <h2 className="text-2xl font-bold text-white">{blog.title}</h2>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center text-gray-700 text-sm space-x-4">
                  <span className="flex items-center">
                    <FaUser className="mr-2" /> {blog.author.name}
                  </span>
                  <span className="flex items-center">
                    <FaCalendarAlt className="mr-2" />{" "}
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center">
                    <FaEye className="mr-2" /> {blog.views}
                  </span>
                  <span className="flex items-center">
                    <FaThumbsUp className="mr-2" /> {blog.upvotes}
                  </span>
                </div>
              </div>
            </div>
          </Link>
          ))}
        </div>
        <AutoAdSense />
      </div>
    );
  };

  return (
    <div className="ml-6 mr-4 text-left mx-auto  pt-32">
      <h1 className="text-5xl  monoton mb-8">
      &nbsp;&nbsp;&nbsp;OUR  &nbsp;&nbsp;&nbsp;CURATED &nbsp;&nbsp;&nbsp;BLOG&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;SECTION
      </h1>
      {blogs.reduce((acc, _, index) => {
        if (index % 4 === 0) {
          acc.push(renderBlogSection(blogs.slice(index, index + 4)));
        }
        return acc;
      }, [])}
    </div>
  );
};

export default Blogs;
