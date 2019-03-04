const express = require('express');
const router = express.Router();
const passport = require("passport");
const mongoose = require("mongoose");
const Curator = mongoose.model("Curator");
const User = mongoose.model("User");
const jwt = require("jsonwebtoken");
const keys = require("../../../config/keys");

router.get("/login/:role", (req, res, next) => {
  
    req.session.analysis_id = req.params.role;
    passport.authenticate('facebook')(
      req,
      res,
      next
    );
  });

  router.get("/callback", passport.authenticate("facebook"), (req, res) => {
    
    if (req.session.analysis_id === "curator") {
      Curator.findOne({ providerId: req.user.id }).then(curator => {
        if (curator) {
          //already exist
  
          res.redirect("/curator");
        } else {
          //create new
          new Curator({
            providerId: req.user.id,
            name: req.user.displayName,
            email: "null",
            avatar: "null",
            gender: "null",
            provider: req.user.provider
          })
            .save()
            .then(() => {
              res.redirect("/curator");
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
            email: "null",
            avatar: "null",
            gender: "null",
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

  module.exports = router;