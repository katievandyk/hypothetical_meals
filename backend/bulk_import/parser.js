const fs = require('fs');
const Papa = require('papaparse');
const Helpers = require('./helpers');

// Import Models
const ProductLine = require('../models/ProductLine');
const SKU = require('../models/SKU');
const Ingredient = require('../models/Ingredient');
const ManufacturingLine = require('../models/ManufacturingLine');
const Formula = require('../models/Formula')

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

module.exports.ml_fields = ml_fields = {name: 'Name', shortname: 'ML Shortname', comment: 'Comment'};
module.exports.ml_header = ml_header = [ml_fields.name, ml_fields.shortname, ml_fields.comment ];

module.exports.parseMLFile = parseMLFile = function(file) {
    return new Promise(function(resolve, reject) {
        return Papa.parse(file, {
            header: true,
            skipEmptyLines: true, 
            delimiter: ",",
            complete: resolve, 
            error: reject
        });
    }).then(function(data) {
        return checkMLs(data);
    })
}

function checkMLs(data) {
    if (data.errors.length != 0) throw data.errors;
    Helpers.checkFileHeaders(data.meta.fields, ml_header);

    let ml_data = data.data;
    checkMLFileDuplicates(ml_data);
    return Promise.all(ml_data.map(preprocessOneML));
}

module.exports.checkMLFileDuplicates = checkMLFileDuplicates = function(ml_data) {
    let i;
    let shortnames = [];
    for(i = 0; i < ml_data.length; i++) {
        if(shortnames.includes(ml_data[i][ml_fields.shortname])) {
            throw new Error("Duplicate shortname in file: " + ml_data[i][ml_fields.shortname]);
        }
        shortnames.push(ml_data[i][ml_fields.shortname]);
    }
}

 module.exports.checkManufacturingLine = checkManufacturingLine = function(name, shortname) {
    if(!(name) || !(shortname)) 
        throw new Error(`Manufacturing line name and shortname required. Got: ${name},${shortname}`)
    if(name.length > 32) 
        throw new Error(`Manufacturing line name must be less than 32 characters. Got length ${name.length} for: ${name}`)
    if(shortname.length > 5)
        throw new Error(`Manufacturing line shortname must be less than 5 characters. Got length ${shortname.length} for ${shortname}`)
}

