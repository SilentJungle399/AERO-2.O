const mongoose = require("mongoose");
const User = require("./usermodel");
const Schema = mongoose.Schema;

const gallerySchema = new mongoose.Schema({
  album_author: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  album_story: {
    type: String,
    default: "",
  },
  album_name: {
    type: String,
    default: "",
  },
  album_title: {
    type: String,
    default: "",
  },
  file_type: {
    type: String,
    default: "",
  },
  album_images: [
    {
      url: {
        type: String,
        default: "",
      },
      file_type: {
        type: String,
        default: "",
      },
      image_likes: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      image_views: [
        {
          type: Number,
          default:0
        },
      ],
    },
  ],
  album_author: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  created_at: {
    type: Date,
    default: Date.now
}

  
});

const GalleryModel = mongoose.model("Gallery", gallerySchema);

module.exports = GalleryModel;
