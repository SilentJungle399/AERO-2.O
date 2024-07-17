const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the schema for a category
const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
  parent: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    default:null
  },
  ancestors: [
    {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the Mongoose model based on the schema
const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
