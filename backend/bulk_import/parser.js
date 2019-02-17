const Papa = require('papaparse');
const Helpers = require('./helpers');
const Constants = require('./constants')

// Import Models
const ProductLine = require('../models/ProductLine');
const SKU = require('../models/SKU');
const Ingredient = require('../models/Ingredient');
const ManufacturingLine = require('../models/ManufacturingLine');
const Formula = require('../models/Formula')

const ing_fields = Constants.ing_fields
const ingredients_header = Constants.ingredients_header

const pl_fields = Constants.pl_fields
const product_lines_header = Constants.product_lines_header

const sku_fields = Constants.sku_fields
const skus_header =  Constants.skus_header

const formula_fields = Constants.formula_fields
const formula_header = Constants.formula_header

function parseFile(file, resolve, reject) {
    return Papa.parse(file, {
        header: true,
        skipEmptyLines: true, 
        beforeFirstChunk: function(chunk) {
            var rows = chunk.split( /\r\n|\r|\n/ );
            var headings = rows[0].toLowerCase();
            rows[0] = headings;
            return rows.join("\r\n");
        },
        delimiter: ",",
        complete: resolve, 
        error: reject
    });
}

module.exports.parsePLFile = parsePL = function(file) {
    return new Promise(function(resolve, reject) {
        return parseFile(file, resolve, reject) 
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
    if(pl_entry[pl_fields.name].length === 0)
        throw new Error("Product line name is required.")
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
        return parseFile(file, resolve, reject) 
    }).then(function(data) {
        return uploadIngredients(data);
    })
}

function uploadIngredients(data) {
    if (data.errors.length != 0) throw data.errors;

    Helpers.checkFileHeaders(data.meta.fields, ingredients_header);

    ing_data = data.data;

    return new Promise(function(accept, reject) {
        Ingredient.find().select("-_id number").sort({number: -1}).limit(1).then(accept).catch(reject)
    }).then(max_number => {
        let start_num
        if(max_number.length === 0) 
            start_num = 1
        else 
            start_num = max_number[0].number+1
        checkIngredientFileDuplicates(start_num, ing_data);
        return Promise.all(ing_data.map(preprocessOneIngredient));
    })
}

// visible for testing
module.exports.checkIngredientFileDuplicates = checkIngredientFileDuplicates = function(max_number, ing_data) {
    let i;
    let names = [];
    let numbers = [];
    for(i = 0; i < ing_data.length; i++) {
        if(ing_data[i][ing_fields.number]==="") {
            ing_data[i][ing_fields.number] = max_number
            max_number = max_number+1
        }
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

module.exports.ingredientFieldsCheck = ingredientFieldsCheck = function(name, number, size, cost) {
    if(! (name && number && size && cost))
        throw new Error(`Ingredient name, number, package size, and cost are required. Got: ${name},${number},${size},${cost}`);
    
    if(!Helpers.isPositiveInteger(number)) 
        throw new Error("Ingredient number is not a valid number: " + number);

    if(!Helpers.isNumeric(cost)) 
        throw new Error("Ingredient cost is not a number: " + cost);
    if (parseFloat(cost) < 0) 
        throw new Error("Ingredient cost is not positive: " + cost);

    if(!Helpers.unitChecker(size))
        throw new Error("Ingredient package size is not formatted correctly: " + size)
}

// visible for testing
module.exports.preprocessOneIngredient = preprocessOneIngredient = function(ing_data) {
    ingredientFieldsCheck(ing_data[ing_fields.name], ing_data[ing_fields.number], ing_data[ing_fields.size], ing_data[ing_fields.cost])

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
        return parseFile(file, resolve, reject) 
    }).then(function(data) {
        return uploadSKUs(data);
    })
}

