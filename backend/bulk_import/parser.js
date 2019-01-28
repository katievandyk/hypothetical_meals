const fs = require('fs');
const Papa = require('papaparse');
const assert = require('assert');
const mongoose = require('mongoose');

// Import Models
const ProductLine = require('../models/ProductLine');
const SKU = require('../models/SKU');
const Ingredient = require('../models/Ingredient');

var ingredients_header = [ 'Ingr#', 'Name', 'Vendor Info', 'Size', 'Cost', 'Comment' ];
var product_lines_header = [ 'Name' ];
var skus_header =  [ 'SKU#','Name','Case UPC','Unit UPC','Unit size','Count per case','Product Line Name','Comment' ];
var formulas_header = [ 'SKU#', 'Ingr#', 'Quantity' ];

function _isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function _isPositiveInteger(n) {
    return 0 === n % (!isNaN(parseFloat(n)) && 0 <= ~~n);
}

function _is_upca_standard(code) {
    var i;
    var sum = 0;
    var code_temp = code;
    code /= 10;
    for(i = 1; i < 12; i++) {
        var digit = Math.floor(code % 10);
        if (i == 11 && !(digit == 0 | digit == 1 | digit >= 6 && digit <= 9)) {
            console.log("not compilant: " + digit);
            return false;
        }
            
        code /= 10;
        sum += i%2 == 0 ? digit : digit*3;
    }

    var check_digit = (10-sum%10)%10;
    if(check_digit != code_temp % 10) {
        console.log("not compilant: " + check_digit + " " + code_temp % 10);
        return false;
    }

    return true;
};

module.exports.parsePLFile = parsePL = function() {
    var file = fs.readFileSync("/Users/kguo/Downloads/product_lines1.csv", 'utf8');
    return new Promise(function(resolve, reject) {
        return Papa.parse(file, {
            header: true,
            skipEmptyLines: true, 
            delimiter: ",",
            complete: resolve, 
            error: reject
        });
    }).then(function(data) {
        return uploadPL(data);
    })
}

function uploadPL(data) {
    if (data.errors.length != 0) throw data.errors;

    // Check if file header is proper
    var file_header = data.meta.fields;
    var is_same = (file_header.length == product_lines_header.length) && file_header.every(function(element, index) {
        return element.trim() === product_lines_header[index].trim(); 
    });
    if(!is_same) throw "File header doesn't match expected header: " + product_lines_header;

    pl_data = data.data;

    return Promise.all(pl_data.map(uploadOnePL));
}

function uploadOnePL(pl_entry) {
    var name;
    Object.keys(pl_entry).map(function (k) {
        switch(k.trim()) {
            case product_lines_header[0]: 
                name = pl_entry[k];
                break;
        }
    });

    const newProductLine = new ProductLine({
        _id: new mongoose.Types.ObjectId(),
        name: name
    });

    return new Promise(function(resolve, reject) {
        newProductLine.save().then(productLine => resolve(productLine));
    });
}

module.exports.parseIngredientFile = parseIng = function() {
    var file = fs.readFileSync("/Users/kguo/Downloads/ingredients1.csv", 'utf8');
    return new Promise(function(resolve, reject) {
        return Papa.parse(file, {
            header: true,
            skipEmptyLines: true, 
            delimiter: ",",
            complete: resolve, 
            error: reject
        });
    }).then(function(data) {
        return uploadIngredients(data);
    })
}

function uploadIngredients(data) {
    if (data.errors.length != 0) throw data.errors;

    // Check if file header is proper
    var file_header = data.meta.fields;
    var is_same = (file_header.length == ingredients_header.length) && file_header.every(function(element, index) {
        return element.trim() === ingredients_header[index].trim(); 
    });
    if (!is_same) throw "File header doesn't match expected header: " + ingredients_header;

    ing_data = data.data;
    

    return Promise.all(ing_data.map(checkOneIngredient));
}

