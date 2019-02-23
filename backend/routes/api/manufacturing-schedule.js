const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const ManufacturingSchedule = require('../../models/ManufacturingSchedule');
const Goal = require('../../models/Goal');
const ManufacturingLine = require('../../models/ManufacturingLine');
const ManufacturingActivity = require('../../models/ManufacturingActivity');
const Helpers = require('../../bulk_import/helpers')
const Constants = require('../../bulk_import/constants')

// @route GET api/manufacturingschedule
// @desc get all manufacturing schedules for specific user
// @access public
router.get('/', (req, res) => {
    ManufacturingSchedule
        .find()
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
                .then(
                    ManufacturingActivity
                        .find({ 'goal_id' : req.params.goal_id}, function(err, activities){
                            if(err) {
                                console.log(err);
                            }
                            else {
                                res.json(activities);
                            }
                        })
                        .catch(err => res.status(404).json({success: false, message: err.message}))
                )
                .catch(err => res.status(404).json({success: false, message: err.message}));
        })
        .catch(err => res.status(404).json({success: false, message: err.message}));
})

router.post('/test/:goal_id', (req, res) => {
    
})

// @route POST api/manufacturingschedule/skus
// @desc get all sku's and range for an array of goals
// @access public
router.post('/skus', (req, res) => {
    var goals = req.body.goals;
    Promise.all(goals.map(goal_id => {
        return new Promise(function(accept, reject) {
            Goal
            .findById(goal_id)
            .populate("skus_list.sku")
            .lean()
            .then(goal => {
                console.log(goal)
                Formula.populate(goal, {path:"skus_list.sku.formula"}).then(goal => {
                    let skus_list = goal.skus_list.map(skus => {
                        skus.sku.duration = skus.sku.manufacturing_rate*skus.quantity
                        let goal_info = {
                            _id: goal._id,
                            name: goal.name,
                            user_username: goal.user_username,
                            deadline: goal.deadline
                        }
                        skus.sku.goal_info = goal_info
                        return skus.sku;
                    })
                    accept(skus_list)
                })
            }).catch(reject);
        })
    })).then(skus => {
        let flat = [].concat.apply([], skus);
        res.json(flat)
    })
})

// @route POST api/manufacturingschedule/activity
// @desc posts an activity
// @req.body => {name : activity_name, sku_id : sku_id, line_id : line_id, start : YYYY-mm-ddTHH:MM:ssZ, duration : hours, goal : sku.goal_info._id}
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
                        duration : req.body.duration,
                        goal_id : req.body.sku_goal_id
                    })
                    activity.save().then(activity => res.json(activity))
                    .catch(err => res.status(404).json({success: false, message: err.message}))
                }).catch(err => res.status(404).json({success: false, message: err.message}))
        }).catch(err => res.status(404).json({success: false, message: err.message}));
})

// @route POST api/manufacturingschedule/update/activity
// @desc updates an activity's start date
// @access public
router.post('/update/activity/:activity_id', (req, res) => {
    ManufacturingActivity
        .findOne({_id : req.params.activity_id}).then( doc => {
            doc._id = req.body._id;
            doc.name = req.body.name;
            doc.sku = req.body.sku;
            doc.line = req.body.line;
            doc.start = req.body.start;
            doc.duration = req.body.duration;
            doc.goal_id = req.body.goal_id
            doc.save().then( updatedActivity => {
                res.json(updatedActivity)
            })
            .catch(err => res.status(404).json({success: false, message: err.message}));
        })
        .catch(err => res.status(404).json({success: false, message: err.message}));
})

// @route POST api/manufacturingschedule/delete/activity
// @desc deletes all activities that are passed in an array
// @body pass array of activity id's in req.body.activities
// @access public
router.post('/delete/activity', (req, res) => {
    var activities = req.body.activites;
    Promise.all(activties.map(activity_id => {
        return new Promise(function(accept, reject) {
            Activity
                .findByIdAndDelete(activity_id)
                .then(accept)
                .catch(reject)
        })
    }))
})

