const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newUser = new Schema({
    providerId :{
        type : String,
        required : true
    },
    provider :{
        type : String,
        required : true
    },
    name :{
        type :String,
        required : true
    },
    gender :{
        type: String
    },
    email : {
        type : String,
        required : true
    },avatar : {
        type : String,
        required : true
    },
    date :{
        type : Date,
        default: Date.now
    },
    typeOfUser : {
        type : String,
        default : "user"
    },
    subscribedTo: [{
        curatorId:{type :  mongoose.Types.ObjectId, ref : "Curator"  }
        
    }]
})

mongoose.model("User",newUser);