const ProductLine = require('../models/ProductLine');
const SKU = require('../models/SKU');
const Ingredient = require('../models/Ingredient');
const mongoose = require('mongoose');

module.exports.findSKUsForIngredients = findSKUsForIngredients = function(ingredients_list) {
    return Promise.all(ingredients_list.map(findSKUsForOneIngredient));
}

module.exports.findSKUsForIngredientsCsv = findSKUsForIngredientsCsv = function(ingredients_list) {
    return Promise.all(ingredients_list.map(findSKUsForOneIngredientCsv));
}

// visible for testing
module.exports.findSKUsForOneIngredient = findSKUsForOneIngredient = function(ing) {
    return new Promise(function(accept, reject) {
        SKU.find({ 'ingredients_list._id': mongoose.Types.ObjectId(ing._id) })
            .then(res => {
                finalRes = {[ing.name]: res};
                accept(finalRes)
            })
            .catch(error=>reject(error))
    });
}

// visible for testing
module.exports.findSKUsForOneIngredientCsv = findSKUsForOneIngredientCsv = function(ing) {
    return new Promise(function(accept, reject) {
        SKU.find({ 'ingredients_list._id': mongoose.Types.ObjectId(ing._id) })
            .then(res => {
                let mapped = res.map(entry => {
                    let obj = {
                        "Ingredient Name" : ing.name,
                        "SKU Name": entry.name,
                        "SKU#": entry.number,
                        "Case UPC": entry.case_number,
                        "Unit UPC": entry.unit_number,
                        'Unit size': entry.unit_size,
                        'Count per case': entry.count_per_case
                    }
                    return obj})
                accept(mapped)
            })
            .catch(error=>reject(error))
    });
}