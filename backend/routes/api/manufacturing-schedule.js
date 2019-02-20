const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const ManufacturingLine = require('../../models/ManufacturingLine');
const ManufacturingSchedule = require('../../models/ManufacturingSchedule');
const ManufacturingActivity = require('../../models/ManufacturingActivity');

const Parser = require('../../bulk_import/parser');

// @route GET api/manufacturingschedule
// @desc get all manufacturing schedules for specific user
// @access public
router.get('/', (req, res) => {
    ManufacturingSchedule
        .find()
        .lean()
        .then(schedule => res.json(schedule))
});

// @route POST api/manufacturingschedule/enable/:goal_id
// @desc enable goal with certain id
// @access public
router.post('/enable/:goal_id', (req, res) => {

})

// @route POST api/manufacturingschedule/disable/:goal_id
// @desc disable goal with certain id
// @access public
router.post('/disable/:goal_id', (req, res) => {

})

// @route GET api/manufacturingschedule/skus/:goal_id
// @desc get all sku's and range for specific goal
// @access public
router.get('/skus/:goal_id', (req, res) => {

})

// @route POST api/manufacturingschedule/activity
// @desc posts an activity
// @access public
router.post('/activity', (req, res) => {

})

// @route POST api/manufacturingschedule/update/activity
// @desc updates an activity
// @access public
router.post('/update/activity', (req, res) => {

})
