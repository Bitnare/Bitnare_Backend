const express = require('express');
const crypto = require('crypto');
const path = require('path');
const router = express.Router();
const multer = require('multer');
const Mongourl = require('../database/db.js');

//Storage engine for multer to store upload files directlyy to mongodb
const GridfsStorage = require('multer-gridfs-storage');
const storage = new GridfsStorage({
    url: Mongourl,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString("hex") + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: "Postvideos"
                };
                resolve(fileInfo);
            });
        });
    }
});

const upload = multer({ storage });


router.post('/add', upload.single("file"), (req, res, next) => {
    res.status(200).json({
        "Message": "Video Sucessfullyy uploaded"
    })


});






module.exports = router;