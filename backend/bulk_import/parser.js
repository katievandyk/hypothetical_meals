const fs = require('fs');
const Papa = require('papaparse');
const mongoose = require('mongoose');

// Import Models
const ProductLine = require('../models/ProductLine');
const SKU = require('../models/SKU');
const Ingredient = require('../models/Ingredient');

const ing_fields = {number: 'Ingr#', name: 'Name', vendor: 'Vendor Info', size: 'Size', cost: 'Cost', comment: 'Comment'};
const ingredients_header = [ ing_fields.number, ing_fields.name, ing_fields.vendor, ing_fields.size, ing_fields.cost, ing_fields.comment ];

const pl_fields = {name: 'Name'};
const product_lines_header = [ pl_fields.name ];

function _isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

// TODO: check test this function
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

function checkFileHeaders(actual_header, expected_header) {
    var is_same = (actual_header.length == expected_header.length) && actual_header.every(function(element, index) {
        return element === expected_header[index]; 
    });
    if(!is_same) throw new Error(
        `File header doesn't match expected header. Actual: ${actual_header}; Expected: ${expected_header}`);
}

module.exports.parsePLFile = parsePL = function() {
    var file = fs.readFileSync("/Users/kguo/Downloads/productlines2.csv", 'utf8');
    return new Promise(function(resolve, reject) {
        return Papa.parse(file, {
            header: true,
            skipEmptyLines: true, 
            delimiter: ",",
            complete: resolve, 
            error: reject
        });
    }).then(function(data) {
        return checkPLs(data);
    })
}

function checkPLs(data) {
    if (data.errors.length != 0) throw data.errors;
    checkFileHeaders(data.meta.fields, product_lines_header);

    let pl_data = data.data;
    checkPLFileDuplicates(pl_data);
    return Promise.all(pl_data.map(preprocessOnePL));
}

function checkPLFileDuplicates(pl_data) {
    let i;
    let names = [];
    for(i = 0; i < pl_data.length; i++) {
        if(names.includes(pl_data[i][pl_fields.name])) {
            throw new Error("Duplicate name in file: " + pl_data[i][pl_fields.name]);
        }
        names.push(pl_data[i][pl_fields.name]);
    }
}

function preprocessOnePL(pl_entry) {
    return new Promise(function(accept, reject) {
        ProductLine
            .findOne({name: pl_entry[pl_fields.name]})
            .then(result => {
                console.log(result);
                if(!result) {
                    pl_entry["status"] = "Store";
                    accept(pl_entry);
                }
                else {
                    pl_entry['status'] = "Ignore";
                     accept(pl_entry);
                }
            })
    });
}

module.exports.parseIngredientFile = parseIng = function() {
    var file = fs.readFileSync("/Users/kguo/Downloads/ingredients2.csv", 'utf8');
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

    checkFileHeaders(data.meta.fields, ingredients_header);

    ing_data = data.data;

    checkIngredientFileDuplicates(ing_data);
    return Promise.all(ing_data.map(preprocessOneIngredient));
}

function checkIngredientFileDuplicates(ing_data) {
    let i;
    let names = [];
    let numbers = [];
    for(i = 0; i < ing_data.length; i++) {
        if(numbers.includes(ing_data[i][ing_fields.number])) {
            throw new Error("Duplicate number in file: " + ing_data[i][ing_fields.number]);
        }
        if(names.includes(ing_data[i][ing_fields.name])) {
            throw new Error("Duplicate name in file: " + ing_data[i][ing_fields.name]);
        }
        names.push(ing_data[i][ing_fields.name]);
        numbers.push(ing_data[i][ing_fields.number]);
    }
}

