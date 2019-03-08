const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Papa = require('papaparse');
const Helpers = require('../../bulk_import/helpers')
const Constants = require('../../bulk_import/constants')
const ManufacturingActivity = require('../../models/ManufacturingActivity');
// Goal Model
const Goal = require('../../models/Goal');
const round = require('mongo-round');


// @route GET api/manufacturing/
// @desc get all goals for all users
// @access public
router.get('/', (req, res) => {
    Goal
        .find()
        .populate({ path: 'skus_list.sku'})
        .lean()
        .then(goal => res.json(goal))
});
// @route GET api/manufacturing/:user_username
// @desc get all goals for specific user
// @access public
router.get('/:user_username', (req, res) => {
    Goal
        .find({ 'user_username' : req.params.user_username})
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
        skus_list: req.body.skus_list,
        user_username: req.body.user_username,
        deadline: req.body.deadline
    });

    newGoal.save().then(goal => res.json(goal))
        .catch(err => res.json({success: false, message: err.message}));
});

// @route DELETE api/manufacturing/:id
// @desc delete a goal
// @access public
router.delete('/:id', (req, res) => {
    ManufacturingActivity.find({goal_id: req.params.id}).then(activities => {
        Promise.all(activities.map(activity => {
            return new Promise(function(accept, reject) {
                ManufacturingActivity.findByIdAndDelete(activity._id).then(accept).catch(reject);
            })
        })).then(() => {
            ManufacturingSchedule.findOne().lean().then(schedule => {
                var newGoals = []
                newGoals = schedule.enabled_goals.filter(goal => {
                    return goal._id.toString() !== req.params.id.toString()
                });

                ManufacturingSchedule.findByIdAndUpdate(schedule._id, {$set:{enabled_goals: newGoals}})
                .then(() => {
                    Goal.findById(req.params.id)
                    .then(goal => goal.remove().then(
                        () => res.json({success: true})
                    ))
                })
            })
        })
     })
});

// @route POST api/manufacturing/update/:id
// @desc updates a goal
// @access public
router.post('/update/:id', (req, res) => {
    Goal.findById(req.body.id).then(goal => {
        if(goal !== null && req.params.id != goal._id) {
            res.status(404).json({success: false, message: "Goal name is not unique: " + req.body.name})
        }
        else {
            var removedSKUs = goal.skus_list.filter( item => {
                return !req.body.skus_list.some(new_list => new_list.sku._id.toString() === item.sku.toString())
            })
            var updatedSKUQtys = req.body.skus_list.filter(item => {
                old_entry = goal.skus_list.filter(e => e.sku.toString() === item.sku._id.toString())
                if(old_entry.length > 0)
                    return old_entry[0].quantity != item.quantity
                else
                    return false
            }).map(sku => sku.sku._id)
            ManufacturingActivity.find({sku : {$in: updatedSKUQtys}, goal_id: goal._id}).then(activities => {
                if(activities.length > 0)
                    res.status(404).json({success: false, message: `SKU quantity cannot be updated because an activity for it has already been created.`})
                else {
                    Promise.all(removedSKUs.map(remSku => {
                        return new Promise(function(accept, reject) {
                            ManufacturingActivity.findOne({sku: remSku.sku, goal_id: goal._id})
                            .then(activity => {
                                if(activity)
                                    ManufacturingActivity.findByIdAndDelete(activity._id).then(accept).catch(reject)
                                else
                                    accept()
                            })
                        })
                    })).then(() => {
                        Goal.findByIdAndUpdate(req.params.id, {$set:req.body})
                        .then(() => res.json({success: true}))
                        .catch(err => res.status(404).json({success: false, message: err.message}))
                    })
                }
            })
        }
    })
});

// @route GET api/manufacturing/export/:id
// @desc export a goal
// @access public
router.get('/export/:id', (req, res) => {
        Goal.aggregate(
            [ { $match: {'_id': mongoose.Types.ObjectId(req.params.id) }},
              { $project: { skus_list: "$skus_list"} },
              { $unwind: "$skus_list" },
              { $replaceRoot: { newRoot: "$skus_list" } },
              {
                   $lookup: {
                       from: 'skus',
                       localField: 'sku',
                       foreignField: '_id',
                       as: 'sku'
                   } },
              { $unwind: "$sku" },
              { $project: { _id: 0, "SKU Name": "$sku.name", "Number": "$sku.number", "Unit Size": "$sku.unit_size",
                    "Count Per Case": "$sku.count_per_case", "Quantity": "$quantity" }},

            ]
         ).then(result => {
             var csv = Papa.unparse(result)
              res.setHeader('Content-Type', 'text/csv')
              res.status(200).send(csv)
         }).catch(err => res.status(404).json({success: false, message: err.message}));
});


// @route POST api/manufacturing/exportcalculator/:id
// @desc get quantities of all ingredients needed for manufacturing goal
// @access public
router.get('/exportcalculator/:id', (req, res) => {
    calculateIngredientQuantities(req, res, exportIngrQtyCallback)
});

function exportIngrQtyCallback(res, aggregated) {
    unnested = aggregated.map(entry => {
        return {
            name: entry.ingredient.name,
            number: entry.ingredient.number,
            vendor_info: entry.ingredient.vendor_info,
            package_size: entry.ingredient.package_size,
            cost_per_package: entry.ingredient.cost_per_package,
            quantity: entry.quantity,
            packages: entry.packages
        }
    })
    let header = "Ingredient Name,Ingredient Number,Vendor Info,Package Size,Cost Per Package,Quantity,Packages\r\n"
    let csv = Papa.unparse({data: unnested}, {header: false});
    let headerAppended = header + csv
    res.setHeader('Content-Type', 'text/csv')
    res.status(200).send(headerAppended)
}

router.get('/', (req, res) => {
    Goal.find().lean().then(result => res.json(result));
})


// @route GET api/manufacturing/ingquantities/:id
// @desc get quantities of all ingredients needed for manufacturing goal
// @access public
router.get('/ingquantities/:id', (req, res) => {
    calculateIngredientQuantities(req, res, getIngrQtyCallback)
})

function getIngrQtyCallback(res, aggregated) {
    res.json(aggregated)
}

function calculateIngredientQuantities(req, res, callback) {
    Goal.findById(req.params.id).lean().populate("skus_list.sku").then(goal => {
        Formula.populate(goal, {path:"skus_list.sku.formula"}).then(f_pop => {
            Ingredient.populate(f_pop, {path:"skus_list.sku.formula.ingredients_list._id"})
            .then(populated => {
                aggregated = Helpers.processIngredientForCalculator(populated)

                callback(res, aggregated)
            })
        })
    })
}

module.exports = router;
