const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../configs");
// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
// Load User model
const User = require("../../models/User");

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
  console.log("gets here register");
    // Form validation
  const { errors, isValid } = validateRegisterInput(req.body);
  // Check validation
    if (!isValid) {
      console.log(`is not valid`)
      return res.status(400).json(errors);
    }
  User.findOne({ username: req.body.username }).then(user => {
      if (user) {
        return res.status(400).json({ username: "Username already exists" });
      };
  const newUser = new User({
          name: req.body.name,
          username: req.body.username,
          password: req.body.password
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
      
    });
  });

  // @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
    // Form validation
  const { errors, isValid } = validateLoginInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const username = req.body.username;
  const password = req.body.password;
  // Find user by username
  User.findOne({ username }).then(user => {
      // Check if user exists
    if (!user) {
      return res.status(404).json({ usernamenotfound: "Username not found" });
    }
  // Check password
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          console.log("password match");
          // User matched
          // Create JWT Payload
          const payload = {
            id: user.id,
            name: user.name,
            username: user.username,
            isAdmin: user.isAdmin
          };
  // Sign token
          jwt.sign(
            payload,
            keys.secretOrKey,
            {
              expiresIn: 31556926 // 1 year in seconds
            },
            (err, token) => {
              res.json({
                success: true,
                token: "Bearer " + token
              });
            }
          );
        } else {
          console.log("no password");
          return res
            .status(400)
            .json({ passwordincorrect: "Password incorrect" });
        }
      });
    });
  });

  router.post("/makeAdmin", (req, res) => {
      // Form validation

    User.findOne({ username: req.body.username }).then(user => {
        if (!user) {
          return res.status(400).json({ username: "Username does not exist" });
        }
        if(user.isAdmin) {
          return res.status(400).json({ username: "User is already an admin"});
        }
        User.findOne({ username: req.body.username }, function (err, doc){
          doc.isAdmin = true;
          doc.save().then(updatedUser => res.json(updatedUser))
          .catch(err => console.log(err.message));
        });
      });
    });

  module.exports = router;
  