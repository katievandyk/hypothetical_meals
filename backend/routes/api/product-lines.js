const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Product Line Model
const ProductLine = require('../../models/ProductLine');
const SKU = require('../../models/SKU');

// @route GET api/productlines
// @desc get all product lines
// @access public
router.get('/', (req, res) => {
    ProductLine
        .find()
        .lean()
        .then(productLine => res.json(productLine))
});

// @route GET api/productlines
// @desc get all product lines
// @access public
router.get('/:pagenumber/:limit', (req, res) => {
    PLFindPromise = ProductLine.find().lean();
    PLCountPromise = ProductLine.find().lean();

    var currentPage = parseInt(req.params.pagenumber);
    var limit = parseInt(req.params.limit);
    if (limit != -1) {
        PLFindPromise = PLFindPromise.skip((currentPage-1)*limit).limit(limit)
    }

    Promise.all([PLCountPromise.count(), PLFindPromise])
    .then(results => {
        finalResult = {count: results[0], results: results[1]};
        res.json(finalResult)})
});

// @route POST api/productlines
// @desc create an product line
// @access public
router.post('/', (req, res) => {
    if(! (req.body.name))
        res.status(404).json({success: false, message: "Product line name is required."})
    const newProductLine = new ProductLine({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name
    });

    newProductLine.save().then(productLine => res.json(productLine))
        .catch(err => res.status(404).json({success: false, message: err.message}));
});

// @route DELETE api/productlines/:id
// @desc delete an product line
// @access public
router.delete('/:id', (req, res) => {
    SKU.find({product_line: req.params.id}).then(result => {
        console.log(result)
        if(result === null || result.length !== 0) {
            res.status(404).json({success: false, message: "Product line cannot be deleted because one or more SKU(s) are associated with it."})
        }
        ProductLine.findById(req.params.id)
        .then(productLine => productLine.remove().then(
            () => res.json({success: true}))
        ).catch(err => res.status(404).json({success: false, message: err.message}))
    })
});

// @route POST api/productlines/update/:id
// @desc updates a product line
// @access public
router.post('/update/:id', (req, res) => {
    ProductLine.findByIdAndUpdate(req.params.id, {$set:req.body})
        .then(() => res.json({success: true}))
        .catch(err => res.status(404).json({success: false, message: err.message}))});

module.exports = router;