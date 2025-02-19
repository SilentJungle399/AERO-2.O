const NotificationModel = require("../models/notificationmodels/Notifications");
const ContactUsModel = require("../models/notificationmodels/ContactUs");
const User = require("../models/usermodel");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});


const showAllNotification = async (req, res) => {
  const userId = req.params.id;

  try {
    // Find the user by ID and populate the notifications
    const user = await User.findById(userId).populate(
      "notifications.notification"
    ); // Populate notification reference

    if (!user) {
      return res.status(404).json({message: "User not found"});
    }

    // Extract notifications and calculate unread count
    const notifications = user.notifications;
    const unreadCount = notifications.filter(
      (notification) => !notification.read
    ).length;

    // Return notifications and unread count
    res.json({
      notifications: notifications,
      unreadCount: unreadCount,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({message: "Server error"});
  }
};

const showOneNotification = async (req, res) => {
  const {userId} = req.body; // Retrieve userId from request body
  const notificationId = req.params.id; // Retrieve notificationId from request parameters

  try {
    // Fetch the user and populate the notifications array
    const user = await User.findById(userId)
      .populate({
        path: "notifications.notification", // Populate the notification details
        match: {_id: notificationId}, // Match the specific notification
      })
      .exec();

    if (!user) {
      return res.status(404).json({message: "User not found"});
    }

    // Find the specific notification from the populated array
    const notification = user.notifications.find(
      (notif) =>
        notif.notification &&
        notif.notification._id.toString() === notificationId
    );

    if (!notification) {
      return res.status(404).json({message: "Notification not found"});
    }
    notification.read = true;
    await user.save();

    // Return the specific notification
    res.json(notification.notification); // Return the notification object
  } catch (error) {
    console.error("Error finding notification:", error);
    res.status(500).json({message: "Server error"});
  }
};

const submitContactUs = async (req, res) => {
  const {name, email, message} = req.body;
  const ip_address = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  try {
    const last12Hours = new Date(Date.now() - 12 * 60 * 60 * 1000);
    const count = await ContactUsModel.countDocuments({
      ip_address,
      created_at: {$gt: last12Hours},
    });

    if (count >= 3) {
      return res.status(400).json({message: "You have reached the limit of messages you can send"});
    }
    console.log("Contact us message submitted:", name, email, message);
    const contactUsMessage = new ContactUsModel({
      name,
      email,
      message,
      ip_address,
    })

    await contactUsMessage.save();
    await transporter.sendMail({
      from: `"Contact form" <${email}>`, // sender address
      to: process.env.USER_EMAIL, // list of receivers
      subject: "Contact us message", // Subject line
      text: message, // plain text body
      html: `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact Us Email</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f9f9f9;
            color: #333333;
        }

        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border: 1px solid #dddddd;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .email-header {
            background-color: #4CAF50;
            color: white;
            text-align: center;
            padding: 20px;
            font-size: 24px;
            font-weight: bold;
        }

        .email-body {
            padding: 20px;
        }

        .email-body p {
            margin: 10px 0;
            line-height: 1.6;
        }

        .email-body .field {
            font-weight: bold;
            margin-bottom: 5px;
        }
    </style>
</head>

<body>
    <div class="email-container">
        <div class="email-header">
            New Contact Us Message
        </div>
        <div class="email-body">
            <p><span class="field">Name:</span> ${name}</p>
            <p><span class="field">Email:</span> ${email}</p>
            <p><span class="field">Message:</span></p>
            <p><i>${message}</i></p>
        </div>
    </div>
</body>

</html>
      `,
    });

    res.status(200).json({message: "Message sent"});
  } catch (error) {
    console.error("Error submitting contact us message:", error);
    res.status(500).json({message: "Server error"});
  }
}

module.exports = {showAllNotification, showOneNotification, submitContactUs};
