const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const path = require('path');
const MeetModel = require('../models/MeetsModel');

// Directory where QR code images will be stored (inside Next.js public folder)
const qrCodeDirectory = path.join(process.cwd(), '../public', 'qr-codes');

// Generate QR code for the meet and save it
const generateQRCodeForMeet = async function (meet) {
  try {
    // Delete previous QR code if exists
    console.log(meet)
    if (meet.meet_qr_code) {
      const previousQRCodePath = path.join(process.cwd(), '../public', meet.meet_qr_code);
      console.log('Deleting previous QR code:', previousQRCodePath);

      // Check if the file exists before attempting to delete
      const exists = await fs.access(previousQRCodePath).then(() => true).catch(() => false);
      if (exists) {
        await fs.unlink(previousQRCodePath);
        console.log('Previous QR code deleted successfully');
      } else {
        console.log('Previous QR code does not exist:', previousQRCodePath);
      }
    }

    // Generate new token and QR code data
    const token = uuidv4();
    const qrCodeData = `https://aeronitkkr.in/api/users/scan-meet/${meet._id}?token=${token}`;

    // Generate QR code as a data URL
    await QRCode.toFile(
      path.join(qrCodeDirectory, `${meet._id}.png`),
      qrCodeData
    );

    // Update meet document with QR code file path and token
    meet.meet_qr_code = `/qr-codes/${meet._id}.png`;
    meet.qr_code_token = token;
    await meet.save();

    return meet.meet_qr_code; // Return the URL to the QR code image
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
}

// Endpoint to create a meet and generate its QR code
const create_meet = async (req, res) => {
  try {
    // Destructure meet details from request body
    const { meet_date, meet_time, meet_team_type, meet_venue, meet_description, meet_essentials, meet_mode } = req.body;

    // Create new meet instance
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

    // Send response with meet details and QR code URL
    res.json({ meet, qrCode });
  } catch (error) {
    console.error('Error creating meet:', error);
    res.status(500).send('Internal Server Error');
  }
}

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


const markAttendance = async (req, res) => {
  const { id } = req.params;
  const { uid, token } = req.body;
  console.log("keri");

  try {
    // Find the meet by ID
    const meet = await MeetModel.findById(id);

    if (!meet) {
      return res.status(404).json({ success: false, message: 'Meet not found' });
    }

    // Verify the token
    if (meet.qr_code_token !== token) {
      return res.status(400).json({ success: false, message: 'Invalid token' });
    }

    // Check if the UID is already marked as attended
    if (!meet.participants_ids.includes(uid)) {
      meet.participants_ids.push(uid);

      // Generate a new QR code and token
      const newToken = uuidv4();
      const newQrCode = await QRCode.toDataURL(`https://aeronitkkr.in/api/users/scan-meet/${id}?token=${newToken}`);

      // Update the meet document with the new QR code and token
      meet.qr_code_token = newToken;
      meet.meet_qr_code = newQrCode;

      await meet.save();

      return res.json({ success: true, message: 'Attendance marked successfully', newQrCode });
    } else {
      return res.status(400).json({ success: false, message: 'Attendance already marked' });
    }
  } catch (error) {
    console.error('Error marking attendance:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

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
