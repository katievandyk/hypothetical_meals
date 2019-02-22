const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const ManufacturingSchedule = require('../../models/ManufacturingSchedule');
const Goal = require('../../models/Goal');
const ManufacturingLine = require('../../models/ManufacturingLine');
const ManufacturingActivity = require('../../models/ManufacturingActivity');




// @route GET api/manufacturingschedule
// @desc get all manufacturing schedules for specific user
// @access public
router.get('/', (req, res) => {
    ManufacturingSchedule
        .findOne()
        .then(schedule => res.json(schedule))
        .catch(err => res.status(404).json({success: false, message: err.message}));
});

// @route POST api/manufacturingschedule
// @desc create a manufacturing schedule
// @access public
router.post('/', (req, res) => {
    newSchedule = new ManufacturingSchedule({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name
    })
    newSchedule
        .save()
        .then(schedule => res.json(schedule))
        .catch(err => res.status(404).json({success: false, message: err.message}));
});

// @route POST api/manufacturingschedule/enable/:goal_id/:schedule
// @desc enable goal with certain id
// @access public
router.post('/enable/:goal_id/:schedule', (req, res) => {
    Goal
        .findById(req.params.goal_id)
        .then( goal => {
            ManufacturingSchedule
                .findOneAndUpdate({ 'name': req.params.schedule }, {$push: {enabled_goals: goal}})
                .then(res.json(goal))
                .catch(err => res.status(404).json({success: false, message: err.message}));
        })
        .catch(err => res.status(404).json({success: false, message: err.message}));
        
})

// @route POST api/manufacturingschedule/disable/:goal_id
// @desc disable goal with certain id
// @access public
router.post('/disable/:goal_id/:schedule', (req, res) => {
    Goal
        .findById(req.params.goal_id)
        .then( goal => {
            ManufacturingSchedule
                .findOneAndUpdate({ 'name': req.params.schedule }, {$pull: {enabled_goals: {_id : goal._id}}})
                .then(res.json(goal))
                .catch(err => res.status(404).json({success: false, message: err.message}));
        })
        .catch(err => res.status(404).json({success: false, message: err.message}));
        
})

// @route GET api/manufacturingschedule/skus/:goal_id
// @desc get all sku's and range for specific goal
// @access public
router.get('/skus/:goal_id', (req, res) => {
    Goal
        .findById(req.params.goal_id)
        .then( goal => {
            var skus = goal.skus_list;
            for( var i = 0; i < skus.length; i++) {
                var quantity = skus[i].quantity;
                SKU
                    .findById(skus[i].sku)
                    .then( sku => {
                        var duration = quantity / sku.manufacturing_rate;
                        res.json({'sku' : sku, 'duration' : duration});
                    })
                    .catch(err => res.status(404).json({success: false, message: err.message}));
            }
        })
        .catch(err => res.status(404).json({success: false, message: err.message}));
})

// @route POST api/manufacturingschedule/activity
// @desc posts an activity
// @req.body => {name : activity_name, sku_id : sku_id, line_id : line_id, start : YYYY-mm-ddTHH:MM:ssZ, duration : hours}
// @access public
router.post('/activity', (req, res) => {
    SKU
        .findById(req.body.sku_id)
        .then( sku => {
            ManufacturingLine
                .findById(req.body.line_id)
                .then( line => {
                    const activity = new ManufacturingActivity({
                        _id : new mongoose.Types.ObjectId(),
                        name : req.body.name,
                        sku : sku,
                        line : line,
                        start : req.body.start,
                        duration : req.body.duration
                    })
                    activity.save().then(res.json(activity))
                    .catch(err => res.status(404).json({success: false, message: err.message}));
                })
                .catch(err => res.status(404).json({success: false, message: err.message}));
        })
        .catch(err => res.status(404).json({success: false, message: err.message}));
    
})

// @route POST api/manufacturingschedule/update/activity
// @desc updates an activity's start date
// @access public
router.post('/update/activity/:activity_id', (req, res) => {
    ManufacturingActivity
        .findOne({_id : req.params.activity_id}).then( doc => {
            doc.start = req.body.start;
            doc.save().then( updatedActivity => {
                res.json(updatedActivity)
            })
            .catch(err => res.status(404).json({success: false, message: err.message}));
        })
        .catch(err => res.status(404).json({success: false, message: err.message}));
})

module.exports = router;
