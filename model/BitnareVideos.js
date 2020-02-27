const mongoose = require('mongoose');
require('../database/db.js');
const Schema = mongoose.Schema;

const videoSchema = new Schema({

    videodescription: {
        type: String
    },
    videopath: {
        type: [String],
        required: true
    },
    userid: {
        type: Schema.Types.ObjectId


    }







});

const videosModel = mongoose.model("BitnarePostVideo", videoSchema);
module.exports = videosModel;