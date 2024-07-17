const mongoose = require("mongoose");
const otpVerification = new mongoose.Schema({
    full_name: {
        type:String,
        required:true,
      },
    email: {
        type:String,
        required:true,
      },
      otp: {
        type: Number,
        required: true
      },
      status: {
        type: Boolean,
        default: false
      },
      createdAt: {
        type: Date,
        default: Date.now,
        expires: '20m' // The OTP will expire after 5 minutes
      }
});

const OtpVerification = mongoose.model("otpVerification", otpVerification);

module.exports = OtpVerification;
