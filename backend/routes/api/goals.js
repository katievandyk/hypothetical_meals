const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Goal Model
const Goal = require('../../models/Goal');

// @route GET api/goals
// @desc get all goals
// @access public
router.get('/', (req, res) => {
    Goal
        .find()
        .lean()
        .then(goal => res.json(goal))
});

// @route POST api/goal
// @desc create a goal
// @access public
router.post('/', (req, res) => {
    const newGoal = new Goal({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        SKUs_list: req.body.SKUs_list
    });

    newGoal.save().then(goal => res.json(goal))
        .catch(err => res.status(404).json({success: false, message: err.message}));
});

module.exports = router;