function uploadSKUs(data) {
    if (data.errors.length != 0) throw data.errors;
    Helpers.checkFileHeaders(data.meta.fields, skus_header);

    skus_data = data.data;

    return new Promise(function(accept, reject) {
        SKU.find().select("-_id number").sort({number: -1}).limit(1).then(accept).catch(reject)
    }).then(max_number => {
        let start_num
        if(max_number.length === 0) 
            start_num = 1
        else 
            start_num = max_number[0].number+1
        checkSKUFileDuplicates(start_num, skus_data);
        return Promise.all(skus_data.map(checkOneSKU));
    })
}

// visible for testing
module.exports.checkSKUFileDuplicates = checkSKUFileDuplicates = function(max_number, sku_data) {
    let i;
    let numbers = [];
    let case_numbers = [];
    for(i = 0; i < sku_data.length; i++) {
        if(sku_data[i][sku_fields.number]==="") {
            sku_data[i][sku_fields.number] = max_number
            max_number = max_number+1
        }

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

module.exports.skuFieldsCheck = skuFieldsCheck = function(name, number, case_upc, unit_upc, unit_size, count, pl_name, formula, formula_sf, manufacturing_rate) {
    if(! (name && case_upc && unit_upc && unit_size && count &&  pl_name && formula && manufacturing_rate))
        throw new Error(`SKU name, Case UPC#, Unit UPC#, Unit Size, Count per case, Product Line, Formula, and Manufacturing Rate fields are required. 
        Got: ${name},${case_upc},${unit_upc},${unit_size},${count},${pl_name},${formula},${manufacturing_rate}`)
    if(!Helpers.isPositiveInteger(number)) 
        throw new Error("SKU number is not a valid number: " + number);

    if(name.length > 32) 
        throw new Error("SKU name more than 32 characters: " + name);

    if(!Helpers.isPositiveInteger(case_upc)) 
        throw new Error("SKU case# is not a valid number: " + case_upc);
    if(!Helpers.is_upca_standard(case_upc)) 
        throw new Error("SKU case# is not UPC-A compliant: " + case_upc);

    if(!Helpers.isPositiveInteger(unit_upc)) 
        throw new Error("SKU units# is not a valid number: " + unit_upc);
    if(!Helpers.is_upca_standard(unit_upc)) 
        throw new Error("SKU unit# is not UPC-A compliant: " + unit_upc);

    if(!Helpers.isPositiveInteger(count)) 
        throw new Error("SKU counts per case is not a valid number: " + count);

    if(!Helpers.isNumeric(formula_sf)) 
        throw new Error(
            "Formula scale factor is not a number: " + formula_sf);
    if (parseFloat(formula_sf) < 0) 
        throw new Error(
            "Formula scale factor is not a positive number: " + formula_sf);

    if(!Helpers.isNumeric(manufacturing_rate)) 
        throw new Error(
            "Manufacturing rate is not a number: " + manufacturing_rate);
    if (parseFloat(manufacturing_rate) < 0) 
        throw new Error(
                "Manufacturing rate is not a positive number: " + manufacturing_rate);
}

module.exports.checkOneSKU = checkOneSKU = function(sku_data) {
    skuFieldsCheck(sku_data[sku_fields.name], sku_data[sku_fields.number], sku_data[sku_fields.case_upc], sku_data[sku_fields.unit_upc], sku_data[sku_fields.unit_size], sku_data[sku_fields.count], sku_data[sku_fields.formula_num], sku_data[sku_fields.pl_name],sku_data[sku_fields.formula_factor],sku_data[sku_fields.rate])

    let pl = sku_data[sku_fields.pl_name];

    return new Promise(function(accept, reject) {
        Promise.all([
            ProductLine.findOne({'name': pl}),
            SKU.findOne({'number': sku_data[sku_fields.number]}).populate("product_line").populate("manufacturing_lines._id").populate("formula"),
            SKU.findOne({'case_number': sku_data[sku_fields.case_upc]}),
            Formula.findOne({'number': sku_data[sku_fields.formula_num]}),
            ManufacturingLine.find({shortname: { $in: sku_data[sku_fields.mls].split(',') }})
        ])
            .then(result => {
                pl_result = result[0];
                if(!pl_result) reject(new Error("Product line not found: " + pl));
                sku_data['pl_id'] = pl_result._id;
                sku_data['pl_name'] = pl_result.name

                number_result = result[1];
                case_number_result = result[2];
                let status = "Store";

                formula_result = result[3]
                if(!formula_result) reject(new Error("Formula not found: " + sku_data[sku_fields.formula_num]));
                sku_data['formula_id'] = formula_result._id;
                sku_data['formula_name'] = formula_result.name

                mls = result[4]
                expected_mls = sku_data[sku_fields.mls].split(',')
                if(mls.length != expected_mls.length) reject(new Error("Not all Manufacturing Lines found: " + sku_data[sku_fields.mls]));
                sku_data['ml_results'] = mls

                if(number_result) {
                    if(number_result.name == sku_data[sku_fields.name] &&
                        number_result.case_number == sku_data[sku_fields.case_upc] &&
                        number_result.unit_number == sku_data[sku_fields.unit_upc] &&
                        number_result.unit_size == sku_data[sku_fields.unit_size] &&
                        number_result.count_per_case == sku_data[sku_fields.count] &&
                        number_result.product_line._id.toString() == pl_result._id.toString() &&
                        (number_result.comment == sku_data[sku_fields.comment] ||
                        !number_result.comment && sku_data[sku_fields.comment].length == 0) &&
                        number_result.formula.toString() == formula_result._id.toString() &&
                        number_result.formula_scale_factor == sku_data[sku_fields.formula_factor] &&
                        number_result.manufacturing_rate == sku_data[sku_fields.rate] &&
                        mLsEqual(number_result.manufacturing_lines, expected_mls))
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

function mLsEqual(old_mls, new_mls) {
    new_list_set = new Set();
    
    new_mls.forEach(entry => {
        new_list_set.add(entry)
    })

    old_list_set = new Set();
    old_mls.forEach(entry => {
        if(entry._id !== null)
            old_list_set.add((entry._id.shortname).toString())
    })

    return setsEqual(new_list_set, old_list_set, {}, {})
}

function checkFormulaIngsOverlap(new_list, old_list) {
    new_list_set = new Set();
    new_list_dict = {};
    
    new_list.forEach(entry => {
        new_list_set.add(entry._id.toString())
        new_list_dict[entry._id.toString()] = entry.quantity
    })

    old_list_set = new Set();
    old_list_dict = {};
    old_list.forEach(entry => {
        if(entry._id !== null)
            old_list_set.add((entry._id._id).toString())
            old_list_dict[(entry._id._id).toString()] = entry.quantity
    })

    return setsEqual(new_list_set, old_list_set, new_list_dict, old_list_dict)
}

function setsEqual(set1, set2, dict1, dict2) {
    if (set1.size !== set2.size) return false;
    for (var a of set1) if (!set2.has(a) || dict1[a] != dict2[a]) return false;
    return true;
}

module.exports.parseFormula = parseFormula = function(file) {
    return new Promise(function(resolve, reject) {
        return parseFile(file, resolve, reject) 
    }).then(function(data) {
        return checkFormulas(data);
    })
}

function checkFormulas(data) {
    if (data.errors.length != 0) throw data.errors;
    Helpers.checkFileHeaders(data.meta.fields, formula_header);

    let formula_data = data.data;
    let formulas = checkFormulaFileDuplicates(formula_data);
    return Promise.all(formulas.map(preprocessOneFormula));
}

module.exports.checkFormulaFileDuplicates = checkFormulaFileDuplicates = function(formula_data) {
    let i;
    let cur_formula = null
    let formulas = []
    let numbers = []
    for(i = 0; i < formula_data.length; i++) {
        if(cur_formula == null || 
            (cur_formula.name != formula_data[i][formula_fields.name] || 
                cur_formula.number != formula_data[i][formula_fields.number])) {
            if(cur_formula != null) {
                formulas.push(cur_formula)
            }

            if(numbers.includes(formula_data[i][formula_fields.number])) {
                throw new Error("Duplicate Formula# in file: " + formula_data[i][formula_fields.number]);
            }
            numbers.push(formula_data[i][formula_fields.number]);
            
            cur_formula = {
                name: formula_data[i][formula_fields.name],
                number: formula_data[i][formula_fields.number],
                ingredients_list: [],
                comment: formula_data[i][formula_fields.comment]
            }
        }

        if (cur_formula.ingredients_list.some(e => e.number === formula_data[i][formula_fields.ing_num])) {
            throw new Error(`Formula number ${cur_formula.number} contains duplicate Ingr#: ${formula_data[i][formula_fields.number]}.`);
        }
        cur_formula.ingredients_list.push({
            number: formula_data[i][formula_fields.ing_num],
            quantity: formula_data[i][formula_fields.quantity]})
    }

    if(cur_formula != null) {
        formulas.push(cur_formula)
    }

    return formulas
}

 module.exports.checkFormulaFields = checkFormulaFields = function (name, number) {
    if(!(name) || !(number)) 
        throw new Error(`Formula name and number are required. Got: ${name}, ${number}`)
    if(name.length > 32)
        throw new Error(`Formula name must be less than 32 characters. Got length ${name.length} in ${name}`)
    if(!Helpers.isPositiveInteger(number))
        throw new Error(`Formula number should be a positive integer. Got: ${number}`)
} 

function checkFormulaFileFields(name, number, ing_list) {
    checkFormulaFields(name, number)

    ing_list.forEach(ing => {
        if(!Helpers.isPositiveInteger(ing.number)) 
            throw new Error(
                `Ingr# for formula number ${number} is not a valid number: ${ing.number}`);

        if(!Helpers.unitChecker(ing.quantity)) 
            throw new Error(
                `Ingredient quantity for formula number ${number} is not formatted correctly: ` + ing.quantity);

    })
}

// visible for testing
module.exports.preprocessOneFormula = preprocessOneFormula = function(formula_entry) {
    checkFormulaFileFields(formula_entry.name, formula_entry.number, formula_entry.ingredients_list)
    return new Promise(function(accept, reject) {
        Promise.all([
            Formula.findOne({number: formula_entry.number}),
            Promise.all(formula_entry.ingredients_list.map(ing => Ingredient.findOne({number: ing.number})))
        ])
        .then(result => {
            formula_res = result[0]
            ings_res = result[1]
            let i
            for (i = 0; i < formula_entry.ingredients_list.length; i++) {
                if(!(ings_res[i])) {
                    reject(new Error(`Ingr# for formula ${formula_entry.number} not found: ${formula_entry.ingredients_list[i].number}.`))
                    return;
                }
                formula_entry.ingredients_list[i]._id = ings_res[i]._id
            }
            if(!formula_res) {
                formula_entry["status"] = "Store";
                accept(formula_entry);
            }
            else {
                if(formula_entry[formula_fields.name] == formula_res.name && 
                    (formula_res.comment == formula_entry[formula_fields.comment] || 
                    !formula_res.comment && formula_entry[formula_fields.comment].length == 0) &&
                    checkFormulaIngsOverlap(formula_entry.ingredients_list, formula_res.ingredients_list))
                    formula_entry['status'] = "Ignore";
                else
                    formula_entry['status'] = "Overwrite";
                    formula_entry["to_overwrite"] = formula_res;
                    accept(formula_entry);
            }
        })
        .catch(reject)
    });
}

module.exports.checkManufacturingLine = checkManufacturingLine = function(name, shortname) {
    if(!(name) || !(shortname)) 
        throw new Error(`Manufacturing line name and shortname required. Got: ${name},${shortname}`)
    if(name.length > 32) 
        throw new Error(`Manufacturing line name must be less than 32 characters. Got length ${name.length} for: ${name}`)
    if(shortname.length > 5)
        throw new Error(`Manufacturing line shortname must be less than 5 characters. Got length ${shortname.length} for ${shortname}`)
}