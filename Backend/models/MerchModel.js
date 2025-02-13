const mongoose = require("mongoose");

const merchSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  full_name: {
    type: String,
  },
  customName: {
    type: String,
  },
  phone: {
    type: String,
  },
  email: {
    type: String,
  },
  items: {
    T_Shirt: {
      quantity: { type: Number, default: 0 },
      size: { type: String, default: "M" },
    },
    Badge: {
      quantity: { type: Number, default: 0 },
    },
  },
  total_price: {
    type: Number,
    default: 0,
  },
  payment_screenshot: {
    type: String, // Store file URL or path
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const MerchModel = mongoose.model("Merch", merchSchema);

module.exports = MerchModel;
