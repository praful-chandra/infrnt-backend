const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const keys = require("../config/keys");
const mongoose = require('mongoose');
const Curator = mongoose.model("Curator");
const User = mongoose.model("User");

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((id, done) => {
  done(null,id)

});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: "/api/auth/google/callback"
    },
    (accessToken, refershToken, profile, done) => {

      done(null,profile);
     

    }
  ) 
);

passport.use(new FacebookStrategy({
  clientID: keys.FACEBOOK_APP_ID,
  clientSecret: keys.FACEBOOK_APP_SECRET,
  callbackURL: "/api/auth/facebook/callback"
},
function(accessToken, refreshToken, profile, done) {
  done(null,profile);
  //console.log(profile+"***");

}
));

const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;


  passport.use(new JwtStrategy(opts,(jwtPayload, done)=>{

    if(jwtPayload.users.typeOfUser == "user"){
        User.findById(jwtPayload.users._id).then(user=>{
            if(user){
                return done(null , user);
  
            }
            return done(null,false);
        }).catch(err=>console.log(err));
    }else    if(jwtPayload.users.typeOfUser == "curator"){
        Curator.findById(jwtPayload.users._id).then(curator=>{
            if(curator){
                return done(null , curator);
              
            }
            return done(null,false);
        }).catch(err=>console.log(err));
    }
  
  }))
