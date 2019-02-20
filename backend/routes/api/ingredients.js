const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const IngredientHelper = require('../../bulk_import/helpers');
const Parser = require('../../bulk_import/parser')
const Constants = require('../../bulk_import/constants')

// Ingredient Model
const Ingredient = require('../../models/Ingredient');

// SKU Model
const SKU = require('../../models/SKU');

const IngredientDepReport = require('../../reports/ingredient-dep')

// @route GET api/ingredients
// @desc get all ingredients
// @access public
router.get('/', (req, res) => {
    Ingredient
        .find()
        .lean()
        .then(ingredient => res.json(ingredient))
});

// @route POST api/ingredients
// @desc create an ingredient
// @access public
router.post('/', (req, res) => {
    Ingredient.find().select("-_id number").sort({number: -1}).limit(1).then(max_number => {
        let numberResolved
        if(max_number.length === 0) 
            numberResolved = 1
        else 
            numberResolved = max_number[0].number+1

        numberResolved = req.body.number ? req.body.number : numberResolved

        try {
            Parser.ingredientFieldsCheck(req.body.name, numberResolved, req.body.package_size, req.body.cost_per_package)
        } catch(err) {
            res.status(404).json({success: false, message: err.message})
        }
        
        let package_size = IngredientHelper.extractUnits(req.body.package_size)[0] + " " + Constants.units_display[IngredientHelper.extractUnits(req.body.package_size)[1]]
        const newIngredient = new Ingredient({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            number: numberResolved,
            vendor_info: req.body.vendor_info,
            package_size: package_size,
            cost_per_package: req.body.cost_per_package,
            comment: req.body.comment
        });

        Ingredient.find({
            $or: [
                {name: newIngredient.name},
                {number: newIngredient.number},
            ]}).then(ings => {
                error_thrown = false
                ings.forEach(check_ing => {
                    if (check_ing._id.toString() !== newIngredient._id.toString()) {
                        if(check_ing.name === newIngredient.name) {
                            res.status(404).json({success: false, message: "Ingredient name is not unique: " + check_ing.name})
                        }
                        else {
                            res.status(404).json({success: false, message: "Ingredient number is not unique: " + check_ing.number})
                        }
                        error_thrown = true
                    }
                })
                if(!error_thrown)
                    newIngredient.save().then(ingredient => res.json(ingredient))
                    .catch(err => res.status(404).json({success: false, message: err.message}));
            })
        })
});

// @route DELETE api/ingredients/:id
// @desc delete an ingredient
// @access public
router.delete('/:id', (req, res) => {
    SKU.find({"ingredients_list._id": req.params.id}).lean().then(sku_matches => {
        Promise.all(sku_matches.map(function(sku) {
            return new Promise(function(accept, reject) {
                new_list = sku.ingredients_list.filter(function( obj ) {
                    return obj._id.toString() !== req.params.id;
                });
                SKU.findByIdAndUpdate(sku._id, {ingredients_list: new_list}).then(accept).catch(reject)
            })
        })).then(results => {
            Ingredient.findById(req.params.id)
                .then(ingredient => ingredient.remove().then(
                    () => res.json({success: true}))
                ).catch(err => res.status(404).json({success: false, message: err.message}))
        }).catch(err => res.status(404).json({success: false, message: err.message}))
    })
});

// @route POST api/ingredients/update/:id
// @desc updates an ingredient
// @access public
router.post('/update/:id', (req, res) => {
    Ingredient.findById(req.params.id).then(ing => {
        new_ing = {
            name: req.body.name != null ? req.body.name : ing.name,
            number: req.body.number != null ? req.body.number : ing.number,
            vendor_info: req.body.vendor_info != null ? req.body.vendor_info : ing.vendor_info,
            package_size: req.body.package_size != null ? req.body.package_size : ing.package_size,
            cost_per_package: req.body.cost_per_package != null ? req.body.cost_per_package : ing.cost_per_package,
            comment: req.body.comment != null ? req.body.comment : ing.comment
        }

        try {
            Parser.ingredientFieldsCheck(new_ing.name, new_ing.number, new_ing.package_size, new_ing.cost_per_package)
            
            let prev_unit = IngredientHelper.extractUnits(ing.package_size)[1]
            let new_ing_num = IngredientHelper.extractUnits(new_ing.package_size)[0]
            let new_unit = IngredientHelper.extractUnits(new_ing.package_size)[1]
            if(Constants.units[prev_unit] !== Constants.units[new_unit])
                throw new Error(`Package size can only be ${Constants.units[prev_unit]}-based. Found ${Constants.units[new_unit]}-based unit: ${new_unit}`)
            new_ing.package_size = new_ing_num + " " + Constants.units_display[new_unit]
        } catch(err) {
            res.status(404).json({success: false, message: err.message})
            return;
        }

        Ingredient.find({
            $or: [
                {name: new_ing.name},
                {number: new_ing.number},
            ]}).then(ings => {
                error_thrown = false
                ings.forEach(check_ing => {
                    if (check_ing._id.toString() !== ing._id.toString()) {
                        if(check_ing.name === new_ing.name) {
                            res.status(404).json({success: false, message: "Updated name is not unique: " + check_ing.name})
                        }
                        else {
                            res.status(404).json({success: false, message: "Updated number is not unique: " + check_ing.number})
                        }
                        error_thrown = true
                    }
                })
                if(!error_thrown)
                    Ingredient.findByIdAndUpdate(req.params.id, {$set:new_ing}, {new: true})
                    .then(() => res.json({success: true}))
                    .catch(err => res.status(404).json({success: false, message: err.message}))});
            })
    })
    

