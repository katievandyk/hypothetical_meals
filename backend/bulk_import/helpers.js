const mongoose = require('mongoose');
const IngredientDepReport = require('../reports/ingredient-dep')
const Papa = require('papaparse');

module.exports.isNumeric = function(n){
    return !isNaN(parseFloat(n)) && isFinite(n);
}

module.exports.isPositiveInteger = function(str) {
    let regex = /^[0-9]+$/;
    return regex.test(str) && Number(str) > 0;
}

module.exports.is_upca_standard = function(code_str) {
    if(code_str.length != 12) {
        return false;
    }
    let code = parseInt(code_str);
    var i;
    var sum = 0;
    var code_temp = code;
    code /= 10;
    for(i = 1; i < 12; i++) {
        var digit = Math.floor(code % 10);
        if (i == 11 && !(digit == 0 | digit == 1 | digit >= 6 && digit <= 9)) {
            return false;
        }
            
        code /= 10;
        sum += i%2 == 0 ? digit : digit*3;
    }

    var check_digit = (10-sum%10)%10;
    if(check_digit != code_temp % 10) {
        return false;
    }

    return true;
};

module.exports.checkFileHeaders = function(actual_header, expected_header) {
    var is_same = (actual_header.length == expected_header.length) && actual_header.every(function(element, index) {
        return element === expected_header[index]; 
    });
    if(!is_same) throw new Error(
        `File header doesn't match expected header. Actual: ${actual_header}; Expected: ${expected_header}`);
}

module.exports.getIngredientFilterResult = getIngredientFilterResult = function(req, res, callback) {
    var skus = req.body.skus == null ? [] : req.body.skus;
    SKU.aggregate(
        [{ $match: {'_id': {$in: skus.map(function(el) { return mongoose.Types.ObjectId(el) })} }},
        { $unwind: "$ingredients_list" },
        { $group: { _id: { ingredients: '$ingredients_list'} } },
        { $replaceRoot: { newRoot: "$_id" } },
        { $unwind: "$ingredients" },
        { $replaceRoot: { newRoot: "$ingredients" } }
        ]
    ).then(result => {
        var onlyIds = result.map(obj => obj._id);
        var ingredientFindPromise;
        var ingredientCountPromise;
        if (req.body.skus != null && req.body.keywords != null) {
            ingredientFindPromise = Ingredient.find({$text: {
                $search: req.body.keywords}},
                {score:{$meta: "textScore"}}, 
                ).where({_id: {$in: onlyIds}});
            ingredientCountPromise = Ingredient.find({$text: {
                $search: req.body.keywords}},
                {score:{$meta: "textScore"}}, 
                ).where({_id: {$in: onlyIds}});
        }
        else if (req.body.skus != null) {
            ingredientFindPromise = Ingredient.find().where({_id: {$in: onlyIds}});
            ingredientCountPromise = Ingredient.find().where({_id: {$in: onlyIds}});
        }
        else if (req.body.keywords != null) {
            ingredientFindPromise = Ingredient.find({$text: {
                $search: req.body.keywords}},
                {score:{$meta: "textScore"}});
            ingredientCountPromise = Ingredient.find({$text: {
                $search: req.body.keywords}},
                {score:{$meta: "textScore"}});
        }
        else {
            ingredientFindPromise = Ingredient.find();
            ingredientCountPromise = Ingredient.find();
        }
        callback(req, res, ingredientFindPromise, ingredientCountPromise)
    }).catch(err => res.status(404).json({success: false, message: err.message}));
}

module.exports.getFormulasFilterResult = getFormulasFilterResult = function(req, res, callback) {
    var formulasFindPromise = Formula.find();
    let formulasCountPromise = Formula.find();

    if (req.body.keywords != null) {
        formulasFindPromise = Formula.find(
            {$text: {$search: req.body.keywords}},
            {score:{$meta: "textScore"}});

        formulasCountPromise= Formula.find(
            {$text: {$search: req.body.keywords}},
            {score:{$meta: "textScore"}});
    }
    if (req.body.ingredients != null) {
        formulasFindPromise = formulasFindPromise.find(
            { 'ingredients_list._id': { $all: 
                req.body.ingredients}});
        formulasCountPromise = formulasCountPromise.find(
            { 'ingredients_list._id': { $all: 
                req.body.ingredients}});
    }

    formulasFindPromise = formulasFindPromise.populate('ingredients_list._id')

    callback(req, res, formulasFindPromise, formulasCountPromise)
}

