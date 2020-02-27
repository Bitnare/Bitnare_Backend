const mongoose = require('mongoose');


const url = "mongodb://localhost:27017/bitnare";
const connect = mongoose.connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true
});

connect.then(
    db => {
        console.log(
            "Connected to server"
        );

    },
    err => {
        console.log(err);
    }
);


//init gfs
let gfs;
connect.then("open", () => {
    // init stream
    gfs = new mongoose.mongo.GridFSBucket(connect.db, {
        bucketName: "Postvideos"
    });
});


module.exports = {
    url,
    gfs
}