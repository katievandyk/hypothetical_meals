const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Helper = require('../../bulk_import/helpers');
const Parser = require('../../bulk_import/parser')

// SKU Model
const SKU = require('../../models/SKU');

// Ingredient Model
const Ingredient = require('../../models/Ingredient');

// Product Line Model
const ProductLine = require('../../models/ProductLine');
const Goal = require('../../models/Goal');

// @route GET api/skus
// @desc get all SKUs
// @access public
router.get('/', (req, res) => {
    SKU
        .find({})
        .populate('product_line')
        .populate('ingredients_list._id')
        .lean()
        .then(sku => res.json(sku))
});

// @route POST api/skus
// @desc create an sku
// @access public
router.post('/', (req, res) => {
    SKU.find().select("-_id number").sort({number: -1}).limit(1).then(max_number => {
        let numberResolved
        if(max_number.length === 0) 
            numberResolved = 1
        else 
            numberResolved = max_number[0].number+1
        try {
            Parser.skuFieldsCheck(req.body.name, numberResolved, req.body.case_number, req.body.unit_number, req.body.unit_size, req.body.count_per_case, req.body.product_line)
            if(req.body.ingredients_list && !Array.isArray(req.body.ingredients_list))
                throw new Error("Ingredients list must be an array.")
            if(req.body.ingredients_list)
                req.body.ingredients_list.forEach(tuple => {
                    if(!(tuple._id && tuple.quantity))
                        throw new Error("SKU ingredients list must contain id and quantity")
                    if(!Helper.isNumeric(tuple.quantity))
                        throw new Error("SKU ingredients list quantity must be a number.")
                })
        } catch(err) {
            console.log(err)
            res.status(404).json({success: false, message: err.message})
            return;
        }

        const newSKU = new SKU({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            number: numberResolved,
            case_number: req.body.case_number,
            unit_number: req.body.unit_number,
            unit_size: req.body.unit_size,
            product_line: mongoose.Types.ObjectId(req.body.product_line),
            count_per_case: req.body.count_per_case,
            ingredients_list: req.body.ingredients_list,
            comment: req.body.comment
        });

        SKU.find({
            $or: [
                {number: newSKU.number},
                {case_number: newSKU.case_number}
            ]}).then(results => {
                error_thrown = false
                results.forEach(result => {
                    if(result._id != newSKU._id) {
                        if (result.number === newSKU.number) {
                            res.status(404).json({success: false, message: "SKU number is not unique."})
                        }
                        else {
                            res.status(404).json({success: false, message: "SKU Case UPC# is not unique."})
                        }
                        error_thrown = true
                    }
                })
                if(!error_thrown)
                    newSKU.save().then(sku => res.json(sku))
                    .catch(err => res.status(404).json({success: false, message: err.message}));
            })
        })
});

// @route DELETE api/skus/:id
// @desc delete an sku
// @access public
router.delete('/:id', (req, res) => {
    Goal.find({"skus_list.sku" : req.params.id}).lean()
    .then(goal_matches => {
        Promise.all(goal_matches.map(function(goal) {
            return new Promise(function(accept, reject) {
                new_list = goal.skus_list.filter(function( obj ) {
                    return obj.sku.toString() !== req.params.id;
                });
                Goal.findByIdAndUpdate(goal._id, {skus_list: new_list}).then(accept).catch(reject)
            })
        })).then(results => {
            res.json({success: true})
            SKU.findById(req.params.id)
            .then(sku => sku.remove().then(
                () => res.json({success: true}))
            ).catch(err => res.status(404).json({success: false, message: err.message}))
        }).catch(err => res.status(404).json({success: false, message: err.message}))
    })
    
});

