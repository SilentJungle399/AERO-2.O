const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const MeetModel = require('../models/MeetsModel');

// Firebase
const { initializeApp } = require("firebase/app");
const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject
} = require("firebase/storage");
const firebaseConfig = require("../Firebseconfig/FirebaseConfig");

// Initialize Firebase
initializeApp(firebaseConfig);
const storage = getStorage();

const generateQRCodeForMeet = async function (meet) {
  try {
    // Delete previous QR code if exists
    if (meet.meet_qr_code) {
      try {
        const previousQRCodeRef = ref(storage, meet.meet_qr_code);
        await deleteObject(previousQRCodeRef);
        console.log('Previous QR code deleted successfully');
      } catch (deleteError) {
        console.log('Error deleting previous QR code:', deleteError);
      }
    }

    // Generate new token and QR code data
    const token = uuidv4();
    const qrCodeData = `https://aeronitkkr.in/api/users/scan-meet/${meet._id}?token=${token}`;

    // Generate QR code as a buffer
    const qrCodeBuffer = await QRCode.toBuffer(qrCodeData);

    // Upload new QR code to Firebase Storage
    const qrCodeRef = ref(storage, `qr-codes/${meet._id}.png`);
    const uploadTask = uploadBytesResumable(qrCodeRef, qrCodeBuffer);

    await uploadTask;

    // Get the download URL
    const downloadURL = await getDownloadURL(qrCodeRef);

    // Update meet document with new QR code URL and token
    meet.meet_qr_code = downloadURL;
    meet.qr_code_token = token;
    await meet.save();

    return downloadURL;
  } catch (error) {
    console.error('Error generating and uploading QR code:', error);
    throw error;
  }
};

const create_meet = async (req, res) => {
  try {
    const { meet_date, meet_time, meet_team_type, meet_venue, meet_description, meet_essentials, meet_mode } = req.body;

    const meet = new MeetModel({
      meet_date,
      meet_time,
      meet_team_type,
      meet_venue,
      meet_description,
      meet_essentials,
      meet_mode
    });

    // Generate QR code for the new meet
    const qrCode = await generateQRCodeForMeet(meet);
    console.log('Generated QR Code:', qrCode);

    res.json({ meet, qrCode });
  } catch (error) {
    console.error('Error creating meet:', error);
    res.status(500).send('Internal Server Error');
  }
};

const markAttendance = async (req, res) => {
  const { id } = req.params;
  const { uid, token } = req.body;
  console.log("Marking attendance");

  try {
    const meet = await MeetModel.findById(id);

    if (!meet) {
      return res.status(404).json({ success: false, message: 'Meet not found' });
    }

    if (meet.qr_code_token !== token) {
      return res.status(400).json({ success: false, message: 'Invalid token' });
    }

    if (!meet.participants_ids.includes(uid)) {
      meet.participants_ids.push(uid);

      // Generate a new QR code and upload to Firebase
      const newQrCode = await generateQRCodeForMeet(meet);

      return res.json({ success: true, message: 'Attendance marked successfully', newQrCode });
    } else {
      return res.status(400).json({ success: false, message: 'Attendance already marked' });
    }
  } catch (error) {
    console.error('Error marking attendance:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};


const getAllMeets = async (req, res) => {
  try {
    // Fetch all meets sorted by meet_date in ascending order
    const meets = await MeetModel.find().sort({ meet_date: 1 });

    res.json(meets);
  } catch (error) {
    console.error('Error fetching meets:', error);
    res.status(500).send('Internal Server Error');
  }
}

const getMeet = async (req, res) => {
  try {
    console.log(req.params.id)
    const meet = await MeetModel.findById(req.params.id)
      .populate({
        path: 'participants_ids',
        select: 'full_name roll_no email' // Add any other fields you want to include
      });

    console.log(meet)
    if (!meet) {
      return res.status(404).json({ message: 'Meet not found' });
    }

    res.json(meet);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}
const endMeet = async (req, res) => {
  try {
    console.log(req.params.id)
    const meet = await MeetModel.findById(req.params.id)
    if (!meet) {
      return res.status(404).json({ message: 'Meet not found' });
    }
    meet.meet_active_status = false
    await meet.save()
    res.json("Meet Ended Succesfully");
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}


module.exports = { create_meet, generateQRCodeForMeet, getAllMeets, getMeet, markAttendance,endMeet };
