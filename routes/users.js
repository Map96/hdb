const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');
const mongoose = require('mongoose');

//Register
router.post('/register', (req,res,next)=>{
let newUser = new User({
  adhaar:req.body.adhaar,
  password:req.body.password,
  email:req.body.email
});

User.addUser(newUser, (err,user)=>{
  if(err){
    res.json({success:false,msg:'FAiled to register'});
  } else {
    res.json({success:true,msg:'User registered'});
  }
});
});

//Authenticate
router.post('/authenticate', (req,res,next)=>{
const adhaar= req.body.adhaar;
const password=req.body.password;

User.getUserByAdhaar(adhaar,(err,user)=>{
  if(err) throw err;
  if(!user){
    return res.json({success: false, msg:'User not found'});

  }

  User.comparePassword(password,user.password, (err,isMatch)=>{
    if(err) throw err;
    if(isMatch){
      const token = jwt.sign(user,config.secret,{
        expiresIn:604800 //1week
      });
      res.json({
        success: true,
        token: 'JWT '+token,
        user:{
          id: user._id,
          adhaar: user.adhaar,
          email: user.email
        }

      });

    }
    else{
      return res.json({success: false,msg: 'Wrong Password' + err});
    }
  });
});
});

//Profile
router.get('/profile', passport.authenticate('jwt',{session:false}), (req,res,next)=>{
  res.json({user:req.user});
});

//Update profile
router.put('/profile',passport.authenticate('jwt',{session:false}), (req,res,next)=>{
const adhaar = req.user.adhaar;
User.getUserByAdhaar(adhaar,(err,user)=>{
  if(err) throw err;

  else{
    user.first_name=req.body.first_name;
    user.last_name=req.body.last_name;
    user.date_of_birth=req.body.date_of_birth;
    user.blood_group=req.body.blood_group;
    user.address=req.body.address;
    user.phone_no=req.body.phone_no;
    user.save(function(err){
      if(err)
      console.log(err)
      else {
        console.log("success")
      }
    });
  }
});
});

//Prescription get
router.get('/prescription', passport.authenticate('jwt',{session:false}), (req,res,next)=>{
  res.json({user:req.user});
});


//Prescription
router.put('/prescription',passport.authenticate('jwt',{session:false}), (req,res,next)=>{

  var prescription={
    "height":req.body.height,
    "weight":req.body.weight,
    /*"medicine":[{

    }]*/
  };

  const adhaar = req.user.adhaar;
  User.getUserByAdhaar(adhaar,(err,user)=>{
    if(err) throw err;

    else{
      user.prescription.push(prescription);
      user.save(function(err){
        if(err)
        console.log(err)
        else {
          console.log("success")
        }
      });
    }
  });
});

//View History
router.get('/history', (req,res,next)=>{
  res.send('HISTORY');
});
/*//Register
router.get('/register', (req,res,next)=>{
  res.send('REGISTER');
})*/

module.exports = router;