function preprocessOneIngredient(ing_data) {
    if(!_isPositiveInteger(ing_data[ing_fields.number])) 
        throw new Error("Ingredient number is not a valid number: " + ing_data[ing_fields.number]);
    
    if(!_isNumeric(ing_data[ing_fields.cost])) 
        throw new Error("Ingredient cost is not a number: " + ing_data[ing_fields.cost]);
    if (parseFloat(ing_data[ing_fields.cost]) < 0) 
        throw new Error("Ingredient cost is not positive: " + ing_data[ing_fields.cost]);

    return new Promise(function(accept, reject) {
        Promise.all([
            Ingredient.findOne({name: ing_data[ing_fields.name]}), 
            Ingredient.findOne({number: ing_data[ing_fields.number]})])
            .then(result => {
                let status = "Store";
                console.log(result);
                let name_result = result[0];
                let number_result = result[1];
                if(name_result) {
                    if(name_result.number == ing_data[ing_fields.number] && 
                        (name_result.vendor_info == ing_data[ing_fields.vendor] || 
                        !name_result.vendor_info && ing_data[ing_fields.vendor].length == 0) &&
                        name_result.package_size == ing_data[ing_fields.size] &&
                        name_result.cost_per_package == ing_data[ing_fields.cost] &&
                        (name_result.comment == ing_data[ing_fields.comment] || 
                        !name_result.comment && ing_data[ing_fields.comment].length == 0))
                        status = "Ignore";
                     else {
                        status = "Overwrite";
                        ing_data["ing_id"] = name_result._id;
                     }
                }
                else if(number_result) {
                    status = "Overwrite";
                    ing_data["ing_id"] = number_result._id;
                }
                if(name_result && number_result && name_result.name != number_result.name) 
                    reject(new Error(`Record name: ${ing_data[ing_fields.name]} `+
                    `and number ${ing_data[ing_fields.number]} conflicts with existing records in db`))
                ing_data["status"] = status;
                accept(ing_data);
            })
    });
}

