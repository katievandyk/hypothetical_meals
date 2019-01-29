const express = require('express');
const router = express.Router();

var Parser = require('../../bulk_import/parser');
var Uploader = require('../../bulk_import/upload');

// @route POST api/bulk-import/check/ingredients
// @desc check if ingredients can be imported
// @access public
router.post('/check/ingredients', (req, res) => {
    Parser.parseIngredientFile()
    .then(result => res.json(result))
    .catch(err => { 
        console.log(err);
        res.status(404).json({success: false, message: err.message})});
});

// @route POST api/bulk-import/update/ingredients
// @desc check if ingredients can be imported
// @access public
router.post('/update/ingredients', (req, res) => {
    Uploader.uploadIngredients(req.body.data)
    .then(result => res.json(result))
    .catch(err => { 
        console.log(err);
        res.status(404).json({success: false, message: err.message})});
});

// @route POST api/bulk-import/check/productlines
// @desc check if product lines can be imported
// @access public
router.post('/check/productlines', (req, res) => {
    Parser.parsePLFile()
    .then(result => res.json(result))
    .catch(err => { 
        console.log(err);
        res.status(404).json({success: false, message: err.message})});
});

// @route POST api/bulk-import/update/productlines
// @desc check if product lines can be imported
// @access public
router.post('/update/productlines', (req, res) => {
    Uploader.uploadPLs(req.body.data)
    .then(result => res.json(result))
    .catch(err => { 
        console.log(err);
        res.status(404).json({success: false, message: err.message})});
});

// @route POST api/bulk-import/check/skus
// @desc check if skus can be imported
// @access public
router.post('/check/skus', (req, res) => {
    Parser.parseSkuFile()
    .then(result => res.json(result))
    .catch(err => { 
        console.log(err);
        res.status(404).json({success: false, message: err.message})});
});

// @route POST api/bulk-import/update/skus
// @desc check if skus can be imported
// @access public
router.post('/update/skus', (req, res) => {
    Uploader.uploadSKUs(req.body.data)
    .then(result => res.json(result))
    .catch(err => { 
        console.log(err);
        res.status(404).json({success: false, message: err.message})});
});

// @route POST api/bulk-import/check/formulas
// @desc check if formulas can be imported
// @access public
router.post('/check/formulas', (req, res) => {
    Parser.parseForumula()
    .then(result => res.json(result))
    .catch(err => { 
        console.log(err);
        res.status(404).json({success: false, message: err.message})});
});

// @route POST api/bulk-import/update/formulas
// @desc update formulas
// @access public
router.post('/update/formulas', (req, res) => {
    Uploader.uploadFormulas(req.body.data)
    .then(result => res.json(result))
    .catch(err => { 
        console.log(err);
        res.status(404).json({success: false, message: err.message})});
});

module.exports = router;