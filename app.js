const express = require('express');
const app = express();
const morgan = require('morgan');
<<<<<<< HEAD

const mongoose = require('./database/db');
const cors = require("cors");
const multer = require('multer');
const bodyparser = require('body-parser');
const userRegister = require("./routes/userRegister");
const postRoutes= require("./routes/postRoutes.js");


const bitnareEvents = require("./routes/bitnareEvents");
const userSearch = require('./routes/userSearch');

app.use("/uploads",express.static('uploads'))
app.use(morgan("dev"));
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());
app.use(cors());

app.use("/user", userRegister);
app.use("/post",postRoutes);
app.use('/search',userSearch);

app.use("/events",bitnareEvents);
=======
const bodyparser = require('body-parser');
const mongoose = require('./database/db');
const cors = require("cors");
const multer = require('multer');


const postRoutes = require("./routes/postRoutes.js");



app.use("/uploads", express.static('uploads'))
app.use(morgan("dev"));
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(cors());
app.use("/post", postRoutes);


>>>>>>> 82737056b92c66c655211c21966fb4425d897d1d
//for handliing cors errors
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
<<<<<<< HEAD
      "Access-Control-Allow-Headers",
      "Origin,X-Requested-With,Content-Type,Authorization"
    );
    if (req.method === "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "PUT,POST,PATCH,DELETE");
      return res.status(200).json({});
    }
    next();
  });
=======
        "Access-Control-Allow-Headers",
        "Origin,X-Requested-With,Content-Type,Authorization"
    );
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT,POST,PATCH,DELETE");
        return res.status(200).json({});
    }
    next();
});
>>>>>>> 82737056b92c66c655211c21966fb4425d897d1d



app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
<<<<<<< HEAD
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
=======
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
>>>>>>> 82737056b92c66c655211c21966fb4425d897d1d
