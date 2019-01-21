const express = require('express');
const router = express.Router();

// SKU Model
const SKU = require('../../models/SKU');

// @route GET api/skus
// @desc get all SKUs
// @access public
router.get('/', (req, res) => {
    SKU
        .find()
        .lean()
        .then(sku => res.json(sku))
});

// @route POST api/skus
// @desc create an sku
// @access public
router.post('/', (req, res) => {
    var numberResolved = req.body.number ? req.body.number : new Date().valueOf();
    const newSKU = new SKU({
        name: req.body.name,
        number: numberResolved,
        case_number: req.body.case_number,
        unit_number: req.body.unit_number,
        unit_size: req.body.unit_size,
        count_per_case: req.body.count_per_case,
        product_line: req.body.product_line,
        ingredients_list: req.body.ingredients_list,
        comment: req.body.comment
    });

    newSKU.save().then(sku => res.json(sku))
        .catch(err => res.status(404).json({success: false, message: err.message}));
});

// @route DELETE api/skus/:id
// @desc delete an sku
// @access public
router.delete('/:id', (req, res) => {
    SKU.findById(req.params.id)
        .then(sku => sku.remove().then(
            () => res.json({success: true}))
        ).catch(err => res.status(404).json({success: false, message: err.message}))
});

// @route POST api/skus/update/:id
// @desc updates an sku
// @access public
router.post('/update/:id', (req, res) => {
    SKU.findByIdAndUpdate(req.params.id, {$set:req.body})
        .then(() => res.json({success: true}))
        .catch(err => res.status(404).json({success: false, message: err.message}))});

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
router.get('/byproductlines', (req, res) => {
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

module.exports = router;