function checkOneIngredient(ing_data)  {
    var number;
    var name;
    var vendor;
    var size;
    var cost;
    var comment;
    Object.keys(ing_data).map(function (k) {
        switch(k.trim()) {
            case ingredients_header[0]: 
                if(!_isPositiveInteger(ing_data[k])) throw "Ingredient number is not a valid number: " + ing_data[k];
                var val = parseInt(ing_data[k]);
                // assert(!nums.includes(val), "Ingredient number repeated: " + ing_data[k]);
                number = val;
                break;
            case ingredients_header[1]:
                var trimmed = ing_data[k].trim();
                // assert(!names.includes(trimmed), "Ingredient name repeated" + ing_data[k]);
                name = trimmed;
                break;
            case ingredients_header[2]:
                vendor = ing_data[k];
                break;
            case ingredients_header[3]:
                size = ing_data[k];
                break;
            case ingredients_header[4]:
                if(!_isNumeric(ing_data[k])) throw "Ingredient cost is not a number: " + ing_data[k];
                var val = parseFloat(ing_data[k]);
                if (val < 0) throw "Ingredient cost is not positive: " + ing_data[k];
                cost = val;
                break;
            case ingredients_header[5]:
                comments = ing_data[k];
                break;
            default:
                break;
        }
    });

    const newIngredient = new Ingredient({
        _id: new mongoose.Types.ObjectId(),
        name: name,
        number: number,
        vendor_info: vendor,
        package_size: size,
        cost_per_package: cost,
        comment: comment
    });

    return new Promise(function(resolve, reject) {
        newIngredient.save().then(ingredient => resolve(ingredient));
    });
}

module.exports.parseSkuFile = parseSku = function() {
    var file = fs.readFileSync("/Users/kguo/Downloads/skus1.csv", 'utf8');
    return new Promise(function(resolve, reject) {
        return Papa.parse(file, {
            header: true,
            skipEmptyLines: true, 
            delimiter: ",",
            complete: resolve, 
            error: reject
        });
    }).then(function(data) {
        return uploadSKUs(data);
    })
}

function uploadSKUs(data) {
    if (data.errors.length != 0) throw data.errors;

    // Check if file header is proper
    var file_header = data.meta.fields;
    var is_same = (file_header.length == skus_header.length) && file_header.every(function(element, index) {
        return element.trim() === skus_header[index].trim(); 
    });
    if (!is_same) throw "File header doesn't match expected header: " + skus_header;

    skus_data = data.data;
    
    return Promise.all(skus_data.map(checkOneSKU));
}

function checkOneSKU(sku_data) {
    var number;
    var name;
    var case_upc;
    var unit_upc;
    var unit_size;
    var count_per_case;
    var pl;
    var comment;
    Object.keys(sku_data).map(function (k) {
        switch(k.trim()) {
            case skus_header[0]: 
                if(!_isPositiveInteger(sku_data[k])) throw "SKU number is not a valid number: " + sku_data[k];
                var val = parseInt(sku_data[k]);
                // assert(!nums.includes(val), "SKU number repeated: " + sku_data[k]);
                number = val;
                break;
            case skus_header[1]:
                var trimmed = sku_data[k].trim();
                if(trimmed.length > 32) throw "SKU name more than 32 characters: " + trimmed;
                // assert(!names.includes(trimmed), "SKU name repeated: " + trimmed);
                name = trimmed;
                break;
            case skus_header[2]:
                if(!_isPositiveInteger(sku_data[k])) throw "SKU case# is not a valid number: " + sku_data[k];
                var parsed_num = sku_data[k];
                if(!_is_upca_standard(parseInt(parsed_num))) throw "SKU case# is not UPC-A compliant: " + sku_data[k];
                case_upc = sku_data[k];
                break;
            case skus_header[3]:
                if(!_isPositiveInteger(sku_data[k])) throw "SKU units# is not a valid number: " + sku_data[k];
                var parsed_num = sku_data[k];
                if(!_is_upca_standard(parseInt(parsed_num))) throw "SKU unit# is not UPC-A compliant: " + sku_data[k];
                unit_upc = sku_data[k];
                break;
            case skus_header[4]:
                assert(sku_data[k].length > 0, "SKU unit size required");
                unit_size = sku_data[k];
                break;
            case skus_header[5]:
                if(!_isPositiveInteger(sku_data[k])) throw "SKU counts per case is not a valid number: " + obj[k];
                count_per_case = parseInt(sku_data[k]);
                break;
            case skus_header[6]:
                pl = sku_data[k];
                break;
            case skus_header[7]:
                comment = sku_data[k];
                break;
            default:
                break;
        }
    });

    return new Promise(function(accept, reject) {
        ProductLine.findOne({'name': pl})
            .then(result => {
                if(!result) reject(new Error("Product line not found: " + pl));
                accept(result)
            });
    }).then(function(pl_obj) {
        const newSKU = new SKU({
            _id: new mongoose.Types.ObjectId(),
            name: name,
            number: number,
            case_number: case_upc,
            unit_number: unit_upc,
            unit_size: unit_size,
            count_per_case: count_per_case,
            product_line: mongoose.Types.ObjectId(pl_obj._id),
            comment: comment
        });
    
        return new Promise(function(resolve, reject) {
            newSKU.save().then(sku => resolve(sku));
        });
    })
}

