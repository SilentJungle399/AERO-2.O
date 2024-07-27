const NotificationModel = require("../models/notificationmodels/Notifications");
const User = require("../models/usermodel");
const showAllNotification = async (req, res) => {
  const userId = req.params.id;

  try {
    // Find the user by ID and populate the notifications
    const user = await User.findById(userId).populate(
      "notifications.notification"
    ); // Populate notification reference

    if (!user) {
      return res.status(404).json({ message: "User not found" });
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
    res.status(500).json({ message: "Server error" });
  }
};

const showOneNotification = async (req, res) => {
  const { userId } = req.body; // Retrieve userId from request body
  const notificationId = req.params.id; // Retrieve notificationId from request parameters

  try {
    // Fetch the user and populate the notifications array
    const user = await User.findById(userId)
      .populate({
        path: "notifications.notification", // Populate the notification details
        match: { _id: notificationId }, // Match the specific notification
      })
      .exec();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the specific notification from the populated array
    const notification = user.notifications.find(
      (notif) =>
        notif.notification &&
        notif.notification._id.toString() === notificationId
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    notification.read = true;
    await user.save();

    // Return the specific notification
    res.json(notification.notification); // Return the notification object
  } catch (error) {
    console.error("Error finding notification:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { showAllNotification, showOneNotification };
