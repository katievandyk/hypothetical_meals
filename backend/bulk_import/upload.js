const mongoose = require('mongoose');

const ing_fields = {number: 'Ingr#', name: 'Name', vendor: 'Vendor Info', size: 'Size', cost: 'Cost', comment: 'Comment'};
const pl_fields = {name: 'Name'};
const sku_fields = {number: 'SKU#', name: 'Name', case_upc: 'Case UPC', unit_upc: 'Unit UPC', unit_size: 'Unit size', count: 'Count per case', pl_name: 'Product Line Name', comment: 'Comment'};
const formula_fields = {sku_num: 'SKU#', ing_num: 'Ingr#', quantity:'Quantity'};

const ProductLine = require('../models/ProductLine');
const SKU = require('../models/SKU');
const Ingredient = require('../models/Ingredient');

module.exports.uploadIngredients = uploadIngredients = function(ings_data) {
    return Promise.all(ings_data.map(uploadOneIngredient));
}

function uploadOneIngredient(ing_data) {
    let number = parseInt(ing_data[ing_fields.number]);
    let name = ing_data[ing_fields.name];
    let vendor = ing_data[ing_fields.vendor];
    let size = ing_data[ing_fields.size];    
    let cost = parseFloat(ing_data[ing_fields.cost]);
    var comment = ing_data[ing_fields.comment];

    let ingredientPromise;
    if(ing_data["status"] === "Overwrite") {
        let updateObj = {
            name: name,
            number: number,
            vendor_info: vendor,
            package_size: size,
            cost_per_package: cost,
            comment: comment
        };
        ingredientPromise = Ingredient.findByIdAndUpdate(ing_data["ing_id"], updateObj, {new: true});
    }
    else {
        ingredientPromise = new Ingredient({
            _id: new mongoose.Types.ObjectId(),
            name: name,
            number: number,
            vendor_info: vendor,
            package_size: size,
            cost_per_package: cost,
            comment: comment
        }).save();
    }

    return new Promise(function(resolve, reject) {
        ingredientPromise.then(ingredient => resolve(ingredient));
    });
}

module.exports.uploadPLs = uploadPLs = function(pls_data) {
    return Promise.all(pls_data.map(uploadOnePL));
}

function uploadOnePL(pl_entry) {
    const newProductLine = new ProductLine({
        _id: new mongoose.Types.ObjectId(),
        name: pl_entry[pl_fields.name]
    });

    return new Promise(function(resolve, reject) {
        newProductLine.save().then(productLine => resolve(productLine));
    });
}

module.exports.uploadSKUs = uploadSKUs = function(skus_data) {
    return Promise.all(skus_data.map(uploadOneSKU));
}

function uploadOneSKU(sku_entry) {
    let number = sku_entry[sku_fields.number];
    var name = sku_entry[sku_fields.name];
    var case_upc = sku_entry[sku_fields.case_upc];
    var unit_upc = sku_entry[sku_fields.unit_upc];
    var unit_size = sku_entry[sku_fields.unit_size];
    var count_per_case = sku_entry[sku_fields.count];
    var pl_id = sku_entry["pl_id"];
    var comment = sku_entry[sku_fields.comment];

    let skuPromise;
    if(sku_entry["status"] === "Overwrite") {
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
        skuPromise = SKU.findByIdAndUpdate(sku_entry["sku_id"], updateObj, {new: true});
    }
    else {
        skuPromise = new SKU({
            _id: new mongoose.Types.ObjectId(),
            name: name,
            number: number,
            case_number: case_upc,
            unit_number: unit_upc,
            unit_size: unit_size,
            count_per_case: count_per_case,
            product_line: mongoose.Types.ObjectId(pl_id),
            comment: comment
        }).save();
    }

    return new Promise(function(resolve, reject) {
        skuPromise.then(sku => resolve(sku));
    });
}

module.exports.uploadFormulas = uploadFormulas = function(formulas_data) {
    return Promise.all(formulas_data.map(uploadOneFormula));
}

function uploadOneFormula(formula_entry) {
    return new Promise(function(accept, reject) {
        SKU.findByIdAndUpdate(formula_entry["sku_id"], 
            { $push: {ingredients_list: {
                _id: formula_entry["ing_id"], 
                quantity: formula_entry[formula_fields.quantity]}}}, {new: true})
            .then(result => accept(result));
    });
}