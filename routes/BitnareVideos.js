const express = require('express');
const crypto = require('crypto');
const path = require('path');
const router = express.Router();
const multer = require('multer');
const videosModel = require('../model/BitnareVideos.js');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './videos/');

    },

    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
    }
});





const upload = multer({ storage });




router.post('/add', upload.array("videopath", 5), (req, res, next) => {
    const videoData = {
        "videodescription": req.body.videodescription,
        "videopath": req.files.map(file => {
            const videoPath = file.path;
            return videoPath;
        })
    }

    const saveVideo = new videosModel(videoData);
    saveVideo.save().then(result => {
        res.status(200).json({
            "Message": "Successfully video added",
            "result": result
        })


    }).catch(err => {
        res.status(500).json({
            err: err
        })

    })

});








module.exports = router;