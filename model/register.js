const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const geocoder = require("../utils/geocoder");

const userSchema = new Schema({

    first_name  :  {type:String, required: true},
    middle_name :  {type:String},
    last_name   :  {type:String, required: true},
    dob         :  {type:Date, 
                     default:Date.now(), required: true},
    gender      :  {type:String, required: true},   
    hometown    :  {type:String, required: true},
    adress      :  {type:String, required: true},
    height      :  {type:String, required: true},
    weight      :  {type:String, required: true},
    drink       :  {type:String, required: true},
    smoke       :  {type:String, required: true},
    education   :  {type:String, required: true},
    skills      :  {type:String, required: true},
    job_title   :  {type:String},
    company_name:  {type:String},
    user_type   :  {type:String},
    location: {
        // GeoJSON Point
        type: {
          type: String,
          enum: ['Point']
        },coordinates: {
            type: [Number],
            index: '2dsphere'
          }
    },
    username    :  {type:String, required: true, unique: true},
    password    :  {type:String, required: true}

});
userSchema.statics.checkCrediantialsDb = async (username, password,callback) => {
    const user = await User.findOne({
        username: username
    });
    if (user) {
        var hashedPassword= user.password;
        if(bcrypt.compareSync(password, hashedPassword)) {
          return user;
        }
    
     
    };
}
//save longitude and latitude of  adress(requires city ,address and zipcode for increased accuracy
// for example Chabahil, Kathmandu 44602)
userSchema.pre('save',async function(next){
    const loc = await geocoder.geocode(this.adress);
    this.location={
        type:'Point',
        coordinates: [loc[0].longitude,loc[0].latitude],
    }
    next();
})
const User = mongoose.model("register", userSchema);
module.exports = User;