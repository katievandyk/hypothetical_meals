const mongoose = require('mongoose');
const Constants = require('./constants')

const ing_fields = Constants.ing_fields
const pl_fields = Constants.pl_fields
const sku_fields = Constants.sku_fields
const formula_fields = Constants.formula_fields

const ProductLine = require('../models/ProductLine');
const SKU = require('../models/SKU');
const Ingredient = require('../models/Ingredient');
const Formula = require('../models/Formula')

module.exports.uploadIngredients = uploadIngredients = function(ings_data) {
    let overwrite = ings_data.Overwrite
    let store = ings_data.Store
    let overwritePromise = Promise.all(overwrite.map(updateOneIngredient))
    let storePromise = Promise.all(store.map(createOneIngredient))
    return Promise.all([overwritePromise, storePromise]);
}

function updateOneIngredient(ing_data) {
    let number = parseInt(ing_data[ing_fields.number]);
    let name = ing_data[ing_fields.name];
    let vendor = ing_data[ing_fields.vendor];
    let size = ing_data[ing_fields.size];    
    let cost = parseFloat(ing_data[ing_fields.cost]);
    var comment = ing_data[ing_fields.comment];

    return new Promise(function(resolve, reject) {
        let updateObj = {
            name: name,
            number: number,
            vendor_info: vendor,
            package_size: size,
            cost_per_package: cost,
            comment: comment
        };

        Ingredient
        .findByIdAndUpdate(ing_data.to_overwrite._id, updateObj, {new: true})
        .then(ingredient => resolve(ingredient))
        .catch(error => reject(error));
    });
}

function createOneIngredient(ing_data) {
    let number = parseInt(ing_data[ing_fields.number]);
    let name = ing_data[ing_fields.name];
    let vendor = ing_data[ing_fields.vendor];
    let size = ing_data[ing_fields.size];    
    let cost = parseFloat(ing_data[ing_fields.cost]);
    var comment = ing_data[ing_fields.comment];

    return new Promise(function(resolve, reject) {
         new Ingredient({
            _id: new mongoose.Types.ObjectId(),
            name: name,
            number: number,
            vendor_info: vendor,
            package_size: size,
            cost_per_package: cost,
            comment: comment
        }).save()
        .then(ingredient => resolve(ingredient))
        .catch(error => reject(error));
    });
}

module.exports.uploadPLs = uploadPLs = function(pls_data) {
    let overwrite = pls_data.Overwrite
    let store = pls_data.Store
    // overwrite should always be empty for pls
    let overwritePromise = Promise.all(overwrite.map(uploadOnePL))
    let storePromise = Promise.all(store.map(uploadOnePL))
    return Promise.all([overwritePromise, storePromise]);
}

function uploadOnePL(pl_entry) {
    const newProductLine = new ProductLine({
        _id: new mongoose.Types.ObjectId(),
        name: pl_entry[pl_fields.name]
    });

    return new Promise(function(resolve, reject) {
        newProductLine.save().then(productLine => resolve(productLine)).catch(error=> reject(error));
    });
}

module.exports.uploadSKUs = uploadSKUs = function(skus_data) {
    let overwrite = skus_data.Overwrite
    let store = skus_data.Store
    let overwritePromise = Promise.all(overwrite.map(updateOneSKU))
    let storePromise = Promise.all(store.map(createOneSKU))
    return Promise.all([overwritePromise, storePromise]);
}

