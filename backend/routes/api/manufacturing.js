const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Goal Model
const Goal = require('../../models/Goal');

// @route GET api/manufacturing
// @desc get all goals
// @access public
router.get('/', (req, res) => {
    Goal
        .find()
        .populate({ path: 'skus_list.sku'})
        .lean()
        .then(goal => res.json(goal))
});

// @route POST api/manufacturing
// @desc create a goal
// @access public
router.post('/', (req, res) => {
    const newGoal = new Goal({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        skus_list: req.body.skus_list
    });

    newGoal.save().then(goal => res.json(goal))
        .catch(err => res.status(404).json({success: false, message: err.message}));
});

module.exports = router;
