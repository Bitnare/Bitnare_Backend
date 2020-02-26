const express = require('express');
const router = express.Router();
const multer = require('multer');
const postModel = require('../model/Posts.js');

//for stroing image destination and filename
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
    }
});

//filefilter for only selected type of image is inserted to database
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
        cb(null, true)
    } else {
        cb(null, false)
    }
};
const upload = multer({ storage: storage, fileFilter: fileFilter });


//route to add a new post
router.post("/addpost", upload.array('postimage', 10), (req, res) => {
    data = {
        "postdescription": req.body.postdescription,
        "postimage": req.files.map(file => {
            const imagePath = file.path;
            return imagePath
        }),
        "posteddate": req.body.posteddate
    }


    const addPost = new postModel(data);
    addPost.save().then(result => {
        res.status(200).json({
            "message": "Post added Sucessfully",
            posts: {
                id: result._id,
                postdescription: result.postdescription,
                postimage: result.postimage,
                posteddate: result.posteddate
            },
            type: {
                request: "GET",
                url: "http://localhost:8000/post/" + result._id
            }
        })
    }).catch(err => {

        res.status(500).json({ "message": "Error creating Post" })
    })

});

//route to fetch all posts from database
router.get('/', (req, res, next) => {
    postModel.find().select('_id postdescription postimage posteddate ').exec().
    then(results => {
        const response = {
            count: results.length,
            posts: results.map(result => {
                return {
                    _id: result._id,
                    postdescription: result.postdescription,
                    postimage: result.postimage,
                    posteddate: result.posteddate,
                    type: {
                        request: "GET",
                        url: "http://localhost:8000/post/" + result._id
                    }
                }
            })
        }
        res.status(200).json({ "Message": "All posts", "Posts": response })
    }).catch(error => {
        res.status(500).json({ "Error": error })
    })
});

//route to fetch posts from id
router.get('/:postid', (req, res, next) => {
    const id = req.params.postid
    postModel.findById(id).select('_id postdescription postimage posteddate').exec().
    then(results => {
        res.status(200).json({
            "Post": results,
            type: {
                request: "GET",
                url: "http://localhost:8000/post/" + results._id
            }
        })
    }).catch(err => {
        res.status(500).json({
            "message": "Error finding Post"
        })
    })
});

//route for update Posts
router.put('/update/:postid', (req, res, next) => {
    const id = req.params.postid;
    postModel.updateOne({ _id: id, }, {
            $set: {
                postdescription: req.body.postdescription,
                posteddate: req.body.posteddate
            }
        })
        .exec().then(results => {
            res.status(200).json({
                "Updated Product": results
            })
        }).catch(err => {
            res.json({
                "Message": "Error updating post"
            })
        })
});


//route for deleting posts for database
router.delete('/delete/:id', (req, res, next) => {
    const id = req.params.id;
    postModel.remove({ _id: id }).exec().
    then(result => {
        res.status(200).json({
            message: 'Post deleted successfully'
        })
    }).
    catch(err => {
        res.status(500).json({ "Error": error })
    })
})

module.exports = router;