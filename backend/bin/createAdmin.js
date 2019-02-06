const bcrypt = require("bcryptjs");
const User = require("../models/User");

var MongoClient = require('mongodb').MongoClient;
var url = require('../configs').mongoURI;

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("hypothetical_meals_test");
  var newUser = new User({
    name: process.argv[2],
    email: process.argv[3],
    password: process.argv[4],
    isAdmin: true
  });
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) throw err;
      newUser.password = hash;
      dbo.collection("users").insertOne(newUser, function(err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        db.close();
      });
    });
  });
  
});