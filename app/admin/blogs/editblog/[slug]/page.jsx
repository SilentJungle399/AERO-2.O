"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import BlogSection from "../../components/BlogSection";
import AddSectionModal from "../../components/AddSectionModal";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useParams } from "next/navigation";
import Cookies from 'js-cookie';
import Loader from '@/components/Loader'
const DynamicColorPicker = dynamic(
  () => import("../../components/ColorPicker"),
  { ssr: false }
);

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
            ? process.env.NEXT_PUBLIC_BACKEND_URL
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
            // window.location.href = "/unauthorized";
          }
        } catch (error) {
          console.error('Error checking admin status:', error);
          window.location.href = "/unauthorized";
        }
      };

      checkAdmin();
    }, []);

    if (isLoading) {
      return <Loader/>
    }

    return <WrappedComponent {...props} />;
  };

  // Set the display name for the HOC for better debugging and React DevTools
  WithAdminAuth.displayName = `WithAdminAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithAdminAuth;
};

const EditBlogPost = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [blogSections, setBlogSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchBlog = useCallback(async () => {
    try {
      setLoading(true);
      const baseUrl = process.env.NODE_ENV === 'production'
            ? process.env.NEXT_PUBLIC_BACKEND_URL
            : 'http://localhost:5000';
      const response = await fetch(
        `${baseUrl}/api/users/getoneblog/${slug}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch the blog");
      }
      const data = await response.json();
      console.log(data)
      setBlog(data);
      setBlogSections(data.sections || []);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchBlog();
  }, [fetchBlog]);

  const addSection = (newSection) => {
    setBlogSections((prevSections) => [...prevSections, newSection]);
    setIsAddModalOpen(false);
  };

  const updateSection = (index, updatedSection) => {
    setBlogSections((prevSections) => {
      const newSections = [...prevSections];
      newSections[index] = updatedSection;
      return newSections;
    });
  };

  const moveSection = (dragIndex, hoverIndex) => {
    setBlogSections((prevSections) => {
      const newSections = [...prevSections];
      const [reorderedItem] = newSections.splice(dragIndex, 1);
      newSections.splice(hoverIndex, 0, reorderedItem);
      return newSections;
    });
  };

  const deleteSection = (index) => {
    setBlogSections((prevSections) => prevSections.filter((_, i) => i !== index));
  };

  const publishBlog = async () => {
    try {
      setLoading(true);
      const baseUrl = process.env.NODE_ENV === 'production'
            ? process.env.NEXT_PUBLIC_BACKEND_URL
            : 'http://localhost:5000';
      const response = await fetch(
        `${baseUrl}/api/users/updateoneblog/${slug}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sections: blogSections }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update the blog");
      }
      const data = await response.json();
      setBlog(data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-900 p-24">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-100">
          Edit Blog Post
        </h1>
        <div className="mx-auto text-gray-900 bg-white shadow-lg rounded-lg overflow-hidden">
          {blog && (
            <div className="p-6">
              <h2 className="text-3xl font-bold mb-4">{blog.title}</h2>
              <div className="text-gray-800 mb-4">{blog.content}</div>
              {blog.main_image && (
                <div className="mb-4">
                  <img src={blog.main_image} alt="Blog" className="w-full rounded-lg" />
                </div>
              )}
            </div>
          )}
          {blogSections.map((section, index) => (
            <BlogSection
              key={section.id || index}
              section={section}
              index={index}
              updateSection={updateSection}
              moveSection={moveSection}
              deleteSection={deleteSection}
            />
          ))}
          <div className="p-6">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition duration-300 text-lg font-semibold"
            >
              Add New Section
            </button>
          </div>
        </div>
        <AddSectionModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={addSection}
        />
        <div className="mt-6">
          <button
            onClick={publishBlog}
            className="w-full bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition duration-300 text-lg font-semibold"
          >
            Publish Changes
          </button>
        </div>
      </div>
    </DndProvider>
  );
};

// Set the display name for the EditBlogPost component
EditBlogPost.displayName = 'EditBlogPost';

export default withAdminAuth(EditBlogPost);
