const express = require("express");
const router = express.Router();
const passport = require("passport");
const mongoose = require("mongoose");
var multer = require("multer");
const fs = require("fs");
const path = require("path");

const Curator = mongoose.model("Curator");


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
      cb(null, "./uploads/curator/avatar");
    },
    filename: function(req, file, cb) {
      cb(null, "avatar" + makeid());
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


router.get('/test',

(req,res)=>{
    res.json({msg : "curatorRoute works"})
});



router.post('/updateProfile',
passport.authenticate("jwt", { session: false }),
upload.single("avatar"),
(req,res)=>{
  if (req.user.typeOfUser !== "curator") {
    res
      .status(401)
      .json({ msg: "Your are not authenticated to perform this action" });
  } else if (req.user.typeOfUser === "curator") {

    if(req.file){
      const newPath =
    "uploads/curator/avatar/" +
    req.user._id +
    path.extname(req.file.originalname);

    
    fs.rename(req.file.path, newPath, function(err) {
      if (err) res.json( err);
    });

    Curator.findByIdAndUpdate(req.user._id, {$set:{avatar : "api/"+newPath} },{new: true}).then(Curator=>{
    })
    }
console.log(req.body.bio);

Curator.findByIdAndUpdate(req.user._id, {$set:{profile:{bio:req.body.bio}}} ,{new: true}).then(Curator=>{  
  res.json(Curator)
})
    
  }

  
})

module.exports = router;