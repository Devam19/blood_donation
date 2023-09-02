//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");//for ENCRYPTION
const md5 = require("md5");//for hashing
const bcrypt = require("bcrypt");//for salting
const app = express();
const saltRounds = 10;

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.listen("3000",function(){
  console.log("Connected buddy 😉");
});

app.get("/",function(req,res){
  res.render("home.ejs");
});


app.get("/login.ejs",function(req,res){
  res.render("login.ejs");
});

app.get("/signup.ejs",function(req,res){
  res.render("signup.ejs");
});

app.get("/donor.ejs",function(req,res){
  res.render("login.ejs");
});

app.get("/contactus.ejs",function(req,res){
  res.render("contactus.ejs");
});

app.get("/home.ejs",function(req,res){
  res.render("home.ejs");
});

app.get("/compatibility.ejs",function(req,res){
  res.render("compatibility.ejs");
});




//27017
// connecting to mongodb
mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser: true});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

/////////////////////////////////////////////////////LEVEL-1 authenticatrion (ENCRYPTION)////////////////////////////////////////////////////////////////////
// const secret = "this is my little secret"; //pasting this line in .env file to create it an environmetn variable
// userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"]});
////////////////////////////////////////////////////////////////////////////////////////////////

const User = mongoose.model("User",userSchema);
// after the previous line we can start creating users and start adding it to the userDB



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//this app.post will take the input data that user has given from register page
// and will store in userDB

app.post("/signup.ejs",function(req,res){
  bcrypt.hash(req.body.password, saltRounds, function(err,hash){
    // here we are creating new user using the user model
    const newUser = new User({
      email: req.body.username, //taking the email that user has given in registration form
      // password: md5(req.body.password) //taking the password that user has given in registration form //md5 is used to hash the password
      password: hash //using bcrypt method to store the password, this is called salting
    });
    // saving the newUser info in the database
    newUser.save(function(err){
      if(err){
        console.log(err);

        //if any error will be there it will get cosoled log
      }
      else{
        // we are rendering this secrets page here and not in app.get("/secrets") because
        // we dont want anyone to see this page or load this page before the user has registered
        res.render("donor.ejs");
      }
    });
  });
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//in this we are checking if the given username of password in the login page matches with our id and password present in the DB that we inserted using register page
app.post("/login.ejs",function(req,res){
  var username = req.body.username;
  var password = req.body.password;
  // var password = md5(req.body.password);hashing the password and storing it in password variable
  User.findOne({email: username},function(err,foundUser){//giving condition to check for given username matching
    if(foundUser){
      bcrypt.compare(password, foundUser.password, function(err, result){
        if(result === true){
          res.render("donor.ejs");
        }
       });
    }else{
      res.render("signup.ejs");
}
      ////////for normal comparision of password
      // if(foundUser){
      //   if(foundUser.password === password){//checking if password for the given username matches with the password given for same username in the DB
      //     res.render("donor.ejs");
      //   }
      //   }

  });
});


app.post("/contactus.ejs",function (req,res) {
  console.log(req.body);
  const newContact = new ContactRequest({
    user:req.body.user,
    email:req.body.email,
    phone:req.body.phone,
    comment:req.body.comment
  })

  newContact.save(function (err) {
    if(err){
      console.log(err);
      res.sendStatus(500).send("Failed");
    }else{
      res.render("contactus.ejs");
    }
    
  })
});


// if(err){
//   res.render("/signup.ejs");
// }else{
//   if(foundUser){
//     //next lines of code is user to compare the hashed(salted) password in the database for a username with the password user is typing in the login page
//     bcrypt.compare(password, foundUser.password, function(err, result){
//       if(result === true){
//         res.render("donor.ejs");
//       }
//      });
//   }
// }


//////////////////////////////////////////////////2nd collection///////////////////////////////////////

const donorSchema = new mongoose.Schema({
  name: String,
  phone: String,
  bdgrp: String,
  locality: String
});

const Donor = mongoose.model("Donor",donorSchema);

const contactFormSchema=new mongoose.Schema({
  user:String,
  email:String,
  phone:String,
  comment:String
});

const ContactRequest = mongoose.model("ContactRequest",contactFormSchema);

app.post("/donor.ejs",function(req,res){
    const newDonor = new Donor({
      name: req.body.user,
      phone: req.body.phone,
      bdgrp: req.body.bdgrp,
      locality: req.body.locality,
    });
    newDonor.save(function(err){
      if(err){
        console.log(err);
      }
      else{
        res.render("thankyou.ejs");
        // res.render("donor.ejs");
      }
    });
    // newDonor.save();
  });


// retriving data fromt he database
  app.post("/compatibility.ejs",function(req,res){
    var name = req.body.user;
    var phone = req.body.phone;
    var bdgrp = req.body.bdgrp;
    var locality = req.body.locality;
    Donor.findOne({locality:locality},function(err,foundDonor){
      if(err){
        alert("no donor found");
      }else{
        if(foundDonor.bdgrp === bdgrp){
          res.render("final.ejs", {donorName: foundDonor.name, donorbdgrp: foundDonor.bdgrp, donorLocality: foundDonor.locality, donorPhone: foundDonor.phone});
        }else{
          res.render("final2.ejs");
        }
      }
    });
  });