function updateOneSKU(sku_entry) {
    let number = sku_entry[sku_fields.number];
    var name = sku_entry[sku_fields.name];
    var case_upc = sku_entry[sku_fields.case_upc];
    var unit_upc = sku_entry[sku_fields.unit_upc];
    var unit_size = sku_entry[sku_fields.unit_size];
    var count_per_case = sku_entry[sku_fields.count];
    var pl_id = sku_entry["pl_id"];
    var comment = sku_entry[sku_fields.comment];

    return new Promise(function(resolve, reject) {
        let updateObj = {
            name: name,
            number: number,
            case_number: case_upc,
            unit_number: unit_upc,
            unit_size: unit_size,
            count_per_case: count_per_case,
            product_line: mongoose.Types.ObjectId(pl_id),
            comment: comment,
            formula: sku_entry["formula_id"],
            formula_scale_factor: sku_entry[sku_fields.formula_factor],
            manufacturing_lines: sku_entry["ml_results"],
            manufacturing_rate: sku_entry[sku_fields.rate],
            setup_cost: sku_entry[sku_fields.setup_cost],
            run_cost: sku_entry[sku_fields.run_cost]
        };
        SKU
        .findByIdAndUpdate(sku_entry.to_overwrite._id, updateObj, {new: true})
        .then(sku => {
            resolve(sku_entry)
        }).catch(error => reject(error));
    });
}

function createOneSKU(sku_entry) {
    let number = sku_entry[sku_fields.number];
    var name = sku_entry[sku_fields.name];
    var case_upc = sku_entry[sku_fields.case_upc];
    var unit_upc = sku_entry[sku_fields.unit_upc];
    var unit_size = sku_entry[sku_fields.unit_size];
    var count_per_case = sku_entry[sku_fields.count];
    var pl_id = sku_entry["pl_id"];
    var comment = sku_entry[sku_fields.comment];

    return new Promise(function(resolve, reject) {
        new SKU({
            _id: new mongoose.Types.ObjectId(),
            name: name,
            number: number,
            case_number: case_upc,
            unit_number: unit_upc,
            unit_size: unit_size,
            count_per_case: count_per_case,
            product_line: mongoose.Types.ObjectId(pl_id),
            comment: comment,
            formula: sku_entry["formula_id"],
            formula_scale_factor: sku_entry[sku_fields.formula_factor],
            manufacturing_lines: sku_entry["ml_results"],
            manufacturing_rate: sku_entry[sku_fields.rate],
            setup_cost: sku_entry[sku_fields.setup_cost],
            run_cost: sku_entry[sku_fields.run_cost]
        }).save().then(sku => {
            sku_entry._id = sku._id
            resolve(sku_entry)
        }).catch(error => reject(error));
    });
}

module.exports.uploadFormulaIngs = uploadFormulaIngs = function(formulas_data) {
    formulas = formulas_data.Overwrite
    return Promise.all(formulas.map(uploadOneFormulaIngredient));
}

function uploadOneFormulaIngredient(formula_entry) {
    formula_id = formula_entry.formula_id
    new_list = []
    ing_list = []
    
    formula_entry.result.forEach(tuple => {
        ing_list.push(tuple[0])
        new_list.push(
        {_id: mongoose.Types.ObjectId(tuple[0]["ing_id"]), quantity: tuple[0].Quantity})})

    return new Promise(function(accept, reject) {
        Formula.findOneAndUpdate({"_id": formula_id}, 
            { $set: {ingredients_list: new_list}})
            .then(result => {
                new_res = {name: result.name, number: result.number, ing_list: ing_list}
                accept(new_res)
            }).catch(error => reject(error));
    });
}

module.exports.uploadFormulas = uploadFormulas = function(formulas_data) {
    let overwrite = formulas_data.Overwrite
    let store = formulas_data.Store
    let overwritePromise = Promise.all(overwrite.map(updateOneFormula))
    let storePromise = Promise.all(store.map(createOneFormula))
    return Promise.all([overwritePromise, storePromise]);
}

function updateOneFormula(formula_entry) {
    return new Promise(function(resolve, reject) {
        Formula
        .findByIdAndUpdate(formula_entry.to_overwrite._id, formula_entry, {new: true})
        .then(formula => resolve(formula_entry)).catch(error => reject(error));
    });
}

function createOneFormula(formula_entry) {
    return new Promise(function(resolve, reject) {
        formula_entry._id = new mongoose.Types.ObjectId()
        new Formula(formula_entry)
            .save().then(formula => resolve(formula_entry)).catch(error => reject(error));
    });
}