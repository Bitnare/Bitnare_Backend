const express = require('express');
const app = express();
const morgan = require('morgan');


const mongoose = require('./database/db');
const cors = require("cors");
const multer = require('multer');
const bodyparser = require('body-parser');
const userRegister = require("./routes/userRegister");
const postRoutes = require("./routes/postRoutes.js");
const adminLogin = require("./routes/adminLogin");

// const userRegister = require("./routes/userRegister");

const bitnareEvents = require("./routes/bitnareEvents");


app.use("/uploads",express.static('uploads'))
app.use(morgan("dev"));
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());
app.use(cors());

app.use("/user", userRegister);
app.use("/post", postRoutes);
app.use("/admin", adminLogin);
app.use("/events",bitnareEvents);


//for handliing cors errors
app.use((req, res, next) => {

    res.header(
        "Access-Control-Allow-Headers",
        "Origin,X-Requested-With,Content-Type,Authorization"
    );
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT,POST,PATCH,DELETE");
        return res.status(200).json({});
    }
    next();
});




app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
  });

 


app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});
const port = process.env.PORT || 8000;

app.listen(port);


