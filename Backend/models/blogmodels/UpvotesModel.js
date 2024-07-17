const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the schema for an upvote
const upvoteSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  blog: {
    type: Schema.Types.ObjectId,
    ref: "Blog",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Ensure each user can only upvote a blog once
upvoteSchema.index({ user: 1, blog: 1 }, { unique: true });

// Create the Mongoose model based on the schema
const Upvote = mongoose.model("Upvote", upvoteSchema);

module.exports = Upvote;
