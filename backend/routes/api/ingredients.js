const express = require('express');
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
// @access public
router.get('/byskus', (req, res) => {
    SKU.aggregate(
        [{ $match: {'name': {$in: req.body.skus} }},
        { $unwind: "$ingredients_list" },
        {
            $lookup: {
                from: 'ingredients',
                localField: 'ingredients_list.name',
                foreignField: 'name',
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

module.exports = router;
