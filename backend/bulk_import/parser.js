const fs = require('fs');
const Papa = require('papaparse');
const Helpers = require('./helpers');

// Import Models
const ProductLine = require('../models/ProductLine');
const SKU = require('../models/SKU');
const Ingredient = require('../models/Ingredient');

module.exports.ing_fields = ing_fields = {number: 'Ingr#', name: 'Name', vendor: 'Vendor Info', size: 'Size', cost: 'Cost', comment: 'Comment'};
module.exports.ing_fields = ingredients_header = [ ing_fields.number, ing_fields.name, ing_fields.vendor, ing_fields.size, ing_fields.cost, ing_fields.comment ];

const pl_fields = {name: 'Name'};
const product_lines_header = [ pl_fields.name ];


module.exports.parsePLFile = parsePL = function(file) {
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
    Helpers.checkFileHeaders(data.meta.fields, product_lines_header);

    let pl_data = data.data;
    checkPLFileDuplicates(pl_data);
    return Promise.all(pl_data.map(preprocessOnePL));
}

// visible for testing
module.exports.checkPLFileDuplicates = checkPLFileDuplicates = function(pl_data) {
    let i;
    let names = [];
    for(i = 0; i < pl_data.length; i++) {
        if(names.includes(pl_data[i][pl_fields.name])) {
            throw new Error("Duplicate name in file: " + pl_data[i][pl_fields.name]);
        }
        names.push(pl_data[i][pl_fields.name]);
    }
}

