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
const mongoose = require('mongoose');

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
          _id: new mongoose.Types.ObjectId(),
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
            isAdmin: user.isAdmin,
            analyst: user.analyst,
            business: user.business,
            lines: user.lines,
            plant: user.plant,
            product: user.product
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
    User.findOne({ username: username }).then(user => {
      if(user && !user.isNetIdUser) {
        res.json({
          success: false,
          message: "Username already exists."
        })
        return;
      }
      if(!user) {
        //Make a user
        const newUser = new User({
          _id: new mongoose.Types.ObjectId(),
          name: name,
          username: username,
          isNetIdUser: true
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

  // @route POST api/users/makeAdmin
  // @desc grants admin priviledges from req.body.username
  // @access Private
  router.post("/makeAdmin", (req, res) => {	
    User.findOne({ username: req.body.username }).then(user => {	
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

  // @route POST api/users/revokeAdmin
  // @desc removes admin priviledges from req.body.username
  // @access Private
    router.post("/revokeAdmin", (req, res) => {
      User.findOne({ username: req.body.username }).then(user => {
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
  // body
  // - userid: object id of the user to remove
  // @access Private
    router.post("/delete", (req, res) => {
      User.findByIdAndDelete(req.body.userid).then(user => {
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
        .then( users => {
          res.status(200).json({users : users})
        }).catch(err => res.status(404).json({success: false, message: err.message}));
    })

  // @route POST api/users/makeAnalyst
  // @desc gives analyst role
  // @access public
  router.post("/makeAnalyst", (req, res) => {
    User.findOne({ username: req.body.username }).then(user => {
      if (!user) {
        //No local user by this name
        return res.status(400).json({success: false, message: "User does not exist"});
      }
      if(user.analyst) {
        return res.status(400).json({success: false, message: "User is already an Analyst"});
      }
      User.findOne({ username: req.body.username }, function (err, doc){
        doc.analyst = true;
        doc.save().then(updatedUser => res.json(updatedUser))
        .catch(err => console.log(err.message));
      });
    });
  })

  // @route POST api/users/revoke
  // @desc revokes analyst role
  // @access public
  router.post("/revokeAnalyst", (req, res) => {
    User.findOne({ username: req.body.username }).then(user => {
      if (!user) {
        //No local user by this name
        return res.status(400).json({success: false, message: "User does not exist"});
      }
      if(!user.analyst) {
        return res.status(400).json({success: false, message: "User is not an Analyst"});
      }
      User.findOne({ username: req.body.username }, function (err, doc){
        doc.analyst = false;
        doc.save().then(updatedUser => res.json(updatedUser))
        .catch(err => console.log(err.message));
      });
    });
  })

  // @route POST api/users/makeProduct
  // @desc gives product manager role
  // @access public
  router.post("/makeProduct", (req, res) => {
    User.findOne({ username: req.body.username }).then(user => {
      if (!user) {
        //No local user by this name
        return res.status(400).json({success: false, message: "User does not exist"});
      }
      if(user.product) {
        return res.status(400).json({success: false, message: "User is already an Product Manager"});
      }
      User.findOne({ username: req.body.username }, function (err, doc){
        doc.product = true;
        doc.save().then(updatedUser => res.json(updatedUser))
        .catch(err => console.log(err.message));
      });
    });
  })

  // @route POST api/users/revokeProduce
  // @desc revokes product manager role
  // @access public
  router.post("/revokeProduct", (req, res) => {
    console.log('is revoking product')
    User.findOne({ username: req.body.username }).then(user => {
      if (!user) {
        //No local user by this name
        return res.status(400).json({success: false, message: "User does not exist"});
      }
      if(!user.product) {
        return res.status(400).json({success: false, message: "User is not Product Manager"});
      }
      User.findOne({ username: req.body.username }, function (err, doc){
        doc.product = false;
        doc.save().then(updatedUser => res.json(updatedUser))
        .catch(err => console.log(err.message));
      });
    });
  })

  // @route POST api/users/makeBusiness
  // @desc gives business manager role
  // @access public
  router.post("/makeBusiness", (req, res) => {
    User.findOne({ username: req.body.username }).then(user => {
      if (!user) {
        //No local user by this name
        return res.status(400).json({success: false, message: "User does not exist"});
      }
      if(user.business) {
        return res.status(400).json({success: false, message: "User is already a Business Manager"});
      }
      User.findOne({ username: req.body.username }, function (err, doc){
        doc.business = true;
        doc.save().then(updatedUser => res.json(updatedUser))
        .catch(err => console.log(err.message));
      });
    });
  })

  // @route POST api/users/revokeBusiness
  // @desc revokes business manager role
  // @access public
  router.post("/revokeBusiness", (req, res) => {
    User.findOne({ username: req.body.username }).then(user => {
      if (!user) {
        //No local user by this name
        return res.status(400).json({success: false, message: "User does not exist"});
      }
      if(!user.business) {
        return res.status(400).json({success: false, message: "User is not Business Manager"});
      }
      User.findOne({ username: req.body.username }, function (err, doc){
        doc.business = false;
        doc.save().then(updatedUser => res.json(updatedUser))
        .catch(err => console.log(err.message));
      });
    });
  })

  // @route POST api/users/makePlant
  // @desc gives business manager role
  // @body username, lines
  // @access public
  router.post("/makePlant", (req, res) => {
    User.findOne({ username: req.body.username }).then(user => {
      if (!user) {
        //No local user by this name
        return res.status(400).json({success: false, message: "User does not exist"});
      }
      if(user.plant) {
        //return res.status(400).json({success: false, message: "User is already a Plant Manager"});
      }
      User.findOne({ username: req.body.username }, function (err, doc){
        doc.plant = true;
        doc.lines.push(req.body.line);
        doc.save().then(updatedUser => res.json(updatedUser)).catch(err => console.log(err.message));
      });
    })
  })

  // @route POST api/users/revokePlant
  // @desc gives business manager role. 
  // @body username, lines
  // @access public
  router.post("/revokePlant", (req, res) => {
    User.findOne({ username: req.body.username }).then(user => {
      if (!user) {
        //No local user by this name
        return res.status(400).json({success: false, message: "User does not exist"});
      }
      if(user.plant) {
        //This case is not relevant for plant manager
      }
      User.findOne({ username: req.body.username }, function (err, doc){
        doc.lines.pull(req.body.line);
        if(doc.lines.length==0) {
          doc.plant = false;
        }
        doc.save().then(updatedUser => res.json(updatedUser))
        .catch(err => console.log(err.message));
      });
    });
  })

  module.exports = router;