// Firebase
const { initializeApp } = require("firebase/app");
const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} = require("firebase/storage");
const firebaseConfig = require("../Firebseconfig/FirebaseConfig");
// Initialize Firebase
initializeApp(firebaseConfig);
const storage = getStorage();
const uploadMiddleware = async (req, res, next) => {
    try {
      

     // Get the current date and time for creating a unique file name
      const dateTime = new Date().toISOString();
  
      // Initialize Firebase Storage
      const storage = getStorage();
  
      // Create a reference to the storage bucket with a unique file name
      const storageRef = ref(storage, `files/${req.file.originalname + "       " + dateTime}`);
  
      // Create file metadata including the content type
      const metadata = {
        contentType: req.file.mimetype,
      };
  
      // Upload the file to the storage bucket
      const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);
  
      // Get the public URL of the uploaded file
      const downloadURL = await getDownloadURL(snapshot.ref);
  
      // Store the download URL in the request object
      req.body = {
        ...req.body,
        fileDownloadURL: downloadURL
      };
      next();
    } catch (error) {
      console.error('Error in uploadMiddleware:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
module.exports={uploadMiddleware}