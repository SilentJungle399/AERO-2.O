"use client"
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { FaUser, FaCalendar, FaShareAlt } from 'react-icons/fa';

const BlogPost = () => {
  const { id, slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    if (slug) {
      fetchBlog();
      fetchRelatedPosts();
    }
  }, [slug]);

  const fetchBlog = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/getoneblog/${id}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setBlog(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchRelatedPosts = async () => {
    // Simulated fetch for related posts
    setRelatedPosts([
      { id: 1, title: "Understanding Aerodynamics", image: "/aerodynamics.jpg" },
      { id: 2, title: "The Future of Electric Aircraft", image: "/electric-aircraft.jpg" },
      { id: 3, title: "Innovations in Drone Technology", image: "/drone-tech.jpg" },
    ]);
  };

  if (error) return <div className="text-red-500 text-center py-10">Error: {error}</div>;
  if (!blog) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="relative h-screen">
        <Image 
          src={blog.main_image || '/default-blog-image.jpg'} 
          alt={blog.title} 
          layout="fill" 
          objectFit="cover" 
          className="brightness-50"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center p-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 max-w-4xl">{blog.title}</h1>
          <div className="flex items-center space-x-6 text-lg">
            <span className="flex items-center"><FaUser className="mr-2" />{blog.author.name}</span>
            <span className="flex items-center"><FaCalendar className="mr-2" />{new Date(blog.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Summary */}
        <p className="text-2xl text-gray-600 mb-12 leading-relaxed">{blog.summary}</p>

        {/* Blog Content */}
        <article className="prose prose-lg max-w-none">
          <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        </article>

        {/* Tags */}
        <div className="mt-12 flex flex-wrap gap-2">
          {blog.tags.map((tag, index) => (
            <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">{tag}</span>
          ))}
        </div>

        {/* Share Button */}
        <div className="mt-12 flex justify-center">
          <button className="bg-black text-white px-6 py-3 rounded-full flex items-center space-x-2 hover:bg-gray-800 transition duration-300">
            <FaShareAlt />
            <span>Share this article</span>
          </button>
        </div>
      </div>

      {/* Author Bio */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 flex items-center">
          <Image 
            src={blog.author.avatar || '/default-avatar.png'} 
            alt={blog.author.name} 
            width={80} 
            height={80} 
            className="rounded-full mr-6"
          />
          <div>
            <h3 className="text-2xl font-semibold mb-2">{blog.author.name}</h3>
            <p className="text-gray-600">{blog.author.bio}</p>
          </div>
        </div>
      </div>

      {/* Related Posts */}
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">More to Explore</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedPosts.map(post => (
              <div key={post.id} className="group">
                <div className="relative h-64 mb-4">
                  <Image src={post.image} alt={post.title} layout="fill" objectFit="cover" className="rounded-lg" />
                </div>
                <h3 className="text-xl font-semibold group-hover:underline">{post.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;