// @route GET api/ingredients/search
// @desc searches keywords in database
// @access public
router.get('/search', (req, res) => {
    Ingredient.find({$text: {$search: req.body.keywords}},
        {score:{$meta: "textScore"}})
        .lean()
        .sort({score: {$meta: "textScore"}})
        .then(search_res => {
            res.json({success: true, results: search_res});
        })
        .catch(err => res.status(404).json({success: false, message: err.message}))});

// @route POST api/ingredients/filter/sort/:field/:asc/:pagenumber/:limit
// @desc searches keywords in database
// request param fields:
// - pagenumber: current page number
// - limit: number of records / page. -1 if want all records.
// request body fields:
// - skus: Array of sku ids (String) to get ingredients for
// - keywords: Array of words (String) to match entries on
// note: sorting on keyword search result field=score. score sorting will only be descending.
// @access public
router.post('/filter/sort/:field/:asc/:pagenumber/:limit', (req, res) => {
    IngredientHelper.getIngredientFilterResult(req, res, IngredientHelper.sortAndLimit)
});

// @route POST api/ingredients/filter/
// @desc searches keywords in database
// request body fields:
// - skus: Array of sku ids (String) to get ingredients for
// - keywords: Array of words (String) to match entries on
// note: sorting on keyword search result field=score. score sorting will only be descending.
// @access public
router.post('/filter', (req, res) => {
    IngredientHelper.getIngredientFilterResult(req, res, IngredientHelper.ingredientDependencyReport)
});

// @route POST api/ingredients/filter/
// @desc searches keywords in database
// request body fields:
// - skus: Array of sku ids (String) to get ingredients for
// - keywords: Array of words (String) to match entries on
// note: sorting on keyword search result field=score. score sorting will only be descending.
// @access public
router.post('/filter/report', (req, res) => {
    IngredientHelper.getIngredientFilterResult(req, res, IngredientHelper.ingredientDependencyReportCsv)
});

// @route GET api/ingredients/sort/:field/:asc
// @desc gets a list of ingredients specified order for the field
// @access public
router.get('/sort/:field/:asc', (req, res) => {
    var sortOrder = req.params.asc === 'asc' ? 1 : -1;
    Ingredient
        .find()
        .lean()
        .sort({[req.params.field] : sortOrder})
        .then(ingredient => res.json(ingredient))
    });

// @route GET api/ingredients/byskus
// @desc gets a list of ingredients for the given sku(s)
// request body fields:
// - skus: Array of SKU ids (Strings) to get ingredients for
// @access public
router.post('/byskus', (req, res) => {
    SKU.aggregate(
        [{ $match: {'_id': {$in: req.body.skus.map(function(el) { return mongoose.Types.ObjectId(el) })} }},
        { $unwind: "$ingredients_list" },
        {
            $lookup: {
                from: 'ingredients',
                localField: 'ingredients_list._id',
                foreignField: '_id',
                as: 'ingredients_joined'
            }
        },
        { $group: { _id: { ingredients: '$ingredients_joined'} } },
        { $replaceRoot: { newRoot: "$_id" } },
        { $unwind: "$ingredients" },
        { $replaceRoot: { newRoot: "$ingredients" } }
        ]
    ).then(result => res.json(result))
    .catch(err => res.status(404).json({success: false, message: err.message}));
});

// @route GET api/ingredients/:id/skus
// @desc gets a list of skus for an ingredient
// @access public
router.get('/:id/skus', (req, res) => {
    Formula.find({ 'ingredients_list._id': mongoose.Types.ObjectId(req.params.id) })
        .select('_id')
        .lean()
        .then(formulas => {
            SKU.find({'formula': {
                $in: formulas
            }})
            .then(skus => res.json(skus))
            .catch(err => res.status(404).json({success: false, message: err.message}));
        })
        .catch(err => res.status(404).json({success: false, message: err.message}));
});

module.exports = router;
