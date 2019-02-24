const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Helper = require('../../bulk_import/helpers');
const Papa = require('papaparse');
const Parser = require('../../bulk_import/parser')
const ProductLine = require('../../models/ProductLine');
const Constants = require('../../bulk_import/constants')

// @route POST api/bulk-export/ingredients
// @desc posts request for ingredients bulk export
// request body fields (all optional):
// - skus: Array of sku ids (String) to get ingredients for
// - keywords: Array of words (String) to match entries on
// @access public
router.post('/ingredients', (req, res) => {
    Helper.getIngredientFilterResult(req, res, exportIngResponse)
});

function exportIngResponse(req, res, ingredientFindPromise, ignorePromise) {
    let field_order = ["number", "name", "vendor_info", "package_size", "cost_per_package", "comment"]
    let header = Constants.ingredients_header.join(",") + "\r\n"
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
    let header = Constants.product_lines_header.join(",") + "\r\n"
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

function exportSKUResponse(req, res, skuFindPromise, ignorePromise) {
    let field_order = ["number", "name", "case_number", "unit_number", "unit_size", "count_per_case", "product_line_name", "formula_num", "formula_scale_factor", "ml_shortnames", "manufacturing_rate", "comment"]
    let header = Constants.skus_header.join(",") + "\r\n"
    skuFindPromise.lean()
    .select('-_id name number case_number unit_number unit_size count_per_case comment formula formula_scale_factor manufacturing_lines manufacturing_rate')
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
    result["formula_num"] = result.formula.number;
    result["ml_shortnames"] = result.manufacturing_lines.map(ml => ml._id.shortname).join(",")
    return result
}

// @route POST api/bulk-export/formulas
// @desc posts request for skus bulk export
// request body fields (all optional):
// - skus: Array of sku ids (String) to get ingredients for
// - keywords: Array of words (String) to match entries on
// @access public
router.post('/formulas', (req, res) => {
    Helper.getFormulasFilterResult(req, res, exportFormulaResponse)
});

function exportFormulaResponse(req, res, formulaFindPromise, ignorePromise) {
    let field_order = ["number", "name", "ing_number", "quantity", "comment"]
    let header = Constants.formula_header.join(",") + "\r\n"
    formulaFindPromise.lean()
    .select('-_id name number ingredients_list comment')
    .then(resultF => {
        resultF = postProcessFormulaResult(resultF)
        let csv = Papa.unparse({fields: field_order, data: resultF}, {header: false});
        let headerAppended = header + csv
        res.setHeader('Content-Type', 'text/csv')
        res.status(200).send(headerAppended)
    })
    .catch(err => res.status(404).json({success: false, message: err.message}));
}

function postProcessFormulaResult(result) {
    let new_result = []
    result.forEach(formula => {
        formula.ingredients_list.forEach(ing => {
            new_result.push({
                number: formula.number,
                name: formula.name,
                ing_number: ing._id.number,
                quantity: ing.quantity,
                comment: formula.comment
            })
        })
    })
    return new_result
}

module.exports = router;
