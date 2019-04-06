const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const ManufacturingSchedule = require('../../models/ManufacturingSchedule');
const Goal = require('../../models/Goal');
const ManufacturingLine = require('../../models/ManufacturingLine');
const ManufacturingActivity = require('../../models/ManufacturingActivity');
const Helpers = require('../../bulk_import/helpers')
const Constants = require('../../bulk_import/constants')
const moment = require('moment');

// @route GET api/manufacturingschedule
// @desc get all manufacturing schedules for specific user
// @access public
router.get('/', (req, res) => {
    ManufacturingSchedule
        .findOne()
        .then(schedule => res.json(schedule))
        .catch(err => res.status(404).json({success: false, message: err.message}));
});

// @route GET api/manufacturingschedule/activity
// @desc get all manufacturing activities for user
// @access public
router.get('/activity', (req, res) => {
    ManufacturingActivity
        .find()
        .populate("sku")
        .populate("line")
        .populate("goal_id")
        .then(activity => res.json(activity))
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
                .findOneAndUpdate({ '_id': req.params.schedule }, {$push: {enabled_goals: goal}})
                .then(
                    ManufacturingActivity
                        .find({ 'goal_id' : req.params.goal_id})
                        .then( activities => {
                            Promise.all(activities.map(activity => {
                                return new Promise(function(accept, reject) {
                                    activity.orphan=false;
                                    activity.save().then(accept).catch(reject);
                                })
                            })).then(
                                ManufacturingActivity.find({orphan:true}).then(orphans => {
                                    res.json({'activities' : orphans.filter(function(item) {
                                        activities.forEach(activity => {
                                            if(activity._id === item._id){
                                                return false;
                                            }
                                            else {
                                                return true;
                                            }
                                        })
                                    }), 'goal' : goal});
                                })
                            )
                        })
                        .catch(err => res.status(404).json({success: false, message: err.message}))
                )
                .catch(err => res.status(404).json({success: false, message: err.message}));
        })
        .catch(err => res.status(404).json({success: false, message: err.message}));

})

// @route POST api/manufacturingschedule/disable/:goal_id/:schedule
// @desc disable goal with certain id
// @access public
// Returns json of activities and goal_id, where activities is an array of orphaned activities
// Each activity has activity.orphan = true;
router.post('/disable/:goal_id/:schedule', (req, res) => {
    Goal
        .findById(req.params.goal_id)
        .then( goal => {
            ManufacturingSchedule
                .findOneAndUpdate({ '_id': req.params.schedule }, {$pull: {enabled_goals: {_id : goal._id}}})
                .then(
                    ManufacturingActivity
                        .find({ 'goal_id' : req.params.goal_id})
                        .then( activities => {
                            Promise.all(activities.map(activity => {
                                return new Promise(function(accept, reject) {
                                    activity.orphan=true;
                                    activity.save().then(accept).catch(reject);
                                })
                            })).then(
                                ManufacturingActivity.find({orphan:true}).then(old_orphans => {
                                    res.json({'activities' : old_orphans.concat(activities), 'goal_id' : req.params.goal_id});
                                })
                            )
                        })
                        .catch(err => res.status(404).json({success: false, message: err.message}))
                )
                .catch(err => res.status(404).json({success: false, message: err.message}));
        })
        .catch(err => res.status(404).json({success: false, message: err.message}));
})

// @route POST api/manufacturingschedule/skus
// @desc get all sku's and range for an array of goals
// @access public
router.get('/skus', (req, res) => {
    ManufacturingSchedule.findOne().then(schedule => {
    Promise.all(schedule.enabled_goals.map(_id => {
        return new Promise(function(accept, reject) {
            Goal
            .findById(_id)
            .populate("skus_list.sku")
            .lean()
            .then(goal => {
                Formula.populate(goal, {path:"skus_list.sku.formula"}).then(goal => {
                    let skus_list = goal.skus_list.map(skus => {
                        skus.sku.duration = Math.ceil(skus.quantity/skus.sku.manufacturing_rate)
                        let goal_info = {
                            _id: goal._id,
                            name: goal.name,
                            user_id: goal.user_id,
                            deadline: goal.deadline
                        }
                        skus.sku.goal_info = goal_info
                        return skus.sku;
                    })
                    let groupedByGoal = groupByGoal(skus_list)
                    let final_output = []
                    Object.values(groupedByGoal).forEach(goal_skus => {
                        final_output.push({
                            goal: goal_skus[0].goal_info,
                            skus: goal_skus
                        })
                    })
                    accept(final_output)
                })
            }).catch(reject);
        })
    })).then(skus => {
        let flat = [].concat.apply([], skus);
        res.json(flat)
    })
  })
})

function groupByGoal(res) {
    return res.reduce(function(r,a) {
        r[a.goal_info._id] = r[a.goal_info._id] || [];
        r[a.goal_info._id].push(a);
        return r;
    }, Object.create(null))
}

