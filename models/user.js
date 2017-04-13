const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

//User schema
const UserSchema = mongoose.Schema({
  adhaar:{
    type: Number,
    required: true
  },
  password:{
    type:String,
    required: true
  },
  email:{
    type: String,
    required: true
  },
  first_name:{
    type: String

  },
  last_name:{
    type: String
  },
  date_of_birth:{
    type: Date
  },
  blood_group:{
    type: String
  },
  address:{
    type: String
  },
  phone_no:{
    type: Number
  },
  prescription:[{
    date: {type:Date, default: Date.now},
    //doctor_name:{ type: String},
    height:{type:Number},
    weight:{type:Number}
  /*  symptoms::{type:String},
    diagnosis:{type:String},
    remarks::{type:String}*/
  }]


});

const User =module.exports=mongoose.model('User',UserSchema);

module.exports.getUserById=function(id, callback){

  User.findById(id,callback);
}

module.exports.getUserByAdhaar = function(adhaar, callback){
  const query = {adhaar: adhaar}
  User.findOne(query,callback);
}



module.exports.addUser = function(newUser,callback){
  bcrypt.genSalt(10, (err,salt) => {
    bcrypt.hash(newUser.password,salt,(err,hash) =>{
      if(err) throw err;
      newUser.password = hash;
      newUser.save(callback);
    });
  });
}

module.exports.comparePassword = function(candidatePassword,hash,callback){
  bcrypt.compare(candidatePassword, hash, (err, isMatch) =>{
    if(err) throw err;
    callback(null , isMatch);
  });
}
