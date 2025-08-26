"use client";

import {useCallback, useEffect, useState} from "react";
import {useParams} from "next/navigation";
import {FaCalendarAlt, FaEye, FaThumbsUp, FaUser} from "react-icons/fa";
import AutoAdSense from '../../../components/AutoAdSense'

const BlogPage = () => {
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [userId, setUserId] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {slug} = useParams(); // Extract slug from URL params

  const fetchBlog = useCallback(async () => {
    try {
      setLoading(true);
      const baseUrl =
        process.env.NODE_ENV === "production"
          ? ""
          : "http://localhost:5000";
      const response = await fetch(`${baseUrl}/api/users/getoneblog/${slug}`);
      if (!response.ok) {
        throw new Error("Failed to fetch the blog");
      }
      const data = await response.json();
      setBlog(data);
      setComments(data.comments || []); // Assuming blog object has comments field
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    // Fetch user ID from local storage
    const storedUserId = localStorage.getItem("_id");
    if (storedUserId) {
      setUserId(storedUserId);
    }

    fetchBlog();
  }, [fetchBlog]);

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;

    try {
      const baseUrl =
        process.env.NODE_ENV === "production"
          ? ""
          : "http://localhost:5000";
      const response = await fetch(`${baseUrl}/api/blogs/${slug}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userId}`,
        },
        body: JSON.stringify({text: commentText}),
      });
      if (!response.ok) throw new Error("Failed to add comment");
      const newComment = await response.json();
      setComments([...comments, newComment]);
      setCommentText("");
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="container mx-auto p-4 pt-32">
      {blog && (
        <>
          <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-6">
            <div className="relative">
              <img
                src={blog.main_image}
                alt={blog.title}
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <h1 className="text-4xl font-bold text-white mb-4">{blog.title}</h1>
                <div className="flex items-center text-sm text-white space-x-4">
                  <span className="flex items-center">
                    <FaUser className="mr-2"/> {blog.author.name}
                  </span>
                  <span className="flex items-center">
                    <FaCalendarAlt className="mr-2"/> {new Date(blog.createdAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center">
                    <FaEye className="mr-2"/> {blog.views}
                  </span>
                  <span className="flex items-center">
                    <FaThumbsUp className="mr-2"/> {blog.upvotes.length}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-6">
              {blog.sections.map((section) => (
                <div
                  key={section.id}
                  className="mb-6"
                  style={{
                    backgroundColor: section.backgroundColor,
                    padding: section.padding,
                    margin: section.margin,
                    borderRadius: section.borderRadius
                  }}
                >
                  {section.headingText && (
                    <h2
                      className={`text-${section.headingSize} font-bold mb-4`}
                      style={{color: section.headingColor}}
                    >
                      {section.headingText}
                    </h2>
                  )}
                  {section.image && (
                    <img
                      src={section.image}
                      alt={section.headingText}
                      className={`w-full ${section.imageStyle.objectFit}`}
                      style={{
                        width: section.imageStyle.width,
                        height: section.imageStyle.height,
                        opacity: section.imageStyle.opacity
                      }}
                    />
                  )}
                  <div
                    className="text-gray-800"
                    dangerouslySetInnerHTML={{__html: section.content}}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">Comments</h2>
            {userId && (
              <div className="mb-6">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  rows="4"
                  placeholder="Add a comment..."
                ></textarea>
                <button
                  onClick={handleCommentSubmit}
                  className="mt-2 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
                >
                  Post Comment
                </button>
              </div>
            )}
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment._id} className="border-b border-gray-200 mb-4 pb-4">
                  <p className="font-semibold">{comment.author.name}</p>
                  <p className="text-gray-600">{comment.text}</p>
                </div>
              ))
            ) : (
              <p>No comments yet.</p>
            )}
          </div>
        </>
      )}
      <AutoAdSense/>

    </div>
  );
};

export default BlogPage;
