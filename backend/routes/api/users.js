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
const NetidUser = require("../../models/NetidUser");


// @route POST api/users/register
// @desc Register user
// @access Private
router.post("/register", (req, res) => {
    // Form validation
  const { errors, isValid } = validateRegisterInput(req.body);
  // Check validation
    if (!isValid) {
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
          return res
            .status(400)
            .json({ passwordincorrect: "Password incorrect" });
        }
      });
    });
  });

  // @route POST api/users/netid
  // @desc create JWT for netid user, also checks to see if there is a user
  // @access Private
  router.post("/netid", (req, res) => {
    const name = req.body.name;
    const username = req.body.username;
    NetidUser.findOne({ username: username }).then(user => {
      if(!user) {
        //Make a user
        const newUser = new NetidUser({
          name: name,
          username: username
        });
        newUser
              .save( function(err, newDocument) {
                const payload = {
                  id: newDocument.id,
                  name: newDocument.name,
                  username: newDocument.username,
                  isAdmin: newDocument.isAdmin
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
              })
              .catch(err => console.log(err));
      }
      else {
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
      }
    })
  })

  function makeNetidAdmin(username, res) {
    NetidUser.findOne({ username: username }).then(user => {
      if (!user) {
        return res.status(400).json({ username: "Username does not exist" });
      }
      if(user.isAdmin) {
        return res.status(400).json({ username: "User is already an admin"});
      }
      NetidUser.findOne({ username: username }, function (err, doc){
        doc.isAdmin = true;
        doc.save().then(updatedUser => res.json(updatedUser))
        .catch(err => console.log(err.message));
      });
    });
  }
  router.post("/makeAdmin", (req, res) => {
    User.findOne({ username: req.body.username }).then(user => {
        if (!user) {
          //No local user by this name
          makeNetidAdmin(req.body.username, res);
          return
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



    function revokeNetidAdmin(username, res) {
      NetidUser.findOne({ username: username }).then(user => {
        if (!user) {
          return res.status(400).json({ username: "Username does not exist" });
        }
        if(!user.isAdmin) {
          return res.status(400).json({ username: "User is not an admin"});
        }
        NetidUser.findOne({ username: username }, function (err, doc){
          doc.isAdmin = false;
          doc.save().then(updatedUser => res.json(updatedUser))
          .catch(err => console.log(err.message));
        });
      });
    }

  // @route POST api/users/revokeAdmin
  // @desc removes admin priviledges from req.body.username
  // @access Private
    router.post("/revokeAdmin", (req, res) => {
      User.findOne({ username: req.body.username }).then(user => {
          if (!user) {
            //No local user by this name
            revokeNetidAdmin(req.body.username, res);
            return
          }
          if(!user.isAdmin) {
            return res.status(400).json({ username: "User is not an admin"});
          }
          User.findOne({ username: req.body.username }, function (err, doc){
            doc.isAdmin = false;
            doc.save().then(updatedUser => res.json(updatedUser))
            .catch(err => console.log(err.message));
          });
        });
      });

  // @route POST api/users/delete
  // @desc removes a local user
  // @access Private
    router.post("/delete", (req, res) => {
      User.findOneAndRemove({username: req.body.username}).then(user => {
        if(!user) {
          //No local user, thus return error
          return res.status(400).json({ username: "User does not exist"})
        }
        res.status(200).json({username : "User deleted"})
      }).catch(err => console.log(err.message));
    })

  // @route GET api/users/
  // @desc gets all users (netid and local)
  // @access Private
    router.get("/", (req, res) => {
      User
        .find()
        .lean()
        .then( localUsers => {
          NetidUser
            .find()
            .lean()
            .then(netidUsers => {
              var users = localUsers.concat(netidUsers);
              res.status(200).json({users : users})
            }).catch(err => res.status(404).json({success: false, message: err.message}));
        }).catch(err => res.status(404).json({success: false, message: err.message}));
    })

  module.exports = router;
  