module.exports.parseForumula = parseFormula = function() {
    var file = fs.readFileSync("/Users/kguo/Downloads/formula1.csv", 'utf8');
    return new Promise(function(resolve, reject) {
        return Papa.parse(file, {
            header: true,
            skipEmptyLines: true, 
            delimiter: ",",
            complete: resolve, 
            error: reject
        });
    }).then(function(data) {
        return uploadFormulas(data);
    })
}

function uploadFormulas(data) {
    if (data.errors.length != 0) throw data.errors;

    // Check if file header is proper
    var file_header = data.meta.fields;
    var is_same = (file_header.length == formulas_header.length) && file_header.every(function(element, index) {
        return element.trim() === formulas_header[index].trim(); 
    });
    if (!is_same) throw "File header doesn't match expected header: " + formulas_header;

    formula_data = data.data;
    
    return Promise.all(formula_data.map(checkOneForumla));
}

function checkOneForumla(formula_data) {
    var sku;
    var ing;
    var quantity;

    Object.keys(formula_data).map(function (k) {
        switch(k.trim()) {
            case formulas_header[0]: 
                if(!_isPositiveInteger(formula_data[k])) throw "SKU number is not a valid number: " + formula_data[k];
                sku = parseInt(formula_data[k]);
                break;
            case formulas_header[1]:
                if(!_isPositiveInteger(formula_data[k])) throw "SKU number is not a valid number: " + formula_data[k];
                ing = parseInt(formula_data[k]);
                break;
            case formulas_header[2]:
                if(!_isNumeric(formula_data[k])) throw "Ingredient quantity is not a number: " + formula_data[k];
                var val = parseFloat(formula_data[k]);
                if (val < 0) throw "Ingredient quantity is not a number: " + formula_data[k];
                quantity = val;
                break;
        }
    });

    var skuPromise = new Promise(function(accept, reject) {
        SKU.findOne({number: sku})
            .then(result => {
                if(!result) reject(new Error("SKU number not found: " + sku));
                else accept(result);
            });
    });

    var ingPromise = new Promise(function(accept, reject) {
        Ingredient.findOne({number: ing})
            .then(result => {
                if(!result) reject(new Error("Ingredient number not found: " + ing));
                else accept(result);
            });
    });

    return Promise.all([skuPromise, ingPromise]).then(result => {
        var skuDoc = result[0];
        var ingDoc = result[1];

        SKU.update(
            {_id: skuDoc._id}, 
            { $push: {ingredients_list: {
                _id: mongoose.Types.ObjectId(ingDoc._id), 
                quantity: quantity}}}).then(result => accept(result));
    });
}
