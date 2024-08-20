const { authDomain } = require("../Firebseconfig/FirebaseConfig");
const {
  sendVerificationEmail,
  sendSignupEmailNotification,
} = require("../middlewares/nodemailerMiddleware");
const OtpVerification = require("../models/OtpVerification");
const User = require("../models/usermodel");
// const bcrypt = require("bcrypt");

var admin = require("firebase-admin");

var serviceAccount = require("../Firebseconfig/Servicekeys.json")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});





const getourmembers = async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find();

    // Return the users in the response
    res.status(200).json(users);
  } catch (error) {
    // Handle any errors that might occur
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};


const googleSignup = async (req, res) => {
  const firebase_token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header

  if (!firebase_token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(firebase_token);
    const { uid, email, name } = decodedToken;

    // Check if the user already exists in the database
    let user = await User.findOne({ email: email });

    



    let profile_picture=` https://avatar.iran.liara.run/username?username=${name[0]}`;
    if (!user) {
        console.log(profile_picture);
    if(name.split(' ').length>1){
      let firstletter=name.split(' ')[0];
        let lastletter=name.split(' ')[1];
        profile_picture=` https://avatar.iran.liara.run/username?username=${firstletter[0]}+${lastletter[0]}`;
        console.log(profile_picture);
    }

      // If the user does not exist, create a new user
      user = new User({
        googleId: uid,
        email,
        full_name:name,
        profile_pic:profile_picture
      });

      await user.save(); // Save the user to the database
    }


    let expiresIn;
    switch (user.role) {
      case "admin":
        expiresIn = 6 * 60 * 60 * 1000; // 6 hours in milliseconds
        break;
      case "blogger":
        expiresIn = 24 * 60 * 60 * 1000; // 1 day in milliseconds
        break;
      default:
        expiresIn = 50 * 24 * 60 * 60 * 1000; // 50 days in milliseconds
    }

    const token = user.generateAuthToken({ expiresIn });
    const _id = user._id;
    const full_name = user.full_name;
    let profile_pic = user.profile_pic;
    const role=user.role;


    // Set the cookie
    res.cookie("token", token, {
      httpOnly: false, // Allow client-side access for development
      maxAge: expiresIn,
      path: "/",
      sameSite: "lax",
      secure: false, // Allow over HTTP for development
    });

    // Ensure the cookie is set before sending the response
    res.setHeader("Set-Cookie", res.getHeader("Set-Cookie"));

    // Send the response after setting the cookie
    res.status(200).json({ token, _id, full_name, profile_pic,role});
    // Respond with the user data
    // res.status(200).json({
    //   message: 'User signed in successfully',
    //   user,
    // });
  } catch (error) {
    console.error('Error during Google sign-in:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


const uploadProfile = async (req, res) => {
  try {
    const _id = req.user_id;
    const profile_pic = req.fileDownloadURL; // Assuming req.fileDownloadURL holds the URL of the uploaded file
    const user = await User.findOne({ _id });
    if (user) {
      user.profile_pic = profile_pic;
      await user.save(); // Save the updated user object
      res.status(200).json({ success: true, message: "Profile picture updated successfully",profile_pic:profile_pic});
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error("Error updating profile picture:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP
}

const emailVerification = async (req, res) => {
  const { full_name, email } = req.body;
  if (email) {
    try {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(409).json({ err: "Email already exists" });
      }

      // Generate OTP with timestamp
      const otp = generateOTP();

      // Send email with OTP
      try {
        await sendVerificationEmail(email, otp);
        console.log("Email sent successfully");
        // Check if OTP exists for the email
        const existingOtp = await OtpVerification.findOne({ email });

        if (existingOtp) {
          // Update existing OTP
          existingOtp.otp = otp;
          await existingOtp.save();
        } else {
          // Create new OTP entry
          const newOtp = new OtpVerification({
            email,
            otp,
            full_name,
          });
          await newOtp.save();
        }

        return res.status(200).json({ msg: "OTP sent successfully" });
      } catch (error) {
        console.log("Error sending email5:", error);
        return res
          .status(500)
          .json({ err: "Failed to send verification email" });
      }
    } catch (error) {
      console.log("Error:", error);
      return res.status(500).json({ err: "Internal server error" });
    }
  } else {
    return res.status(400).json({ err: "Please use your college email id" });
  }
};

const otpcheck = async (req, res) => {
  try {
    console.log("Request body:", req.body);

    let { email, otp } = req.body;
    email = email.trim();

    console.log("Email:", email);
    console.log("OTP before parsing:", otp);

    // Ensure otp is always treated as a string
    otp = Array.isArray(otp) ? parseInt(otp.join("")) : parseInt(otp);
    console.log("OTP after parsing:", otp);

    console.log("Querying database for email:", email);

    // First, find the document without updating it
    const verificationDoc = await OtpVerification.findOne({ email: email });

    console.log("Initial verification result:", verificationDoc);

    if (!verificationDoc) {
      console.log("No OTP verification document found for email:", email);
      return res.status(404).json({ err: "OTP verification document not found" });
    }

    // Check if the OTP matches
    if (verificationDoc.otp !== otp) {
      console.log(verificationDoc.otp)
      console.log(otp)
      console.log("OTP mismatch for email:", email);
      return res.status(400).json({ err: "Invalid OTP" });
    }

    // Check if the OTP has expired (assuming 10 minutes expiration)
    if (verificationDoc.createdAt < new Date(Date.now() - 10 * 60 * 1000)) {
      console.log("OTP expired for email:", email);
      return res.status(400).json({ err: "OTP has expired" });
    }

    // If everything is valid, update the status
    verificationDoc.status = true;
    await verificationDoc.save();

    console.log("Updated verification document:", verificationDoc);

    return res.status(200).json({ message: "OTP verified successfully" });

  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ err: "Internal server error" });
  }
};

const Signup = async (req, res) => {
  const { email, password ,gender} = req.body;
  console.log("email");

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const verification = await OtpVerification.findOne({ email: email });
    if (!verification) {
      return res.status(404).json({ err: "OTP verification not found" });
    }

    const full_name = verification.full_name;

    console.log("Verification:", verification);

    if (!verification || !verification.status) {
      return res.status(404).json({ err: "Email not verified" });
    }
     await verification.deleteOne({email});
    const date_of_joining = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    let profile_picture=` https://avatar.iran.liara.run/username?username=${full_name[0]}`;
        console.log(profile_picture);
    if(full_name.split(' ').length>1){
      let firstletter=full_name.split(' ')[0];
        let lastletter=full_name.split(' ')[1];
        profile_picture=` https://avatar.iran.liara.run/username?username=${firstletter[0]}+${lastletter[0]}`;
        console.log(profile_picture);
    }
    const newUser = new User({
      full_name,
      email,
      gender,
      password,
      date_of_joining,
      profile_pic:profile_picture,
    });

    const savedUser = await newUser.save();
    const token = savedUser.generateAuthToken();
    if (savedUser) {
      sendSignupEmailNotification(savedUser.full_name, savedUser.email);
    }

    res.status(201).json({ token, user: savedUser });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ error: "Failed to signup" });
  }
};

