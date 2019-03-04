const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const curatorStyleDesign = new Schema({
    styleId :{
        type : mongoose.Types.ObjectId,
        ref:"curatorStyles"
    },
    curatorId : {
        type :mongoose.Types.ObjectId,
        ref:"curator"
    },
    name :{
        type :String,
        required :true
    },
    Description :{
        type :String,
        required : true
    },
    url :{
        type : String
    },
    label :String,
    views :{
        type : Number,
        default : 0
    },
    coverImg : {
        type : String,
        default:"no img"
    },
    date :{
        type :Date,
        default  : Date.now
    }
});

module.exports =  mongoose.model("curatorStyleDesign", curatorStyleDesign);

