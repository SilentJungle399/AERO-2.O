const express = require("express");
const User = require("../models/usermodel");
const InductionModel = require("../models/Inductions");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  createInduction,
  getAllInductions,
  getInduction,
  saveParticipants,
  getInductionforSelections,
  sendNotification,
} = require("../controllers/InductionController");
const {
  create_meet,
  getAllMeets,
  getMeet,
  markAttendance,
  endMeet,
} = require("../controllers/MeetsController");
const {
  createEvent,
  createTeam,
  joinTeam,
  getAllEvents,
  getEventById,
  checkToken,
} = require("../controllers/EventsController");
const {
  getAllCAtegories,
  addNewCategory,
  getOneCategory,
  updateCategory,
  deletecategory,
  getAllBlogs,
  createNewBlog,
  getOneBlog,
  updatedBlog,
  deleteBlog,
} = require("../controllers/BlogController");

const userRoutes = express.Router();

// Set up multer for handling file uploads
const multer = require("multer");
const { processUploads } = require("../middlewares/BlogMiddleware");
const { uploadMiddleware } = require("../controllers/uploadMiddleware");
const { getBlogPostBySlug } = require("../controllers/BlogController");
const { getAlbum, getAllAlbums, createAlbum, addImageToAlbum } = require("../controllers/GalleryControllers");
const { galleryUploadMiddleware } = require("../middlewares/GalleryUploadMiddleware");
const { showAllNotification, showOneNotification } = require("../controllers/NotificationsController");
const { getourmembers } = require("../controllers/Authentication");
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100*20 * 1024 * 1024, // limit file size to 5MB
  },
});


userRoutes.get("/notifications/:id",showAllNotification);

userRoutes.get("/getourmembers",getourmembers);

userRoutes.post("/:id/notifications",showOneNotification);

userRoutes.post("/createinduction", authMiddleware(["admin"]), createInduction);
userRoutes.get("/getallinduction", getAllInductions);
userRoutes.get("/getinduction/:id", getInduction);
userRoutes.get("/getinductionforselectingstudent/:id", getInductionforSelections);
userRoutes.post(
  "/register/:id",
  authMiddleware(["admin", "user","member","blogger"]),upload.array('ppt', 100),galleryUploadMiddleware,
  saveParticipants
);
userRoutes.post("/sendnotification/:id",authMiddleware(["admin"]),upload.array('notification_file',100),galleryUploadMiddleware,sendNotification);

//////////////////////////////////////////////////////////////////////////////////////////


userRoutes.post("/endmeet/:id",authMiddleware(["admin"]),endMeet)
userRoutes.post("/createmeet", authMiddleware(["admin"]), create_meet);
userRoutes.get("/getallmeets", getAllMeets);
userRoutes.get("/getmeets/:id", getMeet);
userRoutes.post("/scan-meet/:id", markAttendance);
userRoutes.post("/createevent", upload.single("E_main_img"),uploadMiddleware,createEvent);
userRoutes.post("/createteam/:id", createTeam);
userRoutes.post("/jointeam", joinTeam);
userRoutes.get("/getallevents", getAllEvents);
userRoutes.get("/event/:id", getEventById);
userRoutes.post("/checktoken", checkToken);

// //blog routes
// module.exports ={deletecategory,updateCategory,getOneCategory,addNewCategory,getAllCAtegories,deleteBlog,updatedBlog,getOneBlog,createNewBlog,getAllBlogs}
userRoutes.get("/getallcategories", getAllCAtegories);
userRoutes.post("/addnewcategory", addNewCategory);
userRoutes.get("/getonecategory/:id", getOneCategory);
userRoutes.post("/updatecategory/:id", updateCategory);
userRoutes.delete("/deletecategory/:id", deletecategory);

userRoutes.get("/getallblogs", getAllBlogs);
userRoutes.post("/addnewblog",upload.fields([
{ name: "main_image", maxCount: 1 },
{ name: "additional_images", maxCount: 5 },
]),processUploads,createNewBlog
);
// userRoutes.post("/addnewblog", createNewBlog);
userRoutes.get("/getoneblog/:slug", getBlogPostBySlug);
userRoutes.put("/updateoneblog/:slug", updatedBlog);
userRoutes.delete("/deleteblog/:id", deleteBlog);

//gallery routes
userRoutes.post('/createalbum', createAlbum);
// Upload multiple images to an album
userRoutes.post('/album/:id', upload.array('album_images', 100),galleryUploadMiddleware, addImageToAlbum);
// Get all albums
userRoutes.get('/albums', getAllAlbums);
// Get a specific album
userRoutes.get('/albums/:id', getAlbum);
// .............


// notifications route
// userRoutes.post('/sendnotifiacions',galleryUploadMiddleware,sen)

// Create a new user (Admin only)
userRoutes.post("/create", authMiddleware(["admin"]), async (req, res) => {
  const { full_name, roll_no, email, password, date_of_joining, role } =
    req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      full_name,
      roll_no,
      email,
      password: hashedPassword,
      date_of_joining,
      role,
    });

    await newUser.save();
    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// Read user details
userRoutes.get(
  "/:id",
  authMiddleware(["user", "member", "admin"]),
  async (req, res) => {
    try {
      const fields = 'full_name email roll_no year branch session college_name mobile_no profile_pic team_name current_post';
      const user = await User.findById(req.params.id).select(fields);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  }
);

userRoutes.post('/profile/:id', authMiddleware(["user", "member", "admin"]), upload.single('profile_file'), uploadMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
  
    
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (req.file && req.body.fileDownloadURL) {
      user.profile_pic = req.body.fileDownloadURL;
      await user.save();
    }

    res.status(200).json({
      message: "Profile picture updated successfully",
      profilePicUrl: user.profile_pic
    });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    res.status(500).json({
      message: "Error updating profile picture",
      error: error.message
    });
  }
});

// Update profile
userRoutes.patch('/update/:id', authMiddleware(["user", "member", "admin"]), async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const fields = 'full_name email roll_no year branch session college_name mobile_no profile_pic team_name current_post';
    const user = await User.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).select(fields);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: user
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      message: "Error updating profile",
      error: error.message
    });
  }
});




userRoutes.get(
  "/:id",
  authMiddleware(["user", "member"]),
  async (req, res) => {
    try {
      console.log("Fetching user data");

      // Define the fields you want to include in the response
      const fields = 'full_name email roll_no year branch session college_name mobile_no profile_pic team_name current_post';

      // Fetch the user with selected fields
      const user = await User.findById(req.params.id).select(fields);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  }
);


// Update user details (Admin or user themselves)
userRoutes.put(
  "/:id",
  authMiddleware(["user", "admin", "blogger"]),
  async (req, res) => {
    const { full_name, roll_no, email, password, date_of_joining, role } =
      req.body;

    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
      }

      user.full_name = full_name || user.full_name;
      user.roll_no = roll_no || user.roll_no;
      user.email = email || user.email;
      user.date_of_joining = date_of_joining || user.date_of_joining;
      user.role = role || user.role;

      await user.save();
      res.status(200).json({ message: "User updated successfully", user });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Failed to update user" });
    }
  }
);

// Delete user (Admin only)
userRoutes.delete("/:id", authMiddleware(["admin"]), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

module.exports = userRoutes;
