const express = require("express");
const cookieSession = require('cookie-session');
const mongoose = require('mongoose');
const passport = require('passport');
const keys = require('./config/keys');
const bodyParser = require('body-parser');


//initilze mongoosemodels
require('./models/curator');
require('./models/users');
require('./models/blog');
require('./models/curatorStyles');
require('./models/curatorStyleDesigns');



require("./services/passport"); 

//create express app
const app = express();
//import user routes
const authRoutes = require("./routes/auth/google/authRoutes");
const facebookAuth = require("./routes/auth/facebook/fbAuth");
const blogRoutes = require("./routes/blogRoutes");
const uploads = require("./routes/uploads");
const curatorRoutes = require('./routes/curatorRoutes');
const curatorStyleRoutes = require('./routes/styles/curatorStyleRoutes');


//set port to listen
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

//Body parser middleware
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

//initalize mongoose
const db = keys.mongoURI;
mongoose.connect(db,{ useNewUrlParser: true }).then(()=>console.log("mongoDB connected")).catch(err=>console.log(err));

//initalize passport with session
app.use(
  cookieSession({
    maxAge : 2*24*60*60*1000,
    keys : [keys.cookieKey]
  })
);
app.use(passport.initialize());
app.use(passport.session());

//initalize body-parser
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

//root route
app.get("/", (req, res) => {
  res.json({ message: "welcome to infrnt" });
});

//app.use(express.static('uploads'))


//user routes
app.use("/api/auth/facebook",facebookAuth);
app.use("/api/auth", authRoutes);
app.use("/api/blogs",blogRoutes);
app.use("/api/uploads",uploads);
app.use("/api/curator",curatorRoutes);
app.use("/api/curator/styles",curatorStyleRoutes);
