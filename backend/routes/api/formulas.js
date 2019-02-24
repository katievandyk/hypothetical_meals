const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Formula = require('../../models/Formula')
const Parser = require('../../bulk_import/parser')
const Helper = require('../../bulk_import/helpers')
const Constants = require('../../bulk_import/constants')
// @route GET api/formulas
// @desc get all formulas
// @access public
router.get('/', (req, res) => {
    Formula
        .find()
        .populate("ingredients_list._id")
        .lean()
        .then(formulas => res.json(formulas))
});

// @route POST api/formulas
// @desc create a formula
// @access public
router.post('/', (req, res) => {
    Formula.find().select("-_id number").sort({number: -1}).limit(1).then(max_number => {
        let numberResolved
        if(max_number.length === 0)
            numberResolved = 1
        else
            numberResolved = max_number[0].number+1

        numberResolved = req.body.number ? req.body.number : numberResolved

        formulaObj = {
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            number: numberResolved,
            comment: req.body.comment
        }
        formulaObj.ingredients_list = req.body.ingredients_list ? req.body.ingredients_list : [];

        try {
            Parser.checkFormulaFields(formulaObj.name, formulaObj.number)
            if(req.body.ingredients_list && !Array.isArray(req.body.ingredients_list))
                throw new Error("Formula ingredients list must be an array.")
            if(req.body.ingredients_list)
                req.body.ingredients_list.forEach(tuple => {
                    if(!(tuple._id && tuple.quantity))
                        throw new Error("Formula ingredients list must contain id and quantity")
                    if(!Helper.unitChecker(tuple.quantity)) 
                        throw new Error(
                            `Formula ingredient quantity is not formatted correctly: ` + tuple.quantity);
                })
        } catch(err) {
            res.status(404).json({success: false, message: err.message})
            return;
        }

        Promise.all(formulaObj.ingredients_list.map(ing => Ingredient.findById(ing._id)))
        .then(ings_res => {
            try {
                for (i = 0; i < formulaObj.ingredients_list.length; i++) {
                    if(!(ings_res[i])) {
                        throw new Error(`Ingr id for formula ${formulaObj.number} not found: ${formulaObj.ingredients_list[i]._id}.`)
                    }
    
                    let ing_unit = Helper.extractUnits(ings_res[i].package_size)[1]
                    let formula_qty = Helper.extractUnits(formulaObj.ingredients_list[i].quantity)[0]
                    let formula_unit = Helper.extractUnits(formulaObj.ingredients_list[i].quantity)[1]
                    if(Constants.units[ing_unit] !== Constants.units[formula_unit])
                        throw new Error(`Formula quantity for ingredient ${ings_res[i].name} can only be ${Constants.units[ing_unit]}-based. Found ${Constants.units[formula_unit]}-based unit: ${formula_unit}`)
                    formulaObj.ingredients_list[i].quantity = formula_qty + " " + Constants.units_display[formula_unit]
                }
            } catch(err) {
                res.status(404).json({success: false, message: err.message})
                return
            } 
            
            const newFormula = new Formula(formulaObj);

            Formula.findOne({number: formulaObj.number}).then(formula => {
                if(formula !== null) {
                    res.status(404).json({success: false, message: "Formula number is not unique: " + formulaObj.number})
                }
                else {
                    newFormula.save().then(formula => res.json(formula))
                    .catch(err => res.status(404).json({success: false, message: err.message}));
                }
            })
        })
    })
});