// visible for testing
module.exports.preprocessOnePL = preprocessOnePL = function(pl_entry) {
    return new Promise(function(accept, reject) {
        ProductLine
            .findOne({name: pl_entry[pl_fields.name]})
            .then(result => {
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

module.exports.parseIngredientFile = parseIng = function(file) {
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

    Helpers.checkFileHeaders(data.meta.fields, ingredients_header);

    ing_data = data.data;

    checkIngredientFileDuplicates(ing_data);
    return Promise.all(ing_data.map(preprocessOneIngredient));
}

// visible for testing
module.exports.checkIngredientFileDuplicates = checkIngredientFileDuplicates = function(ing_data) {
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

// visible for testing
module.exports.preprocessOneIngredient = preprocessOneIngredient = function(ing_data) {
    if(!Helpers.isPositiveInteger(ing_data[ing_fields.number])) 
        throw new Error("Ingredient number is not a valid number: " + ing_data[ing_fields.number]);
    
    if(!Helpers.isNumeric(ing_data[ing_fields.cost])) 
        throw new Error("Ingredient cost is not a number: " + ing_data[ing_fields.cost]);
    if (parseFloat(ing_data[ing_fields.cost]) < 0) 
        throw new Error("Ingredient cost is not positive: " + ing_data[ing_fields.cost]);

    return new Promise(function(accept, reject) {
        Promise.all([
            Ingredient.findOne({name: ing_data[ing_fields.name]}), 
            Ingredient.findOne({number: ing_data[ing_fields.number]})])
            .then(result => {
                let status = "Store";
                let name_result = result[0];
                let number_result = result[1];
                if(number_result) {
                    if(number_result.number == ing_data[ing_fields.number] && 
                        (number_result.vendor_info == ing_data[ing_fields.vendor] || 
                        !number_result.vendor_info && ing_data[ing_fields.vendor].length == 0) &&
                        number_result.package_size == ing_data[ing_fields.size] &&
                        number_result.cost_per_package == ing_data[ing_fields.cost] &&
                        (number_result.comment == ing_data[ing_fields.comment] || 
                        !number_result.comment && ing_data[ing_fields.comment].length == 0))
                        status = "Ignore";
                     else {
                        status = "Overwrite";
                        ing_data["to_overwrite"] = number_result;
                     }
                }
                else if(name_result) {
                    reject(new Error(`Ambiguous Record: Primary key for record with "Name"=${ing_data[ing_fields.name]} cannot be updated because "Name" is a unique key.`))
                }
                if(name_result && number_result && name_result.name != number_result.name) 
                    reject(new Error(`Ambiguous Record: Record name: ${ing_data[ing_fields.name]} `+
                    `and number ${ing_data[ing_fields.number]} conflicts with existing records in db.`))
                ing_data["status"] = status;
                accept(ing_data);
            })
    });
}

module.exports.parseSkuFile = parseSku = function(file) {
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
    Helpers.checkFileHeaders(data.meta.fields, skus_header);

    skus_data = data.data;
    checkSKUFileDuplicates(skus_data);
    return Promise.all(skus_data.map(checkOneSKU));
}

// visible for testing
module.exports.checkSKUFileDuplicates = checkSKUFileDuplicates = function(sku_data) {
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
module.exports.checkOneSKU = checkOneSKU = function(sku_data) {
    if(!Helpers.isPositiveInteger(sku_data[sku_fields.number])) 
        throw new Error("SKU number is not a valid number: " + sku_data[sku_fields.number]);
    
    if(sku_data[sku_fields.name].length > 32) 
        throw new Error("SKU name more than 32 characters: " + sku_data[sku_fields.name]);
    
    if(!Helpers.isPositiveInteger(sku_data[sku_fields.case_upc])) 
        throw new Error("SKU case# is not a valid number: " + sku_data[sku_fields.case_upc]);
    if(!Helpers.is_upca_standard(sku_data[sku_fields.case_upc])) 
        throw new Error("SKU case# is not UPC-A compliant: " + sku_data[sku_fields.case_upc]);

    if(!Helpers.isPositiveInteger(sku_data[sku_fields.unit_upc])) 
        throw new Error("SKU units# is not a valid number: " + sku_data[sku_fields.unit_upc]);
    if(!Helpers.is_upca_standard(sku_data[sku_fields.unit_upc])) 
        throw new Error("SKU unit# is not UPC-A compliant: " + sku_data[sku_fields.unit_upc]);

    if(sku_data[sku_fields.unit_size].length == 0)
        throw new Error("SKU unit size required.");

    if(!Helpers.isPositiveInteger(sku_data[sku_fields.count])) 
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
                        sku_data['to_overwrite'] = number_result;
                    }
                }
                else if(case_number_result) {
                    reject(new Error(`Ambiguous Record: Primary key for record with "Case UPC"=${sku_data[sku_fields.case_upc]} cannot be updated because "Case UPC" is a unique key.`))

                }

                if(number_result && case_number_result && number_result.case_number != case_number_result.case_number) 
                    reject(new Error(`Record number: ${sku_data[sku_fields.number]} `+
                    `and case_number: ${sku_data[sku_fields.case_upc]} conflicts with existing records in db`))
                sku_data["status"] = status;
                accept(sku_data)
            });
    });
}

module.exports.parseForumula = parseFormula = function(file) {
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
    Helpers.checkFileHeaders(data.meta.fields, formulas_header);

    formula_data = data.data;

    skus_map = checkFormulaFileDuplicates(formula_data);

    return Promise.all(
        Object.keys(skus_map).map(
            function(key) {
                return Promise.all(
                        skus_map[key].map(checkOneForumla)
                        ).then(result => {
                            return new Promise(function(accept, reject) {
                                final_res = {sku_id: result[0][0].sku_id, result: result, status: "Overwrite", to_overwrite: result[0][1]}
                                accept(final_res)
                            })
                        })
                    }))

}

// visible for testing
module.exports.checkFormulaFileDuplicates = checkFormulaFileDuplicates = function(formula_data) {
    let i;
    let sku_to_ings = {};
    let skus_map = {};
    for(i = 0; i < formula_data.length; i++) {
        if(sku_to_ings[formula_data[i][formula_fields.sku_num]] && 
            sku_to_ings[formula_data[i][formula_fields.sku_num]]
            .includes(formula_data[i][formula_fields.ing_num]))
            throw new Error(`Duplicate sku,ing entry in file: ` + 
            `${formula_data[i][formula_fields.sku_num]},${formula_data[i][formula_fields.ing_num]}`);
        if(sku_to_ings[formula_data[i][formula_fields.sku_num]]) {
            sku_to_ings[formula_data[i][formula_fields.sku_num]].push(formula_data[i][formula_fields.ing_num]);
            skus_map[formula_data[i][formula_fields.sku_num]].push(formula_data[i])
        }
        else {
            sku_to_ings[formula_data[i][formula_fields.sku_num]] = [formula_data[i][formula_fields.ing_num]];
            skus_map[formula_data[i][formula_fields.sku_num]] = [(formula_data[i])]
        }
    }
    return skus_map
}

module.exports.checkOneForumla = checkOneForumla = function(formula_data) {
    if(!Helpers.isPositiveInteger(formula_data[formula_fields.sku_num])) 
        throw new Error(
            "SKU number is not a valid number: " + formula_data[formula_fields.sku_num]);
    let sku = parseInt(formula_data[formula_fields.sku_num]);

    if(!Helpers.isPositiveInteger(formula_data[formula_fields.ing_num])) 
        throw new Error(
            "Ingredient number is not a valid number: " + formula_data[formula_fields.ing_num]);
    let ing = parseInt(formula_data[formula_fields.ing_num]);

    if(!Helpers.isNumeric(formula_data[formula_fields.quantity])) 
        throw new Error(
            "Ingredient quantity is not a number: " + formula_data[formula_fields.quantity]);
    if (parseFloat(formula_data[formula_fields.quantity]) < 0) 
        throw new Error(
            "Ingredient quantity is not a positive number: " + formula_data[k]);

    var skuPromise = new Promise(function(accept, reject) {
        SKU.findOne({number: sku}).populate("ingredients_list._id").lean()
            .then(result => {
                if(!result) reject(new Error("SKU number not found: " + sku));
                else accept(result);
            });
    });

    var ingPromise = new Promise(function(accept, reject) {
        Ingredient.findOne({number: ing}).lean()
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
            accept([formula_data, skuDoc.ingredients_list]);
        }).catch(error => reject(error));
    });
}
