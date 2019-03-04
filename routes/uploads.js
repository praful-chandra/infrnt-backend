const express = require("express");
const router = express.Router();
const fs = require('fs');

router.get("/:image",(req,res)=>{
    fs.readFile('./uploads/'+req.params.image, function (err, content) {
        if (err) {
            res.writeHead(400, {'Content-type':'text/html'})
            console.log(err);
            res.end("No such image");    
        } else {
            //specify the content type in the response will be an image
            res.writeHead(200,{'Content-type':'image/jpg'});
            res.end(content);
        }
})
})

router.get("/curator/avatar/:image",(req,res)=>{
    fs.readFile('./uploads/curator/avatar/'+req.params.image, function (err, content) {
        if (err) {
            res.writeHead(400, {'Content-type':'text/html'})
            console.log(err);
            res.end("No such image");    
        } else {
            //specify the content type in the response will be an image
            res.writeHead(200,{'Content-type':'image/jpg'});
            res.end(content);
        }
})
})

router.get("/curator/styles/designs/:image",(req,res)=>{
    fs.readFile('./uploads/curator/styles/designs/'+req.params.image, function (err, content) {
        if (err) {
            res.writeHead(400, {'Content-type':'text/html'})
            console.log(err);
            res.end("No such image");    
        } else {
            //specify the content type in the response will be an image
            res.writeHead(200,{'Content-type':'image/jpg'});
            res.end(content);
        }
})
})
module.exports = router;