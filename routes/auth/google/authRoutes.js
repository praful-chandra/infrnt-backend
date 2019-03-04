const express = require("express");
const router = express.Router();
const passport = require("passport");
const mongoose = require("mongoose");
const Curator = mongoose.model("Curator");
const User = mongoose.model("User");
const jwt = require("jsonwebtoken");
const keys = require("../../../config/keys");

//test route
router.get("/test",(req,res)=>{
  res.json({message : "auth route works"})
})


router.get("/user/google/:role", (req, res, next) => {

  req.session.analysis_id = req.params.role;
  passport.authenticate("google", { scope: ["profile", "email"] })(
    req,
    res,
    next
  );
});

router.get("/google/callback", passport.authenticate("google"), (req, res) => {

  if (req.session.analysis_id === "curator") {
    Curator.findOne({ providerId: req.user.id }).then(curator => {
      if (curator) {
        //already exist

        res.redirect("/curatorb");
      } else {
        //create new
        new Curator({
          providerId: req.user.id,
          name: req.user.displayName,
          email: req.user.emails[0].value,
          avatar: req.user.photos[0].value,
          gender: req.user.gender,
          provider: req.user.provider
        })
          .save()
          .then(() => {
            res.redirect("/curatorb");
          });
      }
    });
  } else if (req.session.analysis_id === "user") {
    User.findOne({ providerId: req.user.id }).then(users => {
      if (users) {
        //already exist
        jwt.sign(
          { users: users },
          keys.secretOrKey,
          { expiresIn: "2h" },
          (err, token) => {

            res.json({ success: true, token: "Bearer " + token });
          }
        );
        res.redirect("/");
      } else {
        //create new
        new User({
          providerId: req.user.id,
          name: req.user.displayName,
          email: req.user.emails[0].value,
          avatar: req.user.photos[0].value,
          gender: req.user.gender,
          provider: req.user.provider
        })
          .save()
          .then(() => {
            res.redirect("/");

          });
      }
    });
  }
});

router.get("/current/", (req, res) => {
  if(!req.user){
    res.json({});
  }else{
    if (req.session.analysis_id === "curator") {
      Curator.findOne({ providerId: req.user.id }).then(users => {
        jwt.sign({users} ,keys.secretOrKey,{ expiresIn : 6600} , (err,token)=>{
          res.json({success : true, token:"Bearer "+token})
        })
      });
    } else if (req.session.analysis_id === "user") {
          User.findOne({ providerId: req.user.id }).then(users => {
        jwt.sign({users} ,keys.secretOrKey,{ expiresIn : 6600} , (err,token)=>{
          res.json({success : true, token:"Bearer "+token})
          })
      });
  }

 
  }
});

router.get("/logout", (req, res) => {
  req.logOut();
  req.session.analysis_id = req.session.userRole = null;

  res.json({ user: req.user , session : req.session});
});

module.exports = router;
