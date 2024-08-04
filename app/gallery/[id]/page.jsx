"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";
import { FaPlus, FaHeart, FaEye, FaTimes } from "react-icons/fa";

const AlbumPage = () => {
  const [album, setAlbum] = useState(null);
  const [showImageForm, setShowImageForm] = useState(false);
  const [newImages, setNewImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const id = useParams().id;

  useEffect(() => {
    if (id) {
      fetchAlbum();
    }
  }, [id]);

  const fetchAlbum = async () => {
    try {
      const response = await fetch(
        `process.env.BACKEND_ROUTE/api/users/albums/${id}`
      );
      const data = await response.json();
      setAlbum(data);
    } catch (error) {
      console.error("Error fetching album:", error);
    }
  };

  const handleImageChange = (e) => {
    setNewImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newImages.length === 0) return;

    const formData = new FormData();
    newImages.forEach((image) => {
      formData.append("album_images", image);
    });

    try {
      await fetch(`process.env.BACKEND_ROUTE/api/users/album/${id}`, {
        method: "POST",
        body: formData,
      });
      setShowImageForm(false);
      fetchAlbum();
    } catch (error) {
      console.error("Error adding images:", error);
    }
  };

  const handleImageClick = async (image) => {
    setSelectedImage(image);
    // Increase view count
    try {
      await fetch(`process.env.BACKEND_ROUTE/api/images/${image.id}/view`, {
        method: "POST",
      });
      // Update local state
      setAlbum((prevAlbum) => ({
        ...prevAlbum,
        album_images: prevAlbum.album_images.map((img) =>
          img.id === image.id ? { ...img, views: img.views + 1 } : img
        ),
      }));
    } catch (error) {
      console.error("Error incrementing view count:", error);
    }
  };

  const handleLike = async (image) => {
    try {
      await fetch(`process.env.BACKEND_ROUTE/api/images/${image.id}/like`, {
        method: "POST",
      });
      // Update local state
      setAlbum((prevAlbum) => ({
        ...prevAlbum,
        album_images: prevAlbum.album_images.map((img) =>
          img.id === image.id ? { ...img, likes: img.likes + 1 } : img
        ),
      }));
    } catch (error) {
      console.error("Error liking image:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      {album && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto mt-24"
        >
          <h1 className="text-4xl font-bold mb-4">{album.album_title}</h1>
          <p className="text-xl text-gray-400 mb-8">{album.album_name}</p>

          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Album Story</h2>
            <p className="text-gray-300">{album.album_story}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {album.album_images.map((image, index) => (
              <motion.div
                key={index}
                className="relative group cursor-pointer"
                style={{
                  gridRow: `span ${Math.floor(Math.random() * 2) + 1}`,
                  gridColumn: `span ${Math.floor(Math.random() * 2) + 1}`,
                }}
                whileHover={{ scale: 1.05 }}
                onClick={() => handleImageClick(image)}
              >
                {image.file_type.includes("image") && (
                  <img
                    src={image.url}
                    alt={`Album image ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                )}
                {image.file_type.includes("video") && (
                  <video
                    src={image.url}
                    alt={`Album video ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                    controls
                  />
                )}
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <FaHeart className="text-3xl text-red-500 mr-2" />
                  <span>{image.likes}</span>
                  <FaEye className="text-3xl text-blue-500 ml-4 mr-2" />
                  <span>{image.views}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="mt-8 bg-purple-600 text-white px-6 py-3 rounded-full text-lg shadow-lg flex items-center justify-center mx-auto"
        onClick={() => setShowImageForm(true)}
      >
        <FaPlus className="mr-2" /> Add New Image
      </motion.button>

      <AnimatePresence>
        {showImageForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-gray-800 rounded-lg p-8 max-w-md w-full"
            >
              <h2 className="text-2xl font-bold mb-4">Add New Images</h2>
              <form onSubmit={handleSubmit}>
                <input
                  type="file"
                  name="album_images"
                  onChange={handleImageChange}
                  className="w-full mb-4 p-2 border border-gray-700 rounded bg-gray-700 text-white"
                  multiple
                />
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowImageForm(false)}
                    className="mr-2 px-4 py-2 bg-gray-700 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 rounded"
                  >
                    Add Images
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50"
          >
            <div className="absolute top-3 left-4 flex items-center">
                <button
                  onClick={() => handleLike(selectedImage)}
                  className="flex items-center text-red-500 px-4 py-2 rounded-full mr-4"
                >
                  <FaHeart className="mr-2" /> {selectedImage.likes}
                </button>
                <div className="flex items-center text-blue-500">
                  <FaEye className="mr-2" /> {selectedImage.views}
                </div>
              </div>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="relative justify-center max-w-4xl w-full"
            >
              {selectedImage.file_type.includes("image")&&<img
                src={selectedImage.url}
                alt="Selected image"
                className="w-full h-auto  rounded-lg"
              />}
              {selectedImage.file_type.includes("video") && (
                  <video
                    src={selectedImage.url}
                    alt={`Album video`}
                    className="w-full h-full object-cover"
                    controls
                  />
                )}
              {/* <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-3 right-2 text-red-500 text-2xl"
              >
                <FaTimes />
              </button> */}
              {/* <div className="absolute top-3 left-4 flex items-center">
                <button
                  onClick={() => handleLike(selectedImage)}
                  className="flex items-center text-red-500 px-4 py-2 rounded-full mr-4"
                >
                  <FaHeart className="mr-2" /> {selectedImage.likes}
                </button>
                <div className="flex items-center text-blue-500">
                  <FaEye className="mr-2" /> {selectedImage.views}
                </div>
              </div> */}
            </motion.div>
            <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-3 right-2 text-red-500 text-2xl"
              >
                <FaTimes />
              </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AlbumPage;
