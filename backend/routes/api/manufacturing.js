const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Papa = require('papaparse');
const Helpers = require('../../bulk_import/helpers')
const Constants = require('../../bulk_import/constants')

// Goal Model
const Goal = require('../../models/Goal');
const round = require('mongo-round');

// @route GET api/manufacturing/:user_email
// @desc get all goals for specific user
// @access public
router.get('/:user_email', (req, res) => {
    Goal
        .find({ 'user_email' : req.params.user_email})
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
        user_email: req.body.user_email,
        deadline: req.body.deadline
    });

    newGoal.save().then(goal => res.json(goal))
        .catch(err => console.log(err.message));
});

// @route DELETE api/manufacturing/:id
// @desc delete a goal
// @access public
router.delete('/:id', (req, res) => {
   Goal.findById(req.params.id)
        .then(goal => goal.remove().then(
            () => res.json({success: true}))
        ).catch(err => res.status(404).json({success: false, message: err.message}))
});

// @route POST api/manufacturing/update/:id
// @desc updates a goal
// @access public
router.post('/update/:id', (req, res) => {
    Goal.findOne({name: req.body.name}).then(goal => {
        if(goal !== null && req.params.id != goal._id) {
            res.status(404).json({success: false, message: "Goal name is not unique: " + req.body.name})
        }
        else {
            Goal.findByIdAndUpdate(req.params.id, {$set:req.body})
            .then(() => res.json({success: true}))
            .catch(err => res.status(404).json({success: false, message: err.message}))
        }
    }).catch(err => res.status(404).json({success: false, message: err.message}))
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

function calculateIngredientQuantities(req, res, callback) {
    Goal.findById(req.params.id).lean().populate("skus_list.sku").then(goal => {
        Formula.populate(goal, {path:"skus_list.sku.formula"}).then(f_pop => {
            Ingredient.populate(f_pop, {path:"skus_list.sku.formula.ingredients_list._id"})
            .then(populated => {
                ing_per_sku = populated.skus_list.map(sku => {
                    ing_qty = sku.sku.formula.ingredients_list.map(ing => {
                        extracted_ps = Helpers.extractUnits(ing._id.package_size)
                        package_num = extracted_ps[0]
                        package_unit = extracted_ps[1]

                        extracted_fs = Helpers.extractUnits(ing.quantity)
                        formula_qty = extracted_fs[0]
                        formula_unit = extracted_fs[1]

                        calculations = calculate(package_num, package_unit, formula_qty, formula_unit, sku)
                        let ing_qty = calculations[0]
                        let packages = calculations[1]
                        let unit = calculations[2]
                        
                        return {ingredient: ing._id, quantity: ing_qty, packages: packages, unit: unit}
                    })
                    return ing_qty
                })

                groupedByIng = groupByIngredient(ing_per_sku)

                const reducer = (accumulator, currentValue) => {
                    accumulator.quantity =  accumulator.quantity + currentValue.quantity;
                    accumulator.packages =  accumulator.packages + currentValue.packages;
                    return accumulator
                }

                aggregated = Object.values(groupedByIng)
                .map(one_ing => one_ing.reduce(
                    reducer, {
                        ingredient: one_ing[0].ingredient, 
                        quantity: 0, 
                        packages: 0, 
                        unit: one_ing[0].unit}))

                aggregated.forEach(ing => {
                    ing.quantity = ing.quantity + " " + ing.unit
                    ing.packages = ing.packages + " packages"
                    delete ing.unit
                })

                callback(res, aggregated)
            })
        })
    })
}

function getIngrQtyCallback(res, aggregated) {
    res.json(aggregated)
}

function groupByIngredient(res) {
    var merged = [].concat.apply([], res);
    return merged.reduce(function(r,a) {
        r[a.ingredient] = r[a.ingredient] || [];
        r[a.ingredient].push(a);
        return r;
    }, Object.create(null))
}

function calculate(package_num, package_unit, formula_qty, formula_unit, sku) {
    let ing_qty, packages, unit
    if(Constants.units[package_unit] == "weight" && Constants.units[formula_unit] == "weight") {
        formula_qty_converted = formula_qty * Constants.weight_conv[formula_unit] / Constants.weight_conv[package_unit] * (sku.sku.formula_scale_factor) * sku.quantity
        ing_qty = (Math.round(formula_qty_converted * 100) / 100)
        packages = (Math.round(formula_qty_converted/package_num * 100) / 100) 
        unit = package_unit
    }
    else if(Constants.units[package_unit] == "volume" && Constants.units[formula_unit] == "volume") {
        formula_qty_converted = formula_qty * Constants.volume_conv[formula_unit] / Constants.volume_conv[package_unit] * (sku.sku.formula_scale_factor) * sku.quantity
        ing_qty = (Math.round(formula_qty_converted * 100) / 100)
        packages = (Math.round(formula_qty_converted/package_num * 100) / 100) 
        unit = package_unit
    }
    else { // count
        formula_qty_converted = formula_qty * (sku.sku.formula_scale_factor) * sku.quantity
        ing_qty = (Math.round(formula_qty_converted * 100) / 100)
        packages = (Math.round(formula_qty_converted / package_num * 100) / 100)
        unit = "count"
    }
    return [ing_qty, packages, unit]
}

module.exports = router;
