const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    dsec: {
      type: String,
      requried: true,
    },
    photo: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      requried: true,
    },
    categories: {
      type: Array,
      required: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Post', PostSchema);
