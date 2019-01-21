const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Product Line Model
const ProductLine = require('../../models/ProductLine');

// @route GET api/productlines
// @desc get all product lines
// @access public
router.get('/', (req, res) => {
    ProductLine
        .find()
        .lean()
        .then(productLine => res.json(productLine))
});

// @route POST api/productlines
// @desc create an product line
// @access public
router.post('/', (req, res) => {
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
    ProductLine.findById(req.params.id)
        .then(productLine => productLine.remove().then(
            () => res.json({success: true}))
        ).catch(err => res.status(404).json({success: false, message: err.message}))
});

// @route POST api/productlines/update/:id
// @desc updates a product line
// @access public
router.post('/update/:id', (req, res) => {
    ProductLine.findByIdAndUpdate(req.params.id, {$set:req.body})
        .then(() => res.json({success: true}))
        .catch(err => res.status(404).json({success: false, message: err.message}))});

module.exports = router;