const express = require("express");
const router = express.Router();
const passport = require("passport");
const mongoose = require("mongoose");
var multer = require("multer");
const fs = require("fs");
const path = require("path");

const fileFilter = (req, file, next) => {
  const allowedTypes = ["image/jpg", "image/jpeg", "image/png"];
  if (!allowedTypes.includes(file.mimetype)) {
    const error = new Error("file type not supported");
    error.code = "UNSUPPORTED_FILE";
    return next(error, false);
  } else next(null, true);
};

function makeid() {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 10; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function(req, file, cb) {
    cb(null, "cover" + makeid());
  }
});
const MAX_SIZE = 10000000;
var upload = multer({
  storage: storage,
  fileFilter,
  limits: {
    fileSize: MAX_SIZE
  }
});

const Curator = mongoose.model("Curator");
const Blog = mongoose.model("blog");
const User = mongoose.model("User");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");

router.post(
  "/test",
  passport.authenticate("jwt", { session: false }),

  (req, res) => {
    res.json({ message: "protected route works", user: req.user });
  }
);

router.post(
  "/postBlogHead",
  passport.authenticate("jwt", { session: false }),
  upload.single("cover"),
  (req, res) => {
    if (req.user.typeOfUser !== "curator") {
      res
        .status(401)
        .json({ msg: "Your are not authenticated to perform this action" });
    } else if (req.user.typeOfUser === "curator") {
      let newBlog = new Blog({
        title: req.body.title,
        cover: req.file.path,
        description: req.body.description,
        curatorId: req.user.id,
        curatorName: req.user.name
      });

      const newPath =
        "uploads/" +
        newBlog._id +
        "-cover" +
        path.extname(req.file.originalname);
      newBlog.cover = "api/" + newPath;

      fs.rename(req.file.path, newPath, function(err) {
        if (err) res.json( err);
      });
      newBlog.save().then(result => {
        res.json(result);
      });
    }
  }
);

router.post(
  "/postBlogContent",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user.typeOfUser !== "curator") {
      res
        .status(401)
        .json({ msg: "Your are not authenticated to perform this action" });
    } else if (req.user.typeOfUser === "curator") {
      Blog.findByIdAndUpdate(
        req.body.id,
        { content: req.body.content },
        { new: true }
      ).then(updatedBlog => {
        res.json(updatedBlog);
      });
    }
  }
);

router.post(
  "/getCuratorBLogs",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user.typeOfUser !== "curator") {
      res
        .status(401)
        .json({ msg: "Your are not authenticated to perform this action" });
    } else if (req.user.typeOfUser === "curator") {
      Blog.find({ curatorId: req.user._id })
        .sort({ date: -1 })
        .then(curatorBLogs => res.json(curatorBLogs));
    }
  }
);

router.get("/getAllBlogs", (req, res) => {
  Blog.find()
    .sort({ date: -1 })
    .then(blogs => res.json(blogs));
});



router.post("/getSelectedBlog", (req, res) => {
  Blog.findById(req.body.id).then(blog => res.json(blog));
});



router.post(
  "/likeBlog",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {

    const userId = req.user.id

    Blog.findById(req.body.id).then(blogData=> {


      if(blogData.likedBy.filter(user=> (user['userId'] == userId)).length > 0){
          let likes = blogData.likes;
          likes --;
          
         Blog.findByIdAndUpdate(blogData._id,{$pull:{likedBy:{userId }} ,$set : {likes : likes} } ,{new: true}).then(result =>res.json(result)).catch(err=>res.json(err))
      }else{
          let likes = blogData.likes;
          likes ++;
          
         Blog.findByIdAndUpdate(blogData._id,{$push:{likedBy:{userId }} ,$set : {likes : likes} } ,{new: true}).then(result =>res.json(result)).catch(err=>res.json(err))
      }

  }).catch(err=>res.json(err));
   
  }
);

router.use((err, req, res, next) => {
  if (err.code === "UNSUPPORTED_FILE") {
    res.status(422).json({ error: "only jpeg and png imaages allowed" });
    return;
  }
  if (err.code === "LIMIT_FILE_SIZE") {
    res
      .status(422)
      .json({ error: `max file size = ${MAX_SIZE / 1000 / 1000} MB` });
    return;
  }
});

module.exports = router;