// @route POST api/manufacturingschedule/activity
// @desc posts an activity
// @req.body => {name : activity_name, sku_id : sku_id, line_id : line_id, start : YYYY-mm-ddTHH:MM:ssZ, duration : hours,goal  : sku.goal_info._id}
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
                        end : req.body.end,
                        duration : req.body.duration,
                        durationModified: false,
                        goal_id : req.body.goal_id
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
            doc.end = req.body.end;
            doc.duration = req.body.duration;
            doc.durationModified = req.body.durationModified;
            doc.goal_id = req.body.goal_id
            doc.orphan = req.body.orphan;

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
    var activities = req.body.activities;
    Promise.all(activities.map(activity_id => {
        return new Promise(function(accept, reject) {
            ManufacturingActivity
                .findByIdAndDelete(activity_id)
                .then(accept)
                .catch(reject)
        })
    })).then(res.json({success: true}))
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
                    let sku_quantity = 1.0 * activity.duration * activity.sku.manufacturing_rate
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
                    if (activity.start >= startTime && activity.end <= endTime) {
                        var diff =  Math.floor((activity.end.getTime()- activity.start.getTime()) / 86400000);
                        var duration = (activity.end.getTime()- activity.start.getTime()- (diff)*50400000)/(60.0*60*1000)
                        activity.actual_duration = activity.duration
                        activity.actual_start = activity.start
                        activity.actual_end = activity.end
                        tasks.push(activity)
                        addIngredientsToList(ingredients, ing_calcs, 1)
                    }
                    else if(activity.start < endTime && activity.start >= startTime) {
                        var diff =  Math.floor((endTime.getTime()- activity.start.getTime()) / 86400000);
                        activity.actual_duration = (endTime.getTime()- activity.start.getTime()- diff*50400000)/(60.0*60*1000)
                        
                        activity.actual_start = activity.start 
                        activity.actual_end = endTime
                        tasks.push(activity)
                        
                        addIngredientsToList(ingredients, ing_calcs, (activity.actual_duration/activity.duration))

                    }
                    else if(activity.end > startTime && activity.end <= endTime) {
                        var diff =  Math.floor((activity.end.getTime()- startTime.getTime()) / 86400000);
                        activity.actual_duration = (activity.end.getTime() - startTime.getTime()-diff*50400000)/(60.0*60*1000)
                        activity.actual_start = startTime
                        activity.actual_end = activity.end
                        tasks.push(activity)

                        addIngredientsToList(ingredients, ing_calcs, (activity.actual_duration/activity.duration))
                    }
                    else if (activity.start <= startTime && activity.end >= endTime){
                        var diff =  Math.floor((endTime.getTime()- startTime.getTime()) / 86400000);
                        activity.actual_duration = (endTime.getTime() - startTime.getTime()-diff*50400000)/(60.0*60*1000)

                        activity.actual_start = startTime
                        activity.actual_end = endTime
                        tasks.push(activity)

                        addIngredientsToList(ingredients, ing_calcs, (activity.actual_duration/activity.duration))
                    }

                     
                })

                let ing_list = Object.values(ingredients)
                ing_list.forEach(ing => {
                    ing.quantity = (Math.round(ing.quantity * 100) / 100) + " " + ing.unit
                    ing.packages = (Math.round(ing.packages * 100) / 100)
                    delete ing.unit
                })

                let req_info = {line: req.body.line_id, start: req.body.start, end: req.body.end}
                ManufacturingLine.populate(req_info, {path: "line"}).then(info => {
                    res.json({info: req_info, activities: tasks, ingredients: ing_list})
                }) 
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
            currentValue.quantity = currentValue.quantity * part
            currentValue.packages = currentValue.packages * part
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

// @route GET api/manufacturingschedule/search
// @desc searches keywords in database
// @access public
router.post('/search', (req, res) => {
    Goal.find({$text: {$search: req.body.keywords}},
        {score:{$meta: "textScore"}})
        .lean()
        .sort({score: {$meta: "textScore"}})
        .then(search_res => {
            res.json({success: true, results: search_res});
        })
        .catch(err => res.status(404).json({success: false, message: err.message}))});

// @route POST api/manufacturingschedule/activity
// @desc get all manufacturing activities for user
// @access public
router.post('/warnings', (req, res) => {
    ManufacturingActivity
        .find()
        .populate("sku")
        .populate("line")
        .populate("goal_id")
        .then(activities => {
            let warnings = [];
            activities.forEach(activity => {
            activityStart = new Date(activity.start)
            activityEnd = new Date(activity.end)
            windowStart = new Date(req.body.start)
            windowEnd = new Date(req.body.end)
            if((activityStart <= windowEnd && windowStart <= activityStart) || (activityEnd >= windowStart && activityEnd <= windowEnd) || (activityStart <= windowStart && activityEnd >= windowEnd)) {
                activityDeadline = new Date(activity.goal_id.deadline)
                  if(activity.durationModified) {
                      warnings.push('Activity ' + activity.name + ' has its range manually changed to ' + activity.duration + '.')
                   }
                   if(activityDeadline <= activityEnd) {
                      warnings.push('Activity ' + activity.name + ' is scheduled past its deadline, ' + activity.goal_id.deadline + '.')
                   }
                   if(activity.orphan) {
                      warnings.push('Activity ' + activity.name + ' is an orphan of goal, ' + activity.goal_id.name + '.')
                   }
               }
            })
            res.json(warnings)
        })
        .catch(err => res.status(404).json({success: false, message: err.message}));
});

