const mongoose = require('mongoose');
require('../database/db.js');
const Schema = mongoose.Schema;

const postSchema = new Schema({

    postdescription: { type: String, required: true },
    postimage: { type: [String] },
    posteddate: { type: Date, default: Date.now() }



})

const postModel = mongoose.model("posts", postSchema);
module.exports = postModel;