const bcrypt = require("bcryptjs");
const User = require("../models/User");


const newUser = new User({
    name: "admin",
    email: "admin2@gmail.com",
    password: "password",
    isAdmin: true
  });
// Hash password before saving in database
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) throw err;
      newUser.password = hash;
      newUser
        .save()
        .then(user => res.json(user))
        .catch(err => console.log(err));
    });
  });