// @route POST api/manufacturingschedule/automate
// @desc automates scheduling of manufacturing activities
// request body fields:
// - activities: tuple list containing {goal_id, sku_id, duration} 
// - user_id: id of the user to get their MLs
// - start_date
// - end_date
// @access public
router.post("/automate", (req, res) => {
    var startTime = moment(req.body.start_date, 'MM-DD-YYYY')
    var endTime = moment(req.body.end_date, 'MM-DD-YYYY')
    SKU.populate(req.body.activities, {path: "sku_id"}).then(skus_pop => {
        Goal.populate(skus_pop, {path: "goal_id"}).then(goals_pop => {
            goals_pop.sort((a,b) => {
                var a_date = new Date(a.goal_id.deadline)
                var b_date = new Date(b.goal_id.deadline)
                if (a_date.getTime() !== b_date.getTime()) {
                    return a_date - b_date
                }
                else {
                    return a.duration - b.duration 
                }
            });
            User.findById(req.body.user_id).lean().then(user => {
                var allowed_mls = user.lines.map(line => line._id) 
                ManufacturingActivity.find({"line": {$in: allowed_mls}}).lean().then(activities => {
                    var groupedByMl = activities.reduce(function(r,a) {
                        r[a.line] = r[a.line] || [];
                        r[a.line].push(a);
                        return r;
                    }, {})
    
                    var output = {}
                    output.unscheduled = []
                    goals_pop.forEach(activity => {
                        var options = []
                        for(var ml in allowed_mls) {
                            if (activity.sku_id.manufacturing_lines.filter(e => e._id.toString() == allowed_mls[ml].toString()).length == 0) {
                                continue;
                            }
                            var res = scheduleNext(startTime, endTime, activity.duration, groupedByMl[allowed_mls[ml]] || [])
                            console.log(res)
                            if(res.success) {
                                res.ml = allowed_mls[ml]
                                options.push(res)
                            }
                        }
                        if(options.length == 0) output.unscheduled.push(activity)
                        else {
                            var best = options.reduce((total, cur) => cur.start < total.start ? cur : total, options[0])
                            let act_list = groupedByMl[allowed_mls[ml]] || []
                            output[best.ml] = output[best.ml] || []
                            activity.start = best.start
                            activity.end = best.end
                            act_list.push(activity)
                            groupedByMl[best.ml] = act_list
                            output[best.ml].push(activity)
                        }

                    })
                    res.json(output)
                })
                
            })
            
        })
    })
})

function scheduleNext(startTime, endTime, duration, activities) {
    while(true) {
        console.log("before adjust start time: " + startTime.toDate())
        var curStart = adjustStartDate(startTime)
        console.log("start time: " + startTime.toDate())
        var curEnd = calculateEndDate(curStart, duration)
        if(curEnd > endTime) return {success: false}
        var overlapping = activities.filter(a => {
            var a_start = moment(a.start)
            var a_end = moment(a.end)
            return (a_start < curStart && a_end > curStart || a_start >= curStart && a_start < curEnd)
        })
        if(overlapping.length === 0) return {success: true, start: curStart.toDate(), end: curEnd.toDate()}
        startTime = overlapping
            .reduce((total, a) => moment(a.end) > total ? moment(a.end) : total, curStart)
    }
}

function calculateEndDate(startDate, duration) {
    var daystoAdd = Math.floor(duration/10)
    var hours = startDate.hour() + (duration % 10)
    if(startDate.hour() + (duration % 10) > 18) {
        daystoAdd++;
        hours = startDate.hour() + (duration % 10) - 10;
    }
    var endDate = moment(startDate);
    endDate.add(daystoAdd, 'd')

    var ds = moment("03-10-2019", "MM-DD-YYYY");
    var ds2 = moment("11-03-2019","MM-DD-YYYY");
    if(startDate.isBefore(ds) && endDate.isAfter(ds) && endDate.isBefore(ds2)) {
      hours++;
      if (hours > 18) {
        endDate.add(1,'d')
        hours = 9
      }
    }
    else if(startDate.isAfter(ds) && startDate.isBefore(ds2) && endDate.isAfter(ds2)) {
      hours--;
      if (hours < 8) {
        endDate.subtract(1, 'd')
        hours = 17
      }
    }
    endDate.set({ hour: hours })
    return endDate
  }

  function adjustStartDate(startDate) {
    if(startDate.get('hour') < 8) {
      startDate.hour(8)
      startDate.minute(0)
      startDate.second(0)
    }
    else if(startDate.get('hour') >= 18) {
      startDate.add(1, 'd')
      startDate.hour(8)
      startDate.minute(0)
      startDate.second(0)
    }
    return startDate
  }

module.exports = router;
