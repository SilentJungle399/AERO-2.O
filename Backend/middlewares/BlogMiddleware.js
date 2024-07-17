const { initializeApp } = require("firebase/app");
const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} = require("firebase/storage");
const firebaseConfig = require("../Firebseconfig/FirebaseConfig");
const multer = require("multer");

// Initialize Firebase
initializeApp(firebaseConfig);
const storage = getStorage();

// Multer configuration for parsing multipart form data
const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage });

const uploadMiddleware = upload.fields([
  { name: "main_image", maxCount: 1 },
  { name: "additional_images", maxCount: 5 },
]);

const processUploads = async (req, res, next) => {
  try {
    const dateTime = new Date().toISOString();
    
    // Function to upload a single file
    const uploadFile = async (file, index = '') => {
      const fileName = `blog_images/${file.originalname}_${index}_${dateTime}`;
      const storageRef = ref(storage, fileName);
      const metadata = { contentType: file.mimetype };
      
      const snapshot = await uploadBytesResumable(storageRef, file.buffer, metadata);
      return await getDownloadURL(snapshot.ref);
    };

    // Upload main image
    if (req.files['main_image']) {
      const mainImageFile = req.files['main_image'][0];
      req.body.main_image = await uploadFile(mainImageFile);
    }

    // Upload additional images
    if (req.files['additional_images']) {
      req.body.additional_images = await Promise.all(
        req.files['additional_images'].map((file, index) => uploadFile(file, index))
      );
    }
    console.log(req.body.additional_images)
    console.log('Files successfully uploaded.');
    next();
  } catch (error) {
    console.error('Error in processUploads:', error);
    res.status(500).json({ message: 'Internal server error during file upload' });
  }
};

module.exports = { uploadMiddleware, processUploads };