// @route POST api/manufacturingschedule/report/
// @desc generates the information for the reports
// @body 
// - start: starting time of the schedule
// - end: ending time of the schedule
// - line_id: id of the manufacturing line
// @returns 
router.post('/report', (req, res) => {
    var startTime = new Date(req.body.start)
    var endTime = new Date(req.body.end)
    ManufacturingActivity
    .find({line: req.body.line_id.toString()})
    .sort("start")
    .populate("sku")
    .lean()
    .then(activities => {
        Formula.populate(activities, {path: "sku.formula"}).then(activity => {
            Ingredient.populate(activities, {path: "sku.formula.ingredients_list._id"})
            .then(activities => {
                let tasks = []
                var ingredients = []
                activities.forEach(activity => {
                    let activityEnd = new Date(activity.start)
                    activityEnd.setTime(activityEnd.getTime()+(activity.duration*60*60*1000))
                    let sku_quantity = 1.0 * activity.duration / activity.sku.manufacturing_rate
                    let ing_calcs = activity.sku.formula.ingredients_list.map(ing => {
                        extracted_ps = Helpers.extractUnits(ing._id.package_size)
                        package_num = extracted_ps[0]
                        package_unit = extracted_ps[1]

                        extracted_fs = Helpers.extractUnits(ing.quantity)
                        formula_qty = extracted_fs[0]
                        formula_unit = extracted_fs[1]

                        calculations = calculate(package_num, package_unit, formula_qty, formula_unit, activity.sku.formula_scale_factor , sku_quantity)
                        let ing_qty = calculations[0]
                        let packages = calculations[1]
                        let unit = calculations[2]
                        return {ingredient: ing._id, quantity: ing_qty, packages: packages, unit: unit} 
                    })
                    if (activity.start >= startTime && activityEnd <= endTime) {
                        tasks.push(activity)
                        addIngredientsToList(ingredients, ing_calcs, 1)
                    }
                    else if(activity.start < endTime && activity.start >= startTime) {
                        activity.actual_duration = (endTime.getTime()- startTime.getTime())/(60.0*60*1000)
                        activity.actual_end = endTime
                        tasks.push(activity)
                        addIngredientsToList(ingredients, ing_calcs, (activity.actual_duration/activity.duration))
                        
                    }
                    else if(activityEnd > startTime && activityEnd <= endTime) {
                        activity.actual_duration = (activityEnd.getTime() - startTime.getTime())/(60.0*60*1000)
                        activity.actual_start = startTime
                        tasks.push(activity)

                        addIngredientsToList(ingredients, ing_calcs, (activity.actual_duration/activity.duration))
                    }
                })

                let ing_list = Object.values(ingredients)
                ing_list.forEach(ing => {
                    ing.quantity = ing.quantity + " " + ing.unit
                    delete ing.unit
                })
                res.json({activities: tasks, ingredients: ing_list})
            })
        })
    })
})

function addIngredientsToList(ingredients, ing_calcs, part) {
    const reducer = (accumulator, currentValue) => {
        
        if (currentValue.ingredient._id in accumulator) {
            accumulator[currentValue.ingredient._id].quantity = accumulator[currentValue.ingredient._id].quantity + currentValue.quantity * part
            accumulator[currentValue.ingredient._id].packages = accumulator[currentValue.ingredient._id].packages + currentValue.packages * part
        }
        else {
            accumulator[currentValue.ingredient._id] = currentValue
        }
        return accumulator
    };
    return ing_calcs.reduce(reducer, ingredients)
}

function calculate(package_num, package_unit, formula_qty, formula_unit, formula_scale_factor, sku_quantity) {
    let ing_qty, packages, unit
    if(Constants.units[package_unit] == "weight" && Constants.units[formula_unit] == "weight") {
        formula_qty_converted = formula_qty * Constants.weight_conv[formula_unit] / Constants.weight_conv[package_unit] * formula_scale_factor * sku_quantity
        ing_qty = (Math.round(formula_qty_converted * 100) / 100)
        packages = (Math.round(formula_qty_converted/package_num * 100) / 100) 
        unit = package_unit
    }
    else if(Constants.units[package_unit] == "volume" && Constants.units[formula_unit] == "volume") {
        formula_qty_converted = formula_qty * Constants.volume_conv[formula_unit] / Constants.volume_conv[package_unit] * formula_scale_factor * sku_quantity
        ing_qty = (Math.round(formula_qty_converted * 100) / 100)
        packages = (Math.round(formula_qty_converted/package_num * 100) / 100) 
        unit = package_unit
    }
    else { // count
        formula_qty_converted = formula_qty * formula_scale_factor * sku_quantity
        ing_qty = (Math.round(formula_qty_converted * 100) / 100)
        packages = (Math.round(formula_qty_converted / package_num * 100) / 100)
        unit = "count"
    }
    return [ing_qty, packages, unit]
}


module.exports = router;
