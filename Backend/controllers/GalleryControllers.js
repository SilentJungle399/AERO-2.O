const GalleryModel = require("../models/GalleryModel");

const createAlbum=async (req, res) => {
  try {
    const { album_story, album_name, album_title,album_author } = req.body;
    console.log(req.body)
    const newAlbum = new GalleryModel({
      album_story,
      album_name,
      album_title,
      album_author
    });
    await newAlbum.save();
    res.status(201).json(newAlbum);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

const addImageToAlbum = async (req, res) => {
    try {
      const album = await GalleryModel.findById(req.params.id);
      if (!album) {
        return res.status(404).json({ message: 'Album not found' });
      }
  
      const { fileDownloadURLs } = req.body;
  
      if (!fileDownloadURLs || !fileDownloadURLs.length) {
        return res.status(400).json({ message: 'No image URLs provided' });
      }
  
      fileDownloadURLs.forEach(({ downloadURL, file_type }) => {
        album.album_images.push({ url: downloadURL, file_type: file_type.contentType });
      });
  
      await album.save();
  
      res.status(200).json(album);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  

const getAllAlbums=async (req, res) => {
  try {
    const albums = await GalleryModel.find().populate('album_author', 'full_name');


    res.json(albums);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
const getAlbum=async (req, res) => {
    try {
        const id=req.params.id;
      const album = await GalleryModel.findById({_id:id}).populate('album_author', 'username');
      res.json(album);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  const handleLike = async (req, res) => {
    try {
        const { uid, album_id, id } = req.params;
        const image_id=id

        // Find the album by ID
        const album = await GalleryModel.findById(album_id);

        if (!album) {
            return res.status(404).json({ message: "Album not found" });
        }

        // Find the image within the album
        const image = album.album_images.id(image_id);

        if (!image) {
            return res.status(404).json({ message: "Image not found" });
        }

        // Check if the user has already liked the image
        if (image.image_likes.includes(uid)) {
            return res.status(400).json({ message: "User has already liked this image" });
        }

        // Add the user to the image_likes array
        image.image_likes.push(uid);

        // Save the updated album
        await album.save();

        res.json({ message: "Image liked successfully", album });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const handleView = async (req, res) => {
  try {
    const { album_id, id: image_id } = req.params;

    // Find the album by ID
    const album = await GalleryModel.findById(album_id);

    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }

    // Find the image within the album
    const image = album.album_images.id(image_id);

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Increment image_views safely
    image.image_views = (Number(image.image_views) || 0) + 1;

    // Save the updated album
    await album.save();

    res.json({ message: "Image views updated successfully", album });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {getAlbum,getAllAlbums,addImageToAlbum,createAlbum,handleLike,handleView}