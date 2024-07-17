// In your uploadMiddleware file
const { initializeApp } = require("firebase/app");
const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} = require("firebase/storage");
const firebaseConfig = require("../Firebseconfig/FirebaseConfig");

initializeApp(firebaseConfig);
const storage = getStorage();

const galleryUploadMiddleware = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const uploadPromises = req.files.map(async (file) => {
      const dateTime = new Date().toISOString();
      const storageRef = ref(storage, `files/${file.originalname + "       " + dateTime}`);
      
      const metadata = {
        contentType: file.mimetype,
      };

      const snapshot = await uploadBytesResumable(storageRef, file.buffer, metadata);
      const downloadURL = await getDownloadURL(snapshot.ref);
      const file_type=metadata;


      return {downloadURL,file_type};
    });

    const downloadURLs = await Promise.all(uploadPromises);

    console.log(downloadURLs);
    req.body.fileDownloadURLs = downloadURLs;
    

    console.log('Files successfully uploaded.');
    next();
  } catch (error) {
    console.error('Error in uploadMiddleware:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { galleryUploadMiddleware };