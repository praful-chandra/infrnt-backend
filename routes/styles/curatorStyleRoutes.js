const express = require("express");
const router = express.Router();
const passport = require("passport");
const mongoose = require("mongoose");
var multer = require("multer");
const fs = require("fs");
const path = require("path");

const Curator = mongoose.model("Curator");
const curatorStyles = mongoose.model("curatorStyles");
const curatorStyleDesign = mongoose.model("curatorStyleDesign");


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

var styleStorage = multer.diskStorage({

  destination: function(req, file, cb) {
    cb(null, "./uploads/curator/styles");
  },
  filename: function(req, file, cb) {
    cb(null, "styleCover" + makeid());
  }
});

var designStorage = multer.diskStorage({

  destination: function(req, file, cb) {
    cb(null, "./uploads/curator/styles/designs");
  },
  filename: function(req, file, cb) {
    cb(null, "designCover" + makeid());
  }
});

const MAX_SIZE = 10000000;

var styleUpload = multer({
  storage: styleStorage,
  fileFilter,
  limits: {
    fileSize: MAX_SIZE
  }
});

var designUpload = multer({
  storage: designStorage,
  fileFilter,
  limits: {
    fileSize: MAX_SIZE
  }
});


router.post(
  "/addStyle",
 passport.authenticate("jwt", { session: false }),
 styleUpload.single("styleCover"),
  (req, res) => {
    if (req.user.typeOfUser !== "curator") {
      res
        .status(401)
        .json({ msg: "Your are not authenticated to perform this action"});
    } else if (req.user.typeOfUser === "curator") {

        let newStyle = new curatorStyles({
            curatorId : req.user.id,
            name : req.body.name,
            description : req.body.description
                  });

        if(req.file){
          const newPath =
        "uploads/curator/styles/" +
        newStyle._id+
        path.extname(req.file.originalname);
    
        
        fs.rename(req.file.path, newPath, function(err) {
          if (err) res.json( err);
        });
    
        newStyle.coverImg = "api/"+newPath;
        
        }

        newStyle.save().then(data=>{
          Curator.findByIdAndUpdate(req.user._id, {$push:{styles:{styleId : newStyle._id }}},{new: true}).then(Curator=>{
            res.json(data)
          })
        });
    }
  }
);

router.post("/adddesign",
passport.authenticate("jwt", { session: false }),
designUpload.single("designCover"),
(req,res)=>{
    if (req.user.typeOfUser !== "curator") {
        res
          .status(401)
          .json({ msg: "Your are not authenticated to perform this action" });
      } else if (req.user.typeOfUser === "curator") {
                  
        let newDesign  = new curatorStyleDesign({
            styleId : req.body.styleId,
            curatorId : req.user.id,
            name : req.body.name,
            Description : req.body.description,
            url : req.body.url || "no link",
            label : req.body.label || "no label"

        });

        if(req.file){
          
          const newPath =
        "uploads/curator/styles/designs/" +
        newDesign._id+
        path.extname(req.file.originalname);
    
        
        fs.rename(req.file.path, newPath, function(err) {
          if (err) res.json( err);
        });
    
        newDesign.coverImg = "/api/"+newPath;
        
        }

        newDesign.save().then(design=>{
            curatorStyles.findByIdAndUpdate(newDesign.styleId,{$push:{Designs:{designId :newDesign._id}}},{new: true}).then(style=>{              
                res.json({
                    success : true,
                    styleId : style._id
                })
            })
        }).catch(err=>res.json(err))

      }
}
)

router.post("/getcuratorStyles",(req,res)=>{
 curatorStyles.find({curatorId : req.body.curatorId}).then(data=>
  res.json(data)).catch(err=>
    res.json(err))
})

router.post("/getcuratorStyleDesigns",(req,res)=>{
  curatorStyleDesign.find({curatorId : req.body.curatorId}).then(data=>
   res.json(data)).catch(err=>
     res.json(err))
 })

router.get("/getStyle/:styleId",(req,res)=>{
  
  curatorStyles.findById(req.params.styleId).then(data=>{
    res.json(data)
  }).catch(err=>
    res.json(err))
})

router.get("/getDesign/:styleId",(req,res)=>{
  curatorStyleDesign.find({styleId : req.params.styleId}).then(
    data=>{
      res.json(data)
      
    }
  )
});



module.exports = router;
