const express = require('express');
const router = express.Router();
const fs = require('fs')

var Parser = require('../../bulk_import/parser');
var Uploader = require('../../bulk_import/upload');

function groupByStatus(res) {
    return res.reduce(function(r,a) {
        r[a.status] = r[a.status] || [];
        r[a.status].push(a);
        return r;
    }, Object.create(null))
}

// @route POST api/bulk-import/upload-check
// @desc check if the file can be uploaded
// current files allowed: skus, ingredients, product lines, and formulas
// @access public
router.post('/upload-check', (req, res) => {
    let full_file_name = req.body.file_name
    let file_name = full_file_name.substring(full_file_name.lastIndexOf("/") + 1);
    
    bulkImport(file_name, req.body.file, res)

})

// @route POST api/bulk-import/upload-check
// @desc check if the file can be uploaded
// current files allowed: skus, ingredients, product lines, and formulas
// @access public
router.post('/upload-check/dev', (req, res) => {
    let full_file_name = req.body.file_name
    let file_name = full_file_name.substring(full_file_name.lastIndexOf("/") + 1);
    let file = fs.readFileSync(full_file_name, 'utf8').replace(/^\ufeff/, "");
    
    bulkImport(file_name, file, res)

})

function bulkImport(file_name, file_body, res) {
    let file_type;

    ing_file_regex = /^ingredients(\S)*\.csv$/;
    sku_file_regex = /^skus(\S)*\.csv$/;
    pl_file_regex = /^product_lines(\S)*\.csv$/;
    formulas_file_regex = /^formulas(\S)*\.csv$/;
    let parsePromise;
    if(ing_file_regex.test(file_name)) {
        parsePromise = Parser.parseIngredientFile(file_body)
        file_type = "ingredients"
    }
    else if(sku_file_regex.test(file_name)) {
        parsePromise = Parser.parseSkuFile(file_body)
        file_type = "skus"
    }
    else if(pl_file_regex.test(file_name)) {
        parsePromise = Parser.parsePLFile(file_body)
        file_type = "product_lines"
    }
    else if(formulas_file_regex.test(file_name)) {
        parsePromise = Parser.parseForumula(file_body)
        file_type = "formulas"
    }
    else {
        res.status(404).json({
            success: false, 
            message: `${file_name} does not match any of the allowed file names.`})
        return
    }
        
    parsePromise
    .then(result => {
        let keys = ["Ignore", "Overwrite", "Store", "NoOverwrite"]
        let grouped = groupByStatus(result)
        keys.forEach(key => {
            if (!(key in grouped))
                grouped[key] = []
        })
        console.log(grouped)
        grouped["file_type"] = file_type
        res.json(grouped)})
    .catch(err => { 
        console.log(err);
        res.status(404).json({success: false, message: err.message})});
}

// @route POST api/bulk-import/update/ingredients
// @desc check if ingredients can be imported
// @access public
router.post('/upload/ingredients', (req, res) => {
    Uploader.uploadIngredients(req.body.data)
    .then(result => {
        res.json(generateResultsSummary(req, result))
    })
    .catch(err => { 
        console.log(err);
        res.status(404).json({success: false, message: err.message})});
});

function generateResultsSummary(req, result) {
    let summary = {
        "Ignore" : {
            "count": req.body.data.Ignore.length,
            "records": req.body.data.Ignore
        },
        "Store": {
            "count": result[1].length,
            "records": result[1]
        },
        "Overwrite": {
            "count": result[0].length,
            "records": result[0]
        },
        "NoOverwrite": {
            "count": req.body.data.NoOverwrite.length,
            "records": req.body.data.NoOverwrite
        }
    }
    return summary
}

// @route POST api/bulk-import/update/productlines
// @desc check if product lines can be imported
// @access public
router.post('/upload/productlines', (req, res) => {
    Uploader.uploadPLs(req.body.data)
    .then(result => res.json(generateResultsSummary(req,result)))
    .catch(err => { 
        console.log(err);
        res.status(404).json({success: false, message: err.message})});
});

// @route POST api/bulk-import/update/skus
// @desc check if skus can be imported
// @access public
router.post('/upload/skus', (req, res) => {
    Uploader.uploadSKUs(req.body.data)
    .then(result => res.json(generateResultsSummary(req,result)))
    .catch(err => { 
        console.log(err);
        res.status(404).json({success: false, message: err.message})});
});

// @route POST api/bulk-import/update/formulas
// @desc update formulas
// @access public
router.post('/upload/formulas', (req, res) => {
    Uploader.uploadFormulas(req.body.data)
    .then(result => {
        res.json(generateResultsSummary(req, [result, []]))})
    .catch(err => { 
        console.log(err);
        res.status(404).json({success: false, message: err.message})});
});

module.exports = router;