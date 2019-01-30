const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Ingredient Model
const Ingredient = require('../../models/Ingredient');

// SKU Model
const SKU = require('../../models/SKU');

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
    var numberResolved = req.body.number ? req.body.number : new Date().valueOf();
    const newIngredient = new Ingredient({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        number: numberResolved,
        vendor_info: req.body.vendor_info,
        package_size: req.body.package_size,
        cost_per_package: req.body.cost_per_package,
        comment: req.body.comment
    });

    newIngredient.save().then(ingredient => res.json(ingredient))
        .catch(err => res.status(404).json({success: false, message: err.message}));
});

// @route DELETE api/ingredients/:id
// @desc delete an ingredient
// @access public
router.delete('/:id', (req, res) => {
    Ingredient.findById(req.params.id)
        .then(ingredient => ingredient.remove().then(
            () => res.json({success: true}))
        ).catch(err => res.status(404).json({success: false, message: err.message}))
});

// @route POST api/ingredients/update/:id
// @desc updates an ingredient
// @access public
router.post('/update/:id', (req, res) => {
    Ingredient.findByIdAndUpdate(req.params.id, {$set:req.body})
        .then(() => res.json({success: true}))
        .catch(err => res.status(404).json({success: false, message: err.message}))});

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
    var skus = req.body.skus == null ? [] : req.body.skus;
    SKU.aggregate(
        [{ $match: {'_id': {$in: skus.map(function(el) { return mongoose.Types.ObjectId(el) })} }},
        { $unwind: "$ingredients_list" },
        { $group: { _id: { ingredients: '$ingredients_list'} } },
        { $replaceRoot: { newRoot: "$_id" } },
        { $unwind: "$ingredients" },
        { $replaceRoot: { newRoot: "$ingredients" } }
        ]
    ).then(result => {
        var onlyIds = result.map(obj => obj._id);
        var ingredientFindPromise;
        if (req.body.skus != null && req.body.keywords != null) {
            ingredientFindPromise = Ingredient.find({$text: {
                $search: req.body.keywords}},
                {score:{$meta: "textScore"}}, 
                ).where({_id: {$in: onlyIds}});
        }
        else if (req.body.skus != null) {
            ingredientFindPromise = Ingredient.find().where({_id: {$in: onlyIds}});
        }
        else if (req.body.keywords != null) {
            ingredientFindPromise = Ingredient.find({$text: {
                $search: req.body.keywords}},
                {score:{$meta: "textScore"}});
        }
        else {
            ingredientFindPromise = Ingredient.find();
        }

        // Paginate. If limit = -1, then gives all records
        var currentPage = parseInt(req.params.pagenumber);
        var limit = parseInt(req.params.limit);
        if (limit != -1) {
            ingredientFindPromise = ingredientFindPromise.skip((currentPage-1)*limit).limit(limit);
        }

        var sortOrder = req.params.asc === 'asc' ? 1 : -1;
        var sortPromise;
        if (req.params.field === 'score') {
            sortPromise = ingredientFindPromise.lean().sort(
                {score: {$meta: "textScore"}});
        }
        else {
            sortPromise = ingredientFindPromise.lean().sort(
                {[req.params.field] : sortOrder}).then(resultF => {res.json(resultF)});
        }

        
        sortPromise.then(resultF => {res.json(resultF)});
    }).catch(err => res.status(404).json({success: false, message: err.message}));
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
    SKU
        .find({ 'ingredients_list._id': mongoose.Types.ObjectId(req.params.id) })
        .lean()
        .then(skus => res.json(skus))
        .catch(err => res.status(404).json({success: false, message: err.message}));
});


module.exports = router;
