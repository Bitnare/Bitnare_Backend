const express = require('express');
const router = express.Router();
const user = require("../model/register");
const bcrypt = require('bcrypt');
const saltRounds = 10;

router.post("/addUser",(req,res) => {

    // var password = generator.generate({
    //     length: 10,
    //     numbers: true
    // });

    var password = req.body.password;

    bcrypt.genSalt(saltRounds, function (err, salt) {
        if (err) {
            throw err
        } else {
            bcrypt.hash(password, salt, function(err, hashedPassword){
                if (err) {
                    throw err
                } else {

                    data = {
                        "first_name"    : req.body.first_name,
                        "middle_name"   : req.body.middle_name,
                        "last_name"     : req.body.last_name,
                        "gender"        : req.body.gender,
                        "hometown"      : req.body.hometown,
                        "current_city"  : req.body.current_city,
                        "height"        : req.body.height,
                        "weight"        : req.body.weight,
                        "drink"         : req.body.drink,
                        "smoke"         : req.body.smoke,
                        "education"     : req.body.education,
                        "skills"        : req.body.skills,
                        "job_title"     : req.body.job_title,
                        "company_name"  : req.body.company_name,
                        "user_type"     : req.body.user_type,
                        "username"      : req.body.username,
                        "password"      : hashedPassword
                    }

                        var addUser= new user(data);
                        addUser.save().then(function(){
                        res.send({
                            message:"Sucessful "
                        })
                    });

                }

            })
        }
    })
});

router.post('/login', async function(req, res){
    if (req.body.username == "") {
        res.json({
            message: "Username is empty"
        });
    } else if (req.body.password == "" ){
        res.json({
            message: "Password is empty"
        });

    } else {
        try {
            const users = await user.checkCrediantialsDb(req.body.username, req.body.password);
            if (users) {
                var id = users._id;

                res.send({
                    id
                });

            }else{
                res.json({
                    message:"User not found"
                });
            }
        }catch (e){
            console.log(e);
        }
    }
});
//get all user
router.get('/getUser', function(req,res){
    user.find().then(function(users){
        res.send(users);
    }).catch(function(e){
        res.send(e);
    });
});
//get user by id
router.get("/fetchUser/:id", function (req,res){
    var UserId = req.params.id.toString();
    console.log(UserId);
    user.find({
        _id: UserId
    })
    .select("-_v")
    .then(function (getuser) {
        res.send(getuser);
    }).catch(function (e) {
        res.send(e);
    });
});

//update user by id
router.put('/updateUser/:id', function(req,res){
    UserId = req.params.id.toString();
    user.findByIdAndUpdate(UserId,req.body,{
        new:true
    }).then(function(updateuser){
        res.send(updateuser);

    }).catch(function(e){
        res.send(e);
    });
});

//delete user by id
router.delete('/deleteUser/:id', function (req,res){
    user.findByIdAndDelete(req.params.id).then(function (user){
        res.json({
            message: "User deleted"
        })
    }).catch(function (e){
        res.send(e);
    });
});

module.exports = router;