// @route POST api/skus/update/:id
// @desc updates an sku
// @access public
router.post('/update/:id', (req, res) => {
    SKU.findById(req.params.id).lean().then(sku => {
        old_pl = sku.product_line.toString()
        ing_list = req.body.ingredients_list.map(function(ing) {
            return {
                "_id": ing._id.toString(),
                "quantity": ing.quantity.toString()
            }
        })
        const updatedSku = {
            name: req.body.name !== null ? req.body.name : sku.name,
            number: req.body.number !== null ? req.body.number : sku.number,
            case_number: req.body.case_number !== null ? req.body.case_number : sku.case_number,
            unit_number: req.body.unit_number !== null ? req.body.unit_number : sku.unit_number,
            unit_size: req.body.unit_size !== null ? req.body.unit_size : sku.unit_size,
            product_line: req.body.product_line != null ? req.body.product_line : sku.product_line,
            count_per_case: req.body.count_per_case !== null ? req.body.count_per_case : sku.count_per_case,
            ingredients_list: req.body.ingredients_list != null ? req.body.ingredients_list : sku.ingredients_list,
            comment: req.body.comment !== null ? req.body.comment : sku.comment,
        };

        try {
            Parser.skuFieldsCheck(updatedSku.name, updatedSku.number.toString(), updatedSku.case_number.toString(), updatedSku.unit_number.toString(), updatedSku.unit_size, updatedSku.count_per_case, updatedSku.product_line)
            if(req.body.ingredients_list !== null && !Array.isArray(req.body.ingredients_list))
                throw new Error("Ingredients list must be an array.")
            if(req.body.ingredients_list)
                req.body.ingredients_list.forEach(tuple => {
                    if(!(tuple._id && tuple.quantity)) {
                        throw new Error("SKU ingredients list must contain id and quantity")
                    }
                    if(!Helper.isNumeric(tuple.quantity)) {
                        throw new Error("SKU ingredients list quantity must be a number.")
                    }
            })
        } catch(err) {
            res.status(404).json({success: false, message: err.message})
            return;
        }

        SKU.find({
            $or: [
                {number: updatedSku.number},
                {case_number: updatedSku.case_number}
            ]}).then(results => {
                error_thrown = false
                results.forEach(result => {
                    if(result._id.toString() != sku._id.toString()) {
                        if (result.number === updatedSku.number) {
                            res.status(404).json({success: false, message: "SKU number is not unique."})
                        }
                        else {
                            res.status(404).json({success: false, message: "SKU Case UPC# is not unique."})
                        }
                        error_thrown = true
                    }
                })

                if(!error_thrown)
                    SKU.findByIdAndUpdate(req.params.id, {$set:req.body})
                    .then(() => res.json({success: true}))
            })
        })})

// @route GET api/skus/search
// @desc searches keywords in database
// @access public
router.get('/search', (req, res) => {
    SKU.find({$text: {$search: req.body.keywords}},
        {score:{$meta: "textScore"}})
        .lean()
        .sort({score: {$meta: "textScore"}})
        .then(search_res => {
            res.json({success: true, results: search_res});
        })
        .catch(err => res.status(404).json({success: false, message: err.message}))});

// @route GET api/skus/sort/:field/:asc
// @desc gets a list of skus specified order for the field
// @access public
router.get('/sort/:field/:asc', (req, res) => {
    var sortOrder = req.params.asc === 'asc' ? 1 : -1;
    SKU
        .find()
        .lean()
        .sort({[req.params.field] : sortOrder})
        .then(sku => res.json(sku))
    });

// @route GET api/skus/byproductlines
// @desc gets skus for (a) product line(s)
// @access public
router.post('/byproductlines', (req, res) => {
    SKU
        .find({
            'product_line': {
                $in: req.body.product_lines
            }
        })
        .lean()
        .then(sku => res.json(sku))
    });

// @route GET api/skus/byingredients
// @desc gets skus for with the ingredients in the request
// @access public
router.get('/byingredients', (req, res) => {
    SKU
        .find({
            'ingredients_list.name': {
                $all: req.body.ingredients
            }
        })
        .lean()
        .then(sku => res.json(sku))
        .catch(err => res.status(404).json({success: false, message: err.message}))
});

// @route POST api/skus/filter/sort/:field/:asc/:pagenumber/:limit
// @desc gets skus with many filters
// request param fields:
// - pagenumber: current page number
// - limit: number of records / page. -1 if want all records.
// request body fields:
// - ingredients: Array of ingredients ids (String) to search SKUs for
// - product_lines: Array of product line ids (String) to find SKUs that are part of it
// - keywords: Array of words (String) to match entries on
// - group_pl: if "True" then will return result grouped by pl
// @access public
router.post('/filter/sort/:field/:asc/:pagenumber/:limit', (req, res) => {
    Helper.getSKUFilterResult(req, res, Helper.sortAndLimit)
});

module.exports = router;