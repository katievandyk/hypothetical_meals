const mongoose = require('mongoose');

const ing_fields = {number: 'Ingr#', name: 'Name', vendor: 'Vendor Info', size: 'Size', cost: 'Cost', comment: 'Comment'};
const pl_fields = {name: 'Name'};
const sku_fields = {number: 'SKU#', name: 'Name', case_upc: 'Case UPC', unit_upc: 'Unit UPC', unit_size: 'Unit size', count: 'Count per case', pl_name: 'Product Line Name', comment: 'Comment'};
const formula_fields = {sku_num: 'SKU#', ing_num: 'Ingr#', quantity:'Quantity'};

const ProductLine = require('../models/ProductLine');
const SKU = require('../models/SKU');
const Ingredient = require('../models/Ingredient');

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
        .findByIdAndUpdate(ing_data["ing_id"], updateObj, {new: true})
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
            comment: comment
        };
        SKU
        .findByIdAndUpdate(sku_entry["sku_id"], updateObj, {new: true})
        .then(sku => resolve(sku)).catch(error => reject(error));
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
            comment: comment
        }).save().then(sku => resolve(sku)).catch(error => reject(error));
    });
}

module.exports.uploadFormulas = uploadFormulas = function(formulas_data) {
    formulas = formulas_data.Overwrite
    return Promise.all(formulas.map(uploadOneSKUFormula));
}

function uploadOneSKUFormula(formula_entry) {
    sku_id = formula_entry.sku_id
    new_list = []
    
    formula_entry.result.forEach(tuple => new_list.push(
        {_id: mongoose.Types.ObjectId(tuple["ing_id"]), quantity: tuple[formula_fields.quantity]}))

    return new Promise(function(accept, reject) {
        SKU.findOneAndUpdate({"_id": sku_id}, 
            { $set: {ingredients_list: new_list}})
            .then(result => accept(result)).catch(error => reject(error));
    });
}