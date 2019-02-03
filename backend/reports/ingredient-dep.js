const ProductLine = require('../models/ProductLine');
const SKU = require('../models/SKU');
const Ingredient = require('../models/Ingredient');
const mongoose = require('mongoose');

module.exports.findSKUsForIngredients = findSKUsForIngredients = function(ingredients_list) {
    return Promise.all(ingredients_list.map(findSKUsForOneIngredient));
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