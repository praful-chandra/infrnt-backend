const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const newBlog = new Schema({
  title: {
    type: String,
    required: true
  },
  cover: {
    type: String,
    required: true
  },
  description :{
    type: String,
    required: true
  },
  content: [
    {
      img: {
        type: String
      },
      link: {
        type: String
      },
      blogContent: {
        type: String
            }
    }
  ],
  curatorId: {
    type: Schema.Types.ObjectId,
    ref: "Curator"
  },
  curatorName: {
    type: String,
    required: true
  },
  comments: [
    {
      userId: {
        type: mongoose.Types.ObjectId,
        ref: "Users"
      },
      comment: {
        type: String
      },
      date: {
        type: Date,
        default: Date.now
      },
      userName: {
        type: String,
        required: true
      },
      userAvatar: {
        type: String,
        required: true
      }
    }
  ],
  likes: {
    type: Number,
    default: 0
  },
  likedBy: [
    {
      userId: {
        type: mongoose.Types.ObjectId,
        ref: "Users"
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Blog = mongoose.model("blog", newBlog);