module.exports.ingredientDependencyReport = ingredientDependencyReport = function(req, res, findPromise, ignorePromise) {
    findPromise.select("_id name").then(resultF => {
        IngredientDepReport.findSKUsForIngredients(resultF)
            .then(result => res.json(result))
    })
}

module.exports.ingredientDependencyReportCsv = ingredientDependencyReportCsv = function(req, res, findPromise, ignorePromise) {
    findPromise.select("_id name").then(resultF => {
        IngredientDepReport.findSKUsForIngredientsCsv(resultF)
            .then(result => {
                var merged = [].concat.apply([], result);
                let csv = Papa.unparse(merged);
                if (merged.length == 0) {
                    header = "Ingredient Name,SKU Name,SKU#,Case UPC,Unit UPC,Unit size,Count per case\r\n"
                    csv = header
                }
                res.setHeader('Content-Type', 'text/csv')
                res.status(200).send(csv)
            })
    })
}

module.exports.getSKUFilterResult = getSKUFilterResult = function(req, res, callback) {
    var skuFindPromise = SKU.find();
    let skuCountPromise = SKU.find();

    if (req.body.keywords != null) {
        skuFindPromise = SKU.find(
            {$text: {$search: req.body.keywords}},
            {score:{$meta: "textScore"}});

        skuCountPromise= SKU.find(
            {$text: {$search: req.body.keywords}},
            {score:{$meta: "textScore"}});
    }
    if (req.body.ingredients != null) {
        skuFindPromise = skuFindPromise.find(
            { 'ingredients_list._id': { $all: 
                req.body.ingredients}});
        skuCountPromise = skuCountPromise.find(
            { 'ingredients_list._id': { $all: 
                req.body.ingredients}});
    }
    if (req.body.product_lines != null) {
        skuFindPromise = skuFindPromise.find(
            { 'product_line': { $in: 
                req.body.product_lines.map(
                    function(el) { return mongoose.Types.ObjectId(el) }) }});
        skuCountPromise = skuCountPromise.find(
            { 'product_line': { $in: 
                req.body.product_lines.map(
                    function(el) { return mongoose.Types.ObjectId(el) }) }});
    }

    skuFindPromise = skuFindPromise.populate('product_line').populate('ingredients_list._id')

    callback(req, res, skuFindPromise, skuCountPromise)
}

module.exports.sortAndLimit = sortAndLimit = function(req, res, findPromise, countPromise) {
    // Paginate. If limit = -1, then gives all records
    var currentPage = parseInt(req.params.pagenumber);
    var limit = parseInt(req.params.limit);
    if (limit != -1) {
        findPromise = findPromise.skip((currentPage-1)*limit).limit(limit);
    }

    var sortOrder = req.params.asc === 'asc' ? 1 : -1;
    var sortPromise;
    if (req.params.field === 'score') {
        sortPromise = findPromise.lean().sort(
            {score: {$meta: "textScore"}});
    }
    else {
        sortPromise = findPromise.lean().sort(
            {[req.params.field] : sortOrder});
    }

    Promise.all([countPromise.count(), sortPromise])
        .then(results => {
            if (req.body.group_pl === "True") {
                results[1] = groupByProductLine(results[1]);
            }
                
            finalResult = {count: results[0], results: results[1]};
            res.json(finalResult)})
        .catch(err => {
            console.log(err)
            res.status(404).json({success: false, message: err.message})
        })
}

function groupByProductLine(results) {
    let i;
    let pl_to_skus = new Object();
    for(i = 0; i < results.length; i++) {
        pl_name = results[i].product_line.name
        pl_name in pl_to_skus ? 
            pl_to_skus[pl_name].push(results[i]) : pl_to_skus[pl_name] = [results[i]];
    }
    return pl_to_skus;
}