module.exports.parseSkuFile = parseSku = function() {
    var file = fs.readFileSync("/Users/kguo/Downloads/skus2.csv", 'utf8');
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
const sku_fields = {number: 'SKU#', name: 'Name', case_upc: 'Case UPC', unit_upc: 'Unit UPC', unit_size: 'Unit size', count: 'Count per case', pl_name: 'Product Line Name', comment: 'Comment'};
const skus_header =  [ sku_fields.number,sku_fields.name,sku_fields.case_upc,sku_fields.unit_upc,sku_fields.unit_size,sku_fields.count,sku_fields.pl_name,sku_fields.comment ];

function uploadSKUs(data) {
    if (data.errors.length != 0) throw data.errors;
    checkFileHeaders(data.meta.fields, skus_header);

    skus_data = data.data;
    checkSKUFileDuplicates(skus_data);
    return Promise.all(skus_data.map(checkOneSKU));
}

function checkSKUFileDuplicates(sku_data) {
    let i;
    let numbers = [];
    let case_numbers = [];
    for(i = 0; i < sku_data.length; i++) {
        if(numbers.includes(sku_data[i][sku_fields.number])) {
            throw new Error("Duplicate number in file: " + sku_data[i][sku_fields.number]);
        }
        if(case_numbers.includes(sku_data[i][sku_fields.case_upc])) {
            throw new Error("Duplicate case UPC# in file: " + sku_data[i][sku_fields.case_upc]);
        }
        numbers.push(sku_data[i][sku_fields.number]);
        case_numbers.push(sku_data[i][sku_fields.case_upc]);
    }
}

// TODO: handle required fields
function checkOneSKU(sku_data) {
    if(!_isPositiveInteger(sku_data[sku_fields.number])) 
        throw new Error("SKU number is not a valid number: " + sku_data[sku_fields.number]);
    
    if(sku_data[sku_fields.name].length > 32) 
        throw new Error("SKU name more than 32 characters: " + sku_data[sku_fields.name]);
    
    if(!_isPositiveInteger(sku_data[sku_fields.case_upc])) 
        throw new Error("SKU case# is not a valid number: " + sku_data[sku_fields.case_upc]);
    if(!_is_upca_standard(parseInt(sku_data[sku_fields.case_upc]))) 
        throw new Error("SKU case# is not UPC-A compliant: " + sku_data[sku_fields.case_upc]);

    if(!_isPositiveInteger(sku_data[sku_fields.unit_upc])) 
        throw new Error("SKU units# is not a valid number: " + sku_data[sku_fields.unit_upc]);
    if(!_is_upca_standard(parseInt(sku_data[sku_fields.unit_upc]))) 
        throw new Error("SKU unit# is not UPC-A compliant: " + sku_data[sku_fields.unit_upc]);

    if(sku_data[sku_fields.unit_size].length == 0)
        throw new Error("SKU unit size required.");

    if(!_isPositiveInteger(sku_data[sku_fields.count])) 
        throw new Error("SKU counts per case is not a valid number: " + obj[k]);

    let pl = sku_data[sku_fields.pl_name];

    return new Promise(function(accept, reject) {
        Promise.all([
            ProductLine.findOne({'name': pl}),
            SKU.findOne({'number': sku_data[sku_fields.number]}),
            SKU.findOne({'case_number': sku_data[sku_fields.case_upc]})
        ])
            .then(result => {
                pl_result = result[0];
                if(!pl_result) reject(new Error("Product line not found: " + pl));
                sku_data['pl_id'] = pl_result._id;

                number_result = result[1];
                case_number_result = result[2];
                let status = "Store";

                console.log(number_result);
                if(number_result) {
                    if(number_result.name == sku_data[sku_fields.name] &&
                        number_result.case_number == sku_data[sku_fields.case_upc] &&
                        number_result.unit_number == sku_data[sku_fields.unit_upc] &&
                        number_result.unit_size == sku_data[sku_fields.unit_size] &&
                        number_result.count_per_case == sku_data[sku_fields.count] &&
                        number_result.product_line._id.toString() == pl_result._id.toString() &&
                        (number_result.comment == sku_data[sku_fields.comment] ||
                        !number_result.comment && sku_data[sku_fields.comment].length == 0))
                        status = "Ignore";
                    else {
                        status = "Overwrite";
                        sku_data['sku_id'] = number_result._id;
                    }
                }
                else if(case_number_result) {
                    status = "Overwrite";
                    sku_data['sku_id'] = case_number_result._id;
                }

                if(number_result && case_number_result && number_result.case_number != case_number_result.case_number) 
                    reject(new Error(`Record number: ${sku_data[sku_fields.number]} `+
                    `and case_number: ${sku_data[sku_fields.case_upc]} conflicts with existing records in db`))
                sku_data["status"] = status;
                accept(sku_data)
            });
    });
}

module.exports.parseForumula = parseFormula = function() {
    var file = fs.readFileSync("/Users/kguo/Downloads/formulas2.csv", 'utf8');
    return new Promise(function(resolve, reject) {
        return Papa.parse(file, {
            header: true,
            skipEmptyLines: true, 
            delimiter: ",",
            complete: resolve, 
            error: reject
        });
    }).then(function(data) {
        return checkFormulas(data);
    })
}

const formula_fields = {sku_num: 'SKU#', ing_num: 'Ingr#', quantity:'Quantity'};
const formulas_header = [ formula_fields.sku_num, formula_fields.ing_num, formula_fields.quantity];

function checkFormulas(data) {
    if (data.errors.length != 0) throw data.errors;
    checkFileHeaders(data.meta.fields, formulas_header);

    formula_data = data.data;

    checkFormulaFileDuplicates(formula_data);
    return Promise.all(formula_data.map(checkOneForumla));
}

function checkFormulaFileDuplicates(formula_data) {
    let i;
    let sku_to_ings = {};
    for(i = 0; i < formula_data.length; i++) {
        if(sku_to_ings[formula_data[i][formula_fields.sku_num]] && 
            sku_to_ings[formula_data[i][formula_fields.sku_num]]
            .includes(formula_data[i][formula_fields.ing_num]))
            throw new Error(`Duplicate sku,ing entry in file: ` + 
            `${formula_data[i][formula_fields.sku_num]},${formula_data[i][formula_fields.ing_num]}`);
        if(sku_to_ings[formula_data[i][formula_fields.sku_num]]) {
            sku_to_ing[formula_data[i]][formula_fields.sku_num].push(formula_data[i][formula_fields.ing_num]);
        }
        else {
            sku_to_ings[formula_data[i][formula_fields.sku_num]] = [formula_data[i][formula_fields.ing_num]];
        }
    }
}

function checkOneForumla(formula_data) {
    if(!_isPositiveInteger(formula_data[formula_fields.sku_num])) 
        throw new Error(
            "SKU number is not a valid number: " + formula_data[formula_fields.sku_num]);
    let sku = parseInt(formula_data[formula_fields.sku_num]);

    if(!_isPositiveInteger(formula_data[formula_fields.ing_num])) 
        throw new Error(
            "Ingredient number is not a valid number: " + formula_data[formula_fields.ing_num]);
    let ing = parseInt(formula_data[formula_fields.ing_num]);

    if(!_isNumeric(formula_data[formula_fields.quantity])) 
        throw new Error(
            "Ingredient quantity is not a number: " + formula_data[formula_fields.quantity]);
    if (parseFloat(formula_data[formula_fields.quantity]) < 0) 
        throw new Error(
            "Ingredient quantity is not a positive number: " + formula_data[k]);

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

    return new Promise(function(accept, reject) {
        Promise.all([skuPromise, ingPromise]).then(result => {
            let skuDoc = result[0];
            let ingDoc = result[1];
    
            formula_data["ing_id"] = ingDoc._id;
            formula_data["sku_id"] = skuDoc._id;
            accept(formula_data);
        })
    });
}
