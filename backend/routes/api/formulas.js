const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Formula = require('../../models/Formula');
const Helper = require('../../bulk_import/helpers')

// @route GET api/formulas
// @desc get all formulas
// @access public
router.get('/', (req, res) => {
    Formula
        .find()
        .lean()
        .then(formulas => res.json(formulas))
});

function checkFormulaFields(obj) {
    if(!(obj.name) || !(obj.number)) 
        throw new Error(`Formula name and number are required. Got: ${obj.name}, ${obj.number}`)
    if(obj.name.length > 32)
        throw new Error(`Formula name must be less than 32 characters. Got length ${obj.name.length} in ${obj.name}`)
    if(!Helper.isPositiveInteger(obj.number))
        throw new Error(`Formula number should be a positive number. Got: ${obj.number}`)
} 

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
            checkFormulaFields(formulaObj)
            if(req.body.ingredients_list && !Array.isArray(req.body.ingredients_list))
                throw new Error("Formula ingredients list must be an array.")
            if(req.body.ingredients_list)
                req.body.ingredients_list.forEach(tuple => {
                    if(!(tuple._id && tuple.quantity))
                        throw new Error("Formula ingredients list must contain id and quantity")
                    if(!Helper.isNumeric(tuple.quantity))
                        throw new Error("Formula ingredients list quantity must be a number.")
                })
        } catch(err) {
            res.status(404).json({success: false, message: err.message})
            return;
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
            checkFormulaFields(updatedFormula)
            if(req.body.ingredients_list != null && !Array.isArray(req.body.ingredients_list))
                throw new Error("Formula ingredients list must be an array.")
            if(req.body.ingredients_list)
                req.body.ingredients_list.forEach(tuple => {
                    if(!(tuple._id && tuple.quantity)) {
                        throw new Error("Formula ingredients list must contain id and quantity")
                    }
                    if(!Helper.isNumeric(tuple.quantity)) {
                        throw new Error("Formula ingredients list quantity must be a number.")
                    }
            })
        } catch(err) {
            res.status(404).json({success: false, message: err.message})
            return;
        }

        Formula.findOne({number: updatedFormula.number}).then(formula_old => {
                if(formula_old != null && formula_old._id.toString() != formula._id.toString())
                    res.status(404).json({success: false, message: "Formula number is not unique: " + updatedFormula.number})
                else
                    Formula.findByIdAndUpdate(req.params.id, {$set:req.body})
                    .then(() => res.json({success: true}))
            })
        })})

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

module.exports = router;
