const bcrypt = require("bcryptjs");
const User = require("../models/User");

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://admin:admin123@ds243501.mlab.com:43501/hypothetical_meals_prod"
// require('../configs').mongoURI;

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("hypothetical_meals_prod");
  var newUser = new User({
    name: process.argv[2],
    username: process.argv[3],
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
