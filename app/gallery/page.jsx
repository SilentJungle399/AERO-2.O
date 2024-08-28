"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaFolder, FaPlus, FaCalendar, FaUser, FaTimes } from "react-icons/fa";
import Link from "next/link";

const AllAlbumsPage = () => {
  const [isAdmin,setAdmin]=useState(false);
  const [albums, setAlbums] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newAlbum, setNewAlbum] = useState({
    album_title: "",
    album_name: "",
    album_story: "",
  });

  useEffect(() => {
    const role=localStorage.getItem('role')
    if(role==='admin'){
      setAdmin(true);
    }
    console.log(role);
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      const baseUrl =
        process.env.NODE_ENV === "production"
          ? process.env.NEXT_PUBLIC_BACKEND_URL
          : "http://localhost:5000";
      const response = await fetch(`${baseUrl}/api/users/albums`);
      console.log("fuhskd");
      const data = await response.json();
      setAlbums(data);
    } catch (error) {
      console.error("Error fetching albums:", error);
    }
  };

  const handleInputChange = (e) => {
    setNewAlbum({ ...newAlbum, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("_id");
    try {
      const baseUrl =
        process.env.NODE_ENV === "production"
          ? process.env.NEXT_PUBLIC_BACKEND_URL
          : "http://localhost:5000";
      const response = await fetch(`${baseUrl}/api/users/createalbum`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...newAlbum, album_author: userId }),
        credentials: "include",
      });
      if (response.ok) {
        setShowModal(false);
        setNewAlbum({ album_title: "", album_name: "", album_story: "" });
        fetchAlbums();
      }
    } catch (error) {
      console.error("Error creating album:", error);
    }
  };

  const getRandomSize = () => {
    const sizes = ["small", "medium", "large"];
    return sizes[Math.floor(Math.random() * sizes.length)];
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white  ">

      <h1 className="text-3xl lg:text-5xl monoton mb-8 pt-28   bg-gradient-to-r from-blue-300 via-green-500 to-indigo-400 text-transparent bg-clip-text">
      &nbsp;&nbsp;&nbsp;Photos &nbsp;&nbsp;And &nbsp;&nbsp;videos &nbsp;&nbsp;Albums
      </h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="ml-3 mr-2  grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
      >
        {albums.map((album) => (
          <Link key={album._id} href={`/gallery/${album._id}`}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gray-700 rounded-lg shadow-lg overflow-hidden cursor-pointer"
            >
              <div className="relative h-48">
                <div className="grid grid-cols-3 gap-1 h-full">
                  {album.album_images.slice(0, 6).map((image, index) => {
                    const size = getRandomSize();
                    return (
                      <div
                        key={index}
                        className={`
                      ${
                        size === "small"
                          ? "col-span-1 row-span-1"
                          : size === "medium"
                          ? "col-span-1 row-span-2"
                          : "col-span-2 row-span-2"
                      }
                      overflow-hidden
                    `}
                      >
                        {image.file_type.includes("image") && (
                          <img
                            src={
                              image.url || "https://via.placeholder.com/300x200"
                            }
                            alt={`${album.album_name} image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <FaFolder className="text-6xl text-white opacity-75" />
                </div>
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">
                  {album.album_title}
                </h2>
                <div className="flex justify-between">
                <p className="text-gray-400 flex items-center">
                  <FaCalendar className="mr-2" />{" "}
                  {new Date(album.created_at).toLocaleDateString()}
                </p>
                <p className="text-gray-400 mb-2 flex items-center">
                  ~ by {album.album_author[0].full_name}
                </p>
                
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </motion.div>

      {isAdmin&&<motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 bg-purple-600 text-white w-16 h-16 rounded-full text-3xl shadow-lg flex items-center justify-center"
        onClick={() => setShowModal(true)}
      >
        <FaPlus />
      </motion.button>}

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="bg-gray-800 rounded-lg p-8 max-w-md w-full relative"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-2 right-2 text-gray-400 hover:text-white"
              >
                <FaTimes size={24} />
              </button>
              <h2 className="text-2xl font-bold mb-4">Create New Album</h2>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="album_title"
                  placeholder="Album Title"
                  value={newAlbum.album_title}
                  onChange={handleInputChange}
                  className="w-full mb-4 p-2 bg-gray-700 rounded text-white"
                />
                <input
                  type="text"
                  name="album_name"
                  placeholder="Album Name"
                  value={newAlbum.album_name}
                  onChange={handleInputChange}
                  className="w-full mb-4 p-2 bg-gray-700 rounded text-white"
                />
                <textarea
                  name="album_story"
                  placeholder="Album Story"
                  value={newAlbum.album_story}
                  onChange={handleInputChange}
                  className="w-full mb-4 p-2 bg-gray-700 rounded text-white h-32"
                ></textarea>
                <button
                  type="submit"
                  className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700 transition-colors"
                >
                  Create Album
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AllAlbumsPage;
