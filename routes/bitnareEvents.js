const express = require('express');
const router = express.Router();
const BitnareEvent = require('../model/BitnareEvents');
const multer= require('multer');
const fs = require('fs');
const moment = require('moment');
// SET STORAGE
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/bitnare_events')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() +'-' + file.originalname);
    }
  }) ;
   
var upload = multer({ storage: storage });

// Get all Events
router.get('/',async (req,res)=>{
    try{
        const bitnareEvents =await BitnareEvent.find();
       
        res.status(200).json({
            sucess:true,
            data:bitnareEvents,
        })
    }
    catch(e){
        res.status(400).json({
            sucess:false,
            data:e
        })
    }
});

// Get Single Event
router.get('/:id',async (req,res,next)=>{
    try{
        const bitnareEvent =await BitnareEvent.findById(req.params.id);
        if(!bitnareEvent){
            return  res.status(400);
        }
        res.status(200).json({
            sucess:true,
            data:bitnareEvent
        })
    }
    catch(e){
        res.status(400).json({
            sucess:false,
            data:e
        })
    }    
});

// Post event
router.post('/',upload.array('myFile',10),async (req,res,next)=>{
   try{
    req.body.photo = req.files.map(file => {
        const imagePath = file.path;
        return imagePath
    });   
    formattedstartdate = moment(`${req.body.start_date} ${req.body.start_hour}`);
    req.body.start_date = formattedstartdate;

    formattedenddate = moment(`${req.body.end_date} ${req.body.end_hour}`);
    req.body.end_date= formattedenddate;

    const event = await BitnareEvent.create(req.body);
    res.status(201).json({
        sucess:true,
        data:event,
    });
    }
    catch(e){
        // deletes images if there is problem when creating model
        req.body.photo.forEach(photo_url => {
            fs.unlinkSync(photo_url);
        });
        
        res.status(404).json({
            sucess:false,
            data:e,
        })
    }
});

//Update Single Event
router.put('/:id',upload.array('myFile',10),async(req,res,next)=>{
    try{
   //access the posted image collection using multter
    var photoArray = req.files.map(file => {
            const imagePath = file.path;
            return imagePath
    });   
    
    // push to existing photo array when user adds new image on update
    await BitnareEvent.findByIdAndUpdate( req.params.id,{ $push : {"photo":photoArray}},
        {safe :true , upsert : true});

    formattedstartDate = moment(`${req.body.start_date} ${req.body.start_hour}`);
  
    req.body.start_date = formattedstartDate;

    formattedenddate = moment(`${req.body.end_date} ${req.body.end_hour}`);

    req.body.end_date =  formattedenddate;
    
    //updating rest of non image fields
    const bitnareEvent = await BitnareEvent.findByIdAndUpdate(req.params.id, req.body,{
        upsert: true, new: true
    });

    if(! bitnareEvent){
        return res.status(400).json({
            sucess:false,
            data:'The event could not be found',
        });
    }
    
        return res.status(200).json({
            sucess:true,
            data:bitnareEvent,
        });
    
}
catch(e){
    res.status(400).json({
        sucess:false,
        data:e
    })
}
});

// Delete a single event
router.delete('/:id',async(req,res,next)=>{
    try{
    const bitnareEvent = await BitnareEvent.findById(req.params.id);
    const photos = bitnareEvent.photo;
    const deleteEvent =await BitnareEvent.deleteOne(bitnareEvent);   
    if(!deleteEvent){
        return res.status(300).json({
            sucess:false,
            data:'The event could not be found',
        });
    }
    else{
        photos.forEach(photo_url => {
            fs.unlinkSync(photo_url);
        });
        return res.status(200).json({
            sucess:true,
        })
    }
    }
    catch(e){
        res.status(400).json({
            sucess:false,
            data:e
        })
    }
});


router.put('/:id/images',upload.array('myFile',10),async(req,res,next)=>{
    try{
        // pull from existing photo array when user deletes image on update
        const deleteImage= await BitnareEvent.update({_id:req.params.id},{ $pull : {"photo":req.body.image_source}});
        if(!deleteImage){
            return res.status(300).json({
                sucess:false,
                data:'The image could not be deleted',
            });
        }
        else{
            fs.unlinkSync(req.body.image_source);
            return res.status(200).json({
                sucess:true,
            })
        }

    }
    catch(e){
        console.log(e);
    }
});   
   
   
    
module.exports = router;