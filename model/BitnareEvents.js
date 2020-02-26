const mongoose = require('mongoose');
const fs = require('fs');
const moment = require('moment');
const bitnareEventsSchema = new mongoose.Schema({
    title : {
        type:String,
        required:[true,'Please add a title'],
        unique:true
    },
    slug : String,
    start_date: Date,
    end_date: Date,
    details: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [500, 'Description can not be more than 500 characters']
    },
    location: {
        type: String,
        required: [true, 'Please add an location']
    },
    industry :[{
        type: String,
        required:[true,'Please specify atleast one industry']
    }],
    photo: { 
        type: [String],
        required: true 
    },
    formattedstartdate:String,
    start_hour:String,
    formattedenddate:String,
    end_hour:String,
    createdAt:{
        type:Date,
        default:Date.now
    }
}
);

//  handles all post time formatting using moment library
bitnareEventsSchema.pre('save',function(){
    
    let formatstartdate = moment(this.start_date).format("YYYY-MM-DD hh:mm A");
    this.formattedstartdate = formatstartdate.toString();
    this.start_hour = moment(this.start_date).hour();
        
    let formatenddate = moment(this.end_date).format("YYYY-MM-DD hh:mm A");
    this.formattedenddate = formatenddate.toString();
    this.end_hour = moment(this.end_date).hour();
});

//handles all update time formatting using moment library
bitnareEventsSchema.pre('findOneAndUpdate', function(next) {
    const start_date=this._update.start_date;
    const end_date = this._update.end_date;
    if(!start_date || !end_date){
        return next();
    }
    try{
     
        const formattedstartDate = moment(start_date).format("YYYY-MM-DD hh:mm A");
        this._update.formattedstartdate = formattedstartDate.toString();
        this._update.start_hour =moment(formattedstartDate.toString()).hour();

        const formattedendDate = moment(end_date).format("YYYY-MM-DD hh:mm A");
        this._update.formattedenddate = formattedendDate.toString();
        this._update.end_hour =moment(formattedendDate.toString()).hour();
        next();
    }
    catch (error) {
        return next(error);
    }

    
});


module.exports = mongoose.model('bitnare_events',bitnareEventsSchema );