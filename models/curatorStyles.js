const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const curatorStyle = new Schema({
    curatorId :{
        type :mongoose.Types.ObjectId,
        ref:"curator"
    },
    name :{
        type : String,
        required : true
    },
    description:{
        type :String,
        required : true
    },
    Collaborators :[
        {
            CollaboratorId :{
                type : mongoose.Types.ObjectId,
                ref:"curator"
            },
            date :{
                type : Date,
                default : Date.now 
            }
        }
    ],
    views :{
        type :Number,
        default : 0
    },
    Designs :[
        {
            designId : {
                type :mongoose.Types.ObjectId,
                ref:"curatorStylesDesigns"
            }
        }
    ],
    isExternal : {
        type : Boolean,
        default : true 
    },
    date : {
        type:Date,
        default : Date.now
    },
    coverImg :{
        type : String,
        default : "no img"
    }


});

module.exports = mongoose.model("curatorStyles", curatorStyle);

