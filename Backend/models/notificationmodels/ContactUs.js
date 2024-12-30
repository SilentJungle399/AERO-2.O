const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// record for storing the messages sent from contact us form on the main page
const contactUsSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    default: "",
  },
  message: {
    type: String,
    default: "",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  ip_address: {
    type: String,
    default: "",
  },
});

const ContactUsModel = mongoose.model("ContactUsMessage", contactUsSchema);

module.exports = ContactUsModel;