const Login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email" });
    }
    console.log(user)
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    let expiresIn;
    switch (user.role) {
      case "admin":
        expiresIn = 6 * 60 * 60 * 1000; // 6 hours in milliseconds
        break;
      case "blogger":
        expiresIn = 24 * 60 * 60 * 1000; // 1 day in milliseconds
        break;
      default:
        expiresIn = 50 * 24 * 60 * 60 * 1000; // 50 days in milliseconds
    }

    const token = user.generateAuthToken({ expiresIn });
    const _id = user._id;
    const full_name = user.full_name;
    const profile_pic = user.profile_pic;
    const role=user.role;

    // Set the cookie
    res.cookie("token", token, {
      httpOnly: false, // Allow client-side access for development
      maxAge: expiresIn,
      path: "/",
      sameSite: "lax",
      secure: false, // Allow over HTTP for development
    });

    // Ensure the cookie is set before sending the response
    res.setHeader("Set-Cookie", res.getHeader("Set-Cookie"));

    // Send the response after setting the cookie
    res.status(200).json({ token, _id, full_name, profile_pic,role});
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Failed to login" });
  }
};

const logout = async (req, res) => {
  try {
    console.log("logout");
    // Clear the JWT cookie
    res.clearCookie("token");

    // Optionally, destroy the session if you're using sessions
    // req.session.destroy();

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error logging out:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { getourmembers,Signup, Login, logout, emailVerification, otpcheck,uploadProfile,googleSignup};