// @route POST api/formulas/update/:id
// @desc updates a formula
// @access public
router.post('/update/:id', (req, res) => {
    Formula.findById(req.params.id).lean().then(formula => {
        const updatedFormula = {
            name: req.body.name != null ? req.body.name : formula.name,
            number: req.body.number != null ? req.body.number : formula.number,
            ingredients_list: req.body.ingredients_list != null ? req.body.ingredients_list : formula.ingredients_list,
            comment: req.body.comment != null ? req.body.comment : formula.comment,
        };

        try {
            Parser.checkFormulaFields(updatedFormula.name, updatedFormula.number)
            if(req.body.ingredients_list != null && !Array.isArray(req.body.ingredients_list))
                throw new Error("Formula ingredients list must be an array.")
            if(req.body.ingredients_list)
                req.body.ingredients_list.forEach(tuple => {
                    if(!(tuple._id && tuple.quantity)) {
                        throw new Error("Formula ingredients list must contain id and quantity")
                    }
                    if(!Helper.unitChecker(tuple.quantity)) 
                        throw new Error(
                            `Formula ingredient quantity is not formatted correctly: ` + tuple.quantity);
                
            })
        } catch(err) {
            res.status(404).json({success: false, message: err.message})
            return;
        }
        
        Promise.all(updatedFormula.ingredients_list.map(ing => Ingredient.findById(ing._id)))
        .then(ings_res => {
            try {
                for (i = 0; i < updatedFormula.ingredients_list.length; i++) {
                    if(!(ings_res[i])) {
                        throw new Error(`Ingr id for formula ${updatedFormula.number} not found: ${updatedFormula.ingredients_list[i]._id}.`)
                    }
    
                    let ing_unit = Helper.extractUnits(ings_res[i].package_size)[1]
                    let formula_qty = Helper.extractUnits(updatedFormula.ingredients_list[i].quantity)[0]
                    let formula_unit = Helper.extractUnits(updatedFormula.ingredients_list[i].quantity)[1]
                    if(Constants.units[ing_unit] !== Constants.units[formula_unit])
                        throw new Error(`Formula quantity for ingredient ${ings_res[i].name} can only be ${Constants.units[ing_unit]}-based. Found ${Constants.units[formula_unit]}-based unit: ${formula_unit}`)
                    updatedFormula.ingredients_list[i].quantity = formula_qty + " " + Constants.units_display[formula_unit]
                }
            } catch(err) {
                res.status(404).json({success: false, message: err.message})
                return
            } 
            
            Formula.findOne({number: updatedFormula.number}).then(formula_old => {
                if(formula_old != null && formula_old._id.toString() != formula._id.toString())
                    res.status(404).json({success: false, message: "Formula number is not unique: " + updatedFormula.number})
                else
                    Formula.findByIdAndUpdate(req.params.id, {$set:req.body})
                    .then(() => res.json({success: true}))
            })
        })
    })
})

// @route POST api/formulas/filter/sort/:field/:asc/:pagenumber/:limit
// @desc gets formulas with many filters
// request param fields:
// - pagenumber: current page number
// - limit: number of records / page. -1 if want all records.
// request body fields:
// - ingredients: Array of ingredients ids (String) to search SKUs for
// - keywords: Array of words (String) to match entries on
// @access public
router.post('/filter/sort/:field/:asc/:pagenumber/:limit', (req, res) => {
    Helper.getFormulasFilterResult(req, res, Helper.sortAndLimit)
});

// @route DELETE api/formulas/:id
// @desc delete a formula
// @access public
router.delete('/:id', (req, res) => {
    SKU.find({formula: req.params.id}).then(result => {
        if(result === null || result.length !== 0) {
            res.status(404).json({success: false, message: "Formula cannot be deleted because one or more SKU(s) are associated with it."})
        }
        else {
            Formula.findById(req.params.id)
            .then(formula => formula.remove().then(
                () => res.json({success: true}))
            ).catch(err => res.status(404).json({success: false, message: err.message}))
        }
    })
});

// @route GET api/formulas/:id/skus
// @desc gets a list of skus for a formula
// @access public
router.get('/:id/skus', (req, res) => {
    SKU
        .find({ 'formula': mongoose.Types.ObjectId(req.params.id) })
        .lean()
        .populate('product_line')
        .populate('formula')
        .populate('manufacturing_lines._id')
        .then(skus => res.json(skus))
        .catch(err => res.status(404).json({success: false, message: err.message}));
});

module.exports = router;