// visible for testing
module.exports.preprocessOneML = preprocessOneML = function(ml_entry) {
    checkManufacturingLine(ml_entry[ml_fields.name], ml_entry[ml_fields.shortname])

    return new Promise(function(accept, reject) {
        ManufacturingLine
            .findOne({shortname: ml_entry[ml_fields.shortname]})
            .then(result => {
                if(!result) {
                    ml_entry["status"] = "Store";
                    accept(ml_entry);
                }
                else {
                    if(ml_entry[ml_fields.name] == result.name && (result.comment == ml_entry[ml_fields.comment] || 
                        !result.comment && ml_entry[ml_fields.comment].length == 0))
                        ml_entry['status'] = "Ignore";
                    else
                        ml_entry['status'] = "Overwrite";
                        ml_entry["to_overwrite"] = result;
                     accept(ml_entry);
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


const sku_fields = {number: 'SKU#', name: 'Name', case_upc: 'Case UPC', unit_upc: 'Unit UPC', unit_size: 'Unit size', count: 'Count per case', pl_name: 'Product Line Name', comment: 'Comment', formula_num: "Formula#", formula_factor: "Formula factor", rate: "Rate", mls: "Manufacturing Lines"};
const skus_header =  [ sku_fields.number,sku_fields.name,sku_fields.case_upc,sku_fields.unit_upc,sku_fields.unit_size,sku_fields.count,sku_fields.pl_name,sku_fields.comment,sku_fields.formula_num,sku_fields.formula_factor,sku_fields.rate,sku_fields.mls ];

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
            SKU.findOne({'number': sku_data[sku_fields.number]}).populate("product_line").populate("manufacturing_lines._id"),
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
                        number_result.formula._id.toString() == formula_result._id.toString() &&
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


module.exports.parseFormulaIngredients = parseFormulaIngredients = function(file) {
    return new Promise(function(resolve, reject) {
        return Papa.parse(file, {
            header: true,
            skipEmptyLines: true, 
            delimiter: ",",
            complete: resolve, 
            error: reject
        });
    }).then(function(data) {
        return checkFormulaIngredients(data);
    })
}

const formula_ing_fields = {formula_num: 'Formula#', ing_num: 'Ingr#', quantity:'Quantity'};
const formula_ing_header = [ formula_ing_fields.formula_num, formula_ing_fields.ing_num, formula_ing_fields.quantity];

function checkFormulaIngredients(data) {
    if (data.errors.length != 0) throw data.errors;
    Helpers.checkFileHeaders(data.meta.fields, formula_ing_header);

    formula_data = data.data;

    formulas_map = checkFormulaIngredientsFileDuplicates(formula_data);

    return Promise.all(
        Object.keys(formulas_map).map(
            function(key) {
                return Promise.all(
                        formulas_map[key].map(checkOneForumlaIngredient)
                        ).then(result => {
                            return new Promise(function(accept, reject) {
                                new_list = result
                                old_list = result[0][1]
                                status = checkResultOverlap(new_list, old_list) ? "Ignore" : "Overwrite";
                                final_res = {formula_id: result[0][0].formula_id, result: result, status: status, to_overwrite: result[0][1]}
                                accept(final_res)
                            })
                        })
                    }))

}

module.exports.parseSKUMLs = parseSKUMLs = function(file) {
    return new Promise(function(resolve, reject) {
        return Papa.parse(file, {
            header: true,
            skipEmptyLines: true, 
            delimiter: ",",
            complete: resolve, 
            error: reject
        });
    }).then(function(data) {
        return checkSKUMLs(data);
    })
}

const sku_ml_fields = {sku_num: 'SKU#', ml_shortname: 'ML Shortname'};
const sku_ml_header = [ sku_ml_fields.sku_num, sku_ml_fields.ml_shortname];

function checkSKUMLs(data) {
    if (data.errors.length != 0) throw data.errors;
    Helpers.checkFileHeaders(data.meta.fields, sku_ml_header);

    sku_ml_data = data.data;

    sku_ml_map = checkSKUMLsFileDuplicates(sku_ml_data);

    return Promise.all(
        Object.keys(sku_ml_map).map(
            function(key) {
                return Promise.all(
                    sku_ml_map[key].map(checkOneSKUML)
                        ).then(result => {
                            return new Promise(function(accept, reject) {
                                new_list = result
                                old_list = result[0][1]
                                status = checkSKUMlResultOverlap(new_list, old_list) ? "Ignore" : "Overwrite";
                                final_res = {sku_id: result[0][0].sku_id, result: result, status: status, to_overwrite: result[0][1]}
                                accept(final_res)
                            })
                        })
                    }))

}

// visible for testing
module.exports.checkSKUMLsFileDuplicates = checkSKUMLsFileDuplicates = function(sku_ml_data) {
    let i;
    let sku_to_mls = {};
    let skus_map = {};
    for(i = 0; i < sku_ml_data.length; i++) {
        if(sku_to_mls[sku_ml_data[i][sku_ml_fields.sku_num]] && 
            sku_to_mls[sku_ml_data[i][sku_ml_fields.sku_num]]
            .includes(sku_ml_data[i][sku_ml_fields.ml_shortname]))
            throw new Error(`Duplicate SKU#,ML Shortname entry in file: ` + 
            `${sku_ml_data[i][sku_ml_fields.sku_num]},${sku_ml_data[i][sku_ml_fields.ml_shortname]}`);
        if(sku_to_mls[sku_ml_data[i][sku_ml_fields.sku_num]]) {
            sku_to_mls[sku_ml_data[i][sku_ml_fields.sku_num]].push(sku_ml_data[i][sku_ml_fields.ml_shortname]);
            skus_map[sku_ml_data[i][sku_ml_fields.sku_num]].push(sku_ml_data[i])
        }
        else {
            sku_to_mls[sku_ml_data[i][sku_ml_fields.sku_num]] = [sku_ml_data[i][sku_ml_fields.ml_shortname]];
            skus_map[sku_ml_data[i][sku_ml_fields.sku_num]] = [(sku_ml_data[i])]
        }
    }
    return skus_map
}

module.exports.checkOneSKUML = checkOneSKUML = function(sku_ml_data) {
    if(sku_ml_data[sku_ml_fields.sku_num].length === 0 || sku_ml_data[sku_ml_fields.ml_shortname].length === 0) 
        throw new Error("SKU# and ML Shortname fields are required.")
    if(!Helpers.isPositiveInteger(sku_ml_data[sku_ml_fields.sku_num])) 
        throw new Error(
            "Formula# is not a valid number: " + sku_ml_data[sku_ml_fields.sku_num]);
    let sku_num = parseInt(sku_ml_data[sku_ml_fields.sku_num]);

    var skuPromise = new Promise(function(accept, reject) {
        SKU.findOne({number: sku_num}).populate('manufacturing_lines._id').lean()
            .then(result => {
                if(!result) reject(new Error("SKU# not found: " + sku_num));
                else accept(result);
            });
    });

    var mlPromise = new Promise(function(accept, reject) {
        ManufacturingLine.findOne({shortname: sku_ml_data[sku_ml_fields.ml_shortname]}).lean()
            .then(result => {
                if(!result) reject(new Error("ML Shortname not found: " + sku_ml_data[sku_ml_fields.ml_shortname]));
                else accept(result);
            });
    });

    return new Promise(function(accept, reject) {
        Promise.all([skuPromise, mlPromise]).then(result => {
            let skuDoc = result[0];
            let mlDoc = result[1];
    
            sku_ml_data["sku_id"] = skuDoc._id;
            sku_ml_data["ml_id"] = mlDoc._id;
            accept([sku_ml_data, skuDoc.manufacturing_lines]);
        }).catch(error => reject(error));
    });
}


function checkSKUMlResultOverlap(new_list, old_list) {
    new_list_set = new Set();
    
    new_list.forEach(entry => {
        new_list_set.add(entry[0]['ML Shortname'])
    })

    old_list_set = new Set();
    old_list.forEach(entry => {
        if(entry._id !== null)
            old_list_set.add((entry._id.shortname).toString())
    })

    return setsEqual(new_list_set, old_list_set, {}, {})
}


function checkResultOverlap(new_list, old_list) {
    new_list_set = new Set();
    new_list_dict = {};
    
    new_list.forEach(entry => {
        new_list_set.add(entry[0]['Ingr#'])
        new_list_dict[entry[0]['Ingr#']] = Number.parseFloat(entry[0]['Quantity'])
    })

    old_list_set = new Set();
    old_list_dict = {};
    old_list.forEach(entry => {
        if(entry._id !== null)
            old_list_set.add((entry._id.number).toString())
            old_list_dict[(entry._id.number).toString()] = entry.quantity
    })

    return setsEqual(new_list_set, old_list_set, new_list_dict, old_list_dict)
}

function setsEqual(set1, set2, dict1, dict2) {
    if (set1.size !== set2.size) return false;
    for (var a of set1) if (!set2.has(a) || dict1[a] != dict2[a]) return false;
    return true;
}

// visible for testing
module.exports.checkFormulaIngredientsFileDuplicates = checkFormulaIngredientsFileDuplicates = function(formula_data) {
    let i;
    let formula_to_ings = {};
    let formulas_map = {};
    for(i = 0; i < formula_data.length; i++) {
        if(formula_to_ings[formula_data[i][formula_ing_fields.formula_num]] && 
            formula_to_ings[formula_data[i][formula_ing_fields.formula_num]]
            .includes(formula_data[i][formula_ing_fields.ing_num]))
            throw new Error(`Duplicate formula,ing entry in file: ` + 
            `${formula_data[i][formula_ing_fields.formula_num]},${formula_data[i][formula_ing_fields.ing_num]}`);
        if(formula_to_ings[formula_data[i][formula_ing_fields.formula_num]]) {
            formula_to_ings[formula_data[i][formula_ing_fields.formula_num]].push(formula_data[i][formula_ing_fields.ing_num]);
            formulas_map[formula_data[i][formula_ing_fields.formula_num]].push(formula_data[i])
        }
        else {
            formula_to_ings[formula_data[i][formula_ing_fields.formula_num]] = [formula_data[i][formula_ing_fields.ing_num]];
            formulas_map[formula_data[i][formula_ing_fields.formula_num]] = [(formula_data[i])]
        }
    }
    return formulas_map
}

module.exports.checkOneForumlaIngredient = checkOneForumlaIngredient = function(formula_data) {
    if(formula_data[formula_ing_fields.formula_num].length === 0 || formula_data[formula_ing_fields.ing_num].length === 0 || formula_data[formula_ing_fields.quantity] === 0) 
        throw new Error("Formula#, Ingr#, and Quantity fields are required.")
    if(!Helpers.isPositiveInteger(formula_data[formula_ing_fields.formula_num])) 
        throw new Error(
            "Formula# is not a valid number: " + formula_data[formula_ing_fields.formula_num]);
    let formula_num = parseInt(formula_data[formula_ing_fields.formula_num]);

    if(!Helpers.isPositiveInteger(formula_data[formula_ing_fields.ing_num])) 
        throw new Error(
            "Ingr# is not a valid number: " + formula_data[formula_ing_fields.ing_num]);
    let ing = parseInt(formula_data[formula_ing_fields.ing_num]);

    if(!Helpers.isNumeric(formula_data[formula_ing_fields.quantity])) 
        throw new Error(
            "Ingredient quantity is not a number: " + formula_data[formula_ing_fields.quantity]);
    if (parseFloat(formula_data[formula_ing_fields.quantity]) < 0) 
        throw new Error(
            "Ingredient quantity is not a positive number: " + formula_data[k]);

    var formulaPromise = new Promise(function(accept, reject) {
        Formula.findOne({number: formula_num}).populate("ingredients_list._id").lean()
            .then(result => {
                if(!result) reject(new Error("Formula# not found: " + formula_num));
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
        Promise.all([formulaPromise, ingPromise]).then(result => {
            let formulaDoc = result[0];
            let ingDoc = result[1];
    
            formula_data["ing_id"] = ingDoc._id;
            formula_data["formula_id"] = formulaDoc._id;
            accept([formula_data, formulaDoc.ingredients_list]);
        }).catch(error => reject(error));
    });
}

module.exports.parseFormula = parseFormula = function(file) {
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

module.exports.formula_fields = formula_fields = {number: 'Formula#', name: 'Name', comment: 'Comment'};
module.exports.formula_header = formula_header = [ formula_fields.number, formula_fields.name, formula_fields.comment ];


function checkFormulas(data) {
    if (data.errors.length != 0) throw data.errors;
    Helpers.checkFileHeaders(data.meta.fields, formula_header);

    let formula_data = data.data;
    checkFormulaFileDuplicates(formula_data);
    return Promise.all(formula_data.map(preprocessOneFormula));
}

module.exports.checkFormulaFileDuplicates = checkFormulaFileDuplicates = function(formula_data) {
    let i;
    let numbers = [];
    for(i = 0; i < formula_data.length; i++) {
        if(numbers.includes(formula_data[i][formula_fields.number])) {
            throw new Error("Duplicate Formula# in file: " + formula_data[i][formula_fields.number]);
        }
        numbers.push(formula_data[i][formula_fields.number]);
    }
}

 module.exports.checkFormulaFields = checkFormulaFields = function (name, number) {
    if(!(name) || !(number)) 
        throw new Error(`Formula name and number are required. Got: ${name}, ${number}`)
    if(name.length > 32)
        throw new Error(`Formula name must be less than 32 characters. Got length ${name.length} in ${name}`)
    if(!Helpers.isPositiveInteger(number))
        throw new Error(`Formula number should be a positive integer. Got: ${number}`)
} 

// visible for testing
module.exports.preprocessOneFormula = preprocessOneFormula = function(formula_entry) {
    checkFormulaFields(formula_entry[formula_fields.name], formula_entry[formula_fields.number])

    return new Promise(function(accept, reject) {
        Formula
            .findOne({number: formula_entry[formula_fields.number]})
            .then(result => {
                if(!result) {
                    formula_entry["status"] = "Store";
                    accept(formula_entry);
                }
                else {
                    if(formula_entry[formula_fields.name] == result.name && 
                        (result.comment == formula_entry[formula_fields.comment] || 
                        !result.comment && formula_entry[formula_fields.comment].length == 0))
                        formula_entry['status'] = "Ignore";
                    else
                        formula_entry['status'] = "Overwrite";
                        formula_entry["to_overwrite"] = result;
                     accept(formula_entry);
                }
            })
    });
}