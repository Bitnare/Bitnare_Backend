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

//route to get all videos from diskstorage
router.get('/', (req, res, next) => {
    videosModel.find().select('_id videodescription videopath userid videodate').exec()
        .then(result => {
            res.status(200).json({

                "Videos": result
            })

        }).catch(err => {
            res.status(500).json({
                "message": "Videos all fetched"
            })
        })
})

//route to add videos on diskstorage
router.post('/add', upload.array("videopath", 5), (req, res, next) => {
    const videoData = {
        "videodescription": req.body.videodescription,
        "videopath": req.files.map(file => {
            const videoPath = file.path;
            return videoPath;
        }),
        "videodate": req.body.videodate 
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

//route to fetch single video from diskstorage

router.get('/:videoid', (req, res, next) => {
    const id = req.params.videoid;
    videosModel.findById(id).select('_id videodescription videopath videodate')
        .exec().then(result => {
            res.status(200).json({
                "Result": result
            })

        }).catch(err => {
            res.status(500).json({
                "Messsage": err
            })
        })


});

//route to delete video from diskstorage
router.delete('/delete/:videoid', (req, res, next) => {
    const id = req.params.videoid;
    videosModel.remove({ _id: id }).exec()
        .then(result => {
            res.status(200).json({
                "Message": "Your video is deleted!"
            })

        }).catch(err => {
            res.status(500).json({
                "Message": err
            })
        })
});









module.exports = router;