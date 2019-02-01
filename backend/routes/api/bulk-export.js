const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Helper = require('../../bulk_import/helpers');
const Papa = require('papaparse');
const Parser = require('../../bulk_import/parser')
const ProductLine = require('../../models/ProductLine');

// @route POST api/bulk-export/ingredients
// @desc posts request for ingredients bulk export
// request body fields (all optional):
// - skus: Array of sku ids (String) to get ingredients for
// - keywords: Array of words (String) to match entries on
// @access public
router.post('/ingredients', (req, res) => {
    Helper.getIngredientFilterResult(req, res, exportIngResponse)
});

function exportIngResponse(req, res, ingredientFindPromise) {
    let field_order = ["number", "name", "vendor_info", "package_size", "cost_per_package", "comment"]
    let header = "Ingr#,Name,Vendor Info,Size,Cost,Comment\r\n"
    ingredientFindPromise
        .select("-_id number name vendor_info package_size cost_per_package comment")
        .lean()
        .then(resultF => {
            let csv = Papa.unparse({fields: field_order, data: resultF}, {header: false});
            let headerAppended = header + csv
            res.setHeader('Content-Type', 'text/csv')
            res.status(200).send(headerAppended)
        })
        .catch(err => res.status(404).json({success: false, message: err.message}));
}

// @route POST api/bulk-export/productlines
// @desc posts request for ingredients bulk export
// request body fields (all optional):
// - skus: Array of sku ids (String) to get ingredients for
// - keywords: Array of words (String) to match entries on
// @access public
router.post('/productlines', (req, res) => {
    let field_order = ["name"]
    let header = "Name\r\n"
    ProductLine.find().select("-_id name").lean().then(result => {
        let csv = Papa.unparse({fields: field_order, data: result}, {header: false});
        let headerAppended = header + csv
        res.setHeader('Content-Type', 'text/csv')
        res.status(200).send(headerAppended)
    })
});

// @route POST api/bulk-export/skus
// @desc posts request for skus bulk export
// request body fields (all optional):
// - skus: Array of sku ids (String) to get ingredients for
// - keywords: Array of words (String) to match entries on
// @access public
router.post('/skus', (req, res) => {
    Helper.getSKUFilterResult(req, res, exportSKUResponse)
});

function exportSKUResponse(req, res, skuFindPromise) {
    let field_order = ["number", "name", "case_number", "unit_number", "unit_size", "count_per_case", "product_line_name", "comment"]
    let header = "SKU#,Name,Case UPC,Unit UPC,Unit size,Count per case,Product Line Name,Comment\r\n"
    skuFindPromise.lean()
    .select('-_id name number case_number unit_number unit_size count_per_case comment')
    .then(resultF => {
        resultF = resultF.map(postProcessSkuResult)
        let csv = Papa.unparse({fields: field_order, data: resultF}, {header: false});
        let headerAppended = header + csv
        res.setHeader('Content-Type', 'text/csv')
        res.status(200).send(headerAppended)
    })
    .catch(err => res.status(404).json({success: false, message: err.message}));
}

function postProcessSkuResult(result) {
    result["product_line_name"] = result.product_line.name;
    return result
}

// @route POST api/bulk-export/formulas
// @desc posts request for skus bulk export
// request body fields (all optional):
// - skus: Array of sku ids (String) to get ingredients for
// - keywords: Array of words (String) to match entries on
// @access public
router.post('/formulas', (req, res) => {
    Helper.getSKUFilterResult(req, res, exportFormulaResponse)
});

function exportFormulaResponse(req, res, skuFindPromise) {
    skuFindPromise.then(result => {
        let nested_result = result.map(processSKUFormulaResult)
        let flattened = [].concat.apply([], nested_result);
        let csv = Papa.unparse(flattened);
        res.setHeader('Content-Type', 'text/csv')
        res.status(200).send(csv)
    })
}

function processSKUFormulaResult(sku_entry) {
    return sku_entry.ingredients_list.map(ing_entry => processForumaResult(sku_entry.number, ing_entry))
}

function processForumaResult(sku_num, ingredient) {
    return {"SKU#": sku_num, "Ingr#": ingredient._id.number, "Quantity": ingredient.quantity}
}


module.exports = router;
