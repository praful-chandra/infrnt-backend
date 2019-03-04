const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newCurator = new Schema({
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
    verified : {
        type : Boolean,
        default : false
    },
    typeOfUser : {
        type : String,
        default : "curator"
    },
    subscribers:[{
        userId : {
            type : mongoose.Types.ObjectId,
            ref: "User"
        }
    }],
    subscriberCount:{
            type : Number,
            default : 0
        },
        profile:{
            bio:{
                type:String,
                default:"no bio"
            }
        },
        styles : [
           { styleId :{
                type : mongoose.Types.ObjectId,
                ref:"curatorStyles"
            }}
    ]
})

mongoose.model("Curator",newCurator);