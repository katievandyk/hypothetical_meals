// const fs = require('fs');
// const Papa = require('papaparse');
// const assert = require('assert');

// // Ingredient Model
// const Ingredient = require('../models/Ingredient');

// // SKU Model
// const SKU = require('../models/SKU');

// var ingredients_header = [ 'Ingr#', 'Name', 'Vendor Info', 'Size', 'Cost', 'Comment' ];
// var product_lines_header = [ 'Name' ];
// var skus_header =  [ 'SKU#','Name','Case UPC','Unit UPC','Unit size','Count per case','Product Line Name','Comment' ];

// function _isNumeric(n) {
//     return !isNaN(parseFloat(n)) && isFinite(n);
// }

// function _isPositiveInteger(n) {
//     return 0 === n % (!isNaN(parseFloat(n)) && 0 <= ~~n);
// }

// var files = [
//     fs.readFileSync("/Users/kguo/Downloads/ingredients1.csv", 'utf8'),
//     fs.readFileSync("/Users/kguo/Downloads/skus1.csv", 'utf8'),
//     fs.readFileSync("/Users/kguo/Downloads/product_lines1.csv", 'utf8'),
//     fs.readFileSync("/Users/kguo/Downloads/formula1.csv", 'utf8')
// ];



// module.exports.parseIngredientFile = parseIng = function() {
//     var file = fs.readFileSync("/Users/kguo/Downloads/ingredients1.csv", 'utf8');
//     return new Promise(function(resolve, reject) {
//         return Papa.parse(file, {
//             header: true,
//             skipEmptyLines: true, 
//             delimiter: ",",
//             complete: resolve, 
//             error: reject
//         });
//     }).then(function(data) {
//         return uploadIngredients(data);
//     })
// }

// function uploadIngredients(data) {
//     console.log(data);

//     if (data.errors.length == 0) throw data.errors;

//     // Check if file header is proper
//     var file_header = data.meta.fields;
//     var is_same = (file_header.length == ingredients_header.length) && file_header.every(function(element, index) {
//         return element.trim() === ingredients_header[index].trim(); 
//     });
//     assert(is_same, "File header doesn't match expected header: " + ingredients_header);

//     ing_data = data.data;

//     ing_data.map
// }

// function checkOneIngredient()  {
//     function _arrayify(obj) { return Object.keys(obj).map(function (k) {
//         switch(k.trim()) {
//             case skus_header[0]: 
//                 assert(_isPositiveInteger(obj[k]), "SKU number is not a valid number: " + obj[k]);
//                 var val = parseInt(obj[k]);
//                 assert(!nums.includes(val), "SKU number repeated: " + obj[k]);
//                 nums.push(val);
//                 break;
//             case skus_header[1]:
//                 var trimmed = obj[k].trim();
//                 assert(names.length <= 32, "SKU name more than 32 characters: " + trimmed)
//                 assert(!names.includes(trimmed), "SKU name repeated: " + trimmed);
//                 names.push(trimmed);
//                 break;
//             case skus_header[2]:
//                 assert(_isPositiveInteger(obj[k]), "SKU case# is not a valid number: " + obj[k]);
//                 var parsed_num = obj[k];
//                 if(!_is_upca_standard(parseInt(parsed_num))) throw "SKU case# is not UPC-A compliant: " + obj[k];
//                 cases_upc.push(obj[k]);
//                 break;
//             case skus_header[3]:
//                 assert(_isPositiveInteger(obj[k]), "SKU units# is not a valid number: " + obj[k]);
//                 var parsed_num = obj[k];
//                 if(!_is_upca_standard(parseInt(parsed_num))) throw "SKU unit# is not UPC-A compliant: " + obj[k];
//                 units_upc.push(obj[k]);
//                 break;
//             case skus_header[4]:
//                 assert(obj[k].length > 0, "SKU unit size required");
//                 units_size.push(obj[k]);
//                 break;
//             case skus_header[5]:
//                 assert(_isPositiveInteger(obj[k]), "SKU counts per case is not a valid number: " + obj[k]);
//                 counts_per_case.push(parseInt(obj[k]));
//                 break;
//             case skus_header[6]:
//                 pl_names.push(obj[k]);
//                 break;
//             case skus_header[7]:
//                 comments.push(obj[k]);
//                 break;
//             default:
//                 break;
//         }
//     })};
// }

// parseIng();


// module.exports.parseFiles = parseFiles = function() {
//     var promises = files.map(file => new Promise(
//         (resolve, reject) => Papa.parse(file, {
//             header: true,
//             skipEmptyLines: true, 
//             delimiter: ",",
//             complete: resolve, 
//             error: reject
//         })));
    
//     console.log(promises);
    
//     // promises.push(Ingredient.find().select("number").exec());
    
//     // console.log(promises);
    
//     Promise.all(promises).then(
//         function(results) {
//             console.log("hello");
//             var ing_results = validateIngredients(results[0]);
//             var pl_results = validateProductLines(results[2]);
//             // console.log(ing_results);
//             // console.log(pl_results);
//             // console.log(results[1]);
//             // console.log(results[3]);
//             var sku_results = validateSkus(results[1]);
//             console.log(sku_results);
    
//             console.log(results[4]);
//         }
//     )
// }

// // parseFiles();

// function _is_upca_standard(code) {
//     var i;
//     var sum = 0;
//     var code_temp = code;
//     code /= 10;
//     for(i = 1; i < 12; i++) {
//         var digit = Math.floor(code % 10);
//         if (i == 11 && !(digit == 0 | digit == 1 | digit >= 6 && digit <= 9)) {
//             console.log("not compilant: " + digit);
//             return false;
//         }
            
//         code /= 10;
//         sum += i%2 == 0 ? digit : digit*3;
//     }

//     var check_digit = (10-sum%10)%10;
//     if(check_digit != code_temp % 10) {
//         console.log("not compilant: " + check_digit + " " + code_temp % 10);
//         return false;
//     }

//     return true;
// };

// function validateSkus(results) {
//     console.log(results.meta.fields);

//     var nums = [];
//     var names = [];
//     var cases_upc = [];
//     var units_upc = [];
//     var units_size = [];
//     var counts_per_case = [];
//     var pl_names = [];
//     var comments = [];

//     assert(results.errors.length == 0);

//     // Check if file header is proper
//     var file_header = results.meta.fields;
//     var is_same = (file_header.length == skus_header.length) && file_header.every(function(element, index) {
//         return element.trim() === skus_header[index].trim(); 
//     });

//     assert(is_same, "File header doesn't match expected header: " + skus_header);

//     function _arrayify(obj) { return Object.keys(obj).map(function (k) {
//         switch(k.trim()) {
//             case skus_header[0]: 
//                 assert(_isPositiveInteger(obj[k]), "SKU number is not a valid number: " + obj[k]);
//                 var val = parseInt(obj[k]);
//                 assert(!nums.includes(val), "SKU number repeated: " + obj[k]);
//                 nums.push(val);
//                 break;
//             case skus_header[1]:
//                 var trimmed = obj[k].trim();
//                 assert(names.length <= 32, "SKU name more than 32 characters: " + trimmed)
//                 assert(!names.includes(trimmed), "SKU name repeated: " + trimmed);
//                 names.push(trimmed);
//                 break;
//             case skus_header[2]:
//                 assert(_isPositiveInteger(obj[k]), "SKU case# is not a valid number: " + obj[k]);
//                 var parsed_num = obj[k];
//                 if(!_is_upca_standard(parseInt(parsed_num))) throw "SKU case# is not UPC-A compliant: " + obj[k];
//                 cases_upc.push(obj[k]);
//                 break;
//             case skus_header[3]:
//                 assert(_isPositiveInteger(obj[k]), "SKU units# is not a valid number: " + obj[k]);
//                 var parsed_num = obj[k];
//                 if(!_is_upca_standard(parseInt(parsed_num))) throw "SKU unit# is not UPC-A compliant: " + obj[k];
//                 units_upc.push(obj[k]);
//                 break;
//             case skus_header[4]:
//                 assert(obj[k].length > 0, "SKU unit size required");
//                 units_size.push(obj[k]);
//                 break;
//             case skus_header[5]:
//                 assert(_isPositiveInteger(obj[k]), "SKU counts per case is not a valid number: " + obj[k]);
//                 counts_per_case.push(parseInt(obj[k]));
//                 break;
//             case skus_header[6]:
//                 pl_names.push(obj[k]);
//                 break;
//             case skus_header[7]:
//                 comments.push(obj[k]);
//                 break;
//             default:
//                 break;
//         }
//     })};

//     results.data.every(_arrayify);

//     var mapped_results = new Map();
//     mapped_results.set("nums", nums);
//     mapped_results.set("names", names);
//     mapped_results.set("cases_upc", cases_upc);
//     mapped_results.set("units_upc", units_upc);
//     mapped_results.set("units_size", units_size);
//     mapped_results.set("counts_per_case", counts_per_case);
//     mapped_results.set("pl_names", pl_names);
//     mapped_results.set("comments", comments);

//     return mapped_results;
// }

// function validateProductLines(results) {
//     var names = [];

//     console.log(results);

//     assert(results.errors.length == 0);

//     // Check if file header is proper
//     var file_header = results.meta.fields;
//     var is_same = (file_header.length == product_lines_header.length) && file_header.every(function(element, index) {
//         return element.trim() === product_lines_header[index].trim(); 
//     });
//     assert(is_same, "File header doesn't match expected header: " + product_lines_header);

//     function _arrayify(obj) {
//         return Object.keys(obj).map(function (k) {
//             assert(!names.includes(obj[k]), "Product line name repeated: " + obj[k]);
//             names.push(obj[k]);
//         }
//     )};

//     results.data.every(_arrayify);

//     var mapped_results = new Map();
//     mapped_results.set("names", names);
//     return mapped_results;
// }

// function validateIngredients(results) {
//     var nums = [];
//     var names = [];
//     var vendors = [];
//     var sizes = [];
//     var costs = [];
//     var comments = [];

//     assert(results.errors.length == 0);

//     // Check if file header is proper
//     var file_header = results.meta.fields;
//     var is_same = (file_header.length == ingredients_header.length) && file_header.every(function(element, index) {
//         return element.trim() === ingredients_header[index].trim(); 
//     });
//     assert(is_same, "File header doesn't match expected header: " + ingredients_header);

//     function _arrayify(obj) { return Object.keys(obj).map(function (k) {
//         switch(k.trim()) {
//             case ingredients_header[0]: 
//                 assert(_isPositiveInteger(obj[k]), "Ingredient number is not a valid number: " + obj[k]);
//                 var val = parseInt(obj[k]);
//                 assert(!nums.includes(val), "Ingredient number repeated: " + obj[k]);
//                 nums.push(val);
//                 break;
//             case ingredients_header[1]:
//                 var trimmed = obj[k].trim();
//                 assert(!names.includes(trimmed), "Ingredient name repeated" + obj[k]);
//                 names.push(trimmed);
//                 break;
//             case ingredients_header[2]:
//                 vendors.push(obj[k]);
//                 break;
//             case ingredients_header[3]:
//                 sizes.push(obj[k]);
//                 break;
//             case ingredients_header[4]:
//                 assert(_isNumeric(obj[k]), "Ingredient cost is not a number: " + obj[k]);
//                 var val = parseFloat(obj[k]);
//                 assert(val >= 0, "Ingredient cost is not positive: " + obj[k]);
//                 costs.push(val);
//                 break;
//             case ingredients_header[5]:
//                 comments.push(obj[k]);
//                 break;
//             default:
//                 break;
//         }
//     })};

//     results.data.every(_arrayify);

//     var mapped_results = new Map();
//     mapped_results.set("nums", nums);
//     mapped_results.set("names", names);
//     mapped_results.set("vendors", vendors);
//     mapped_results.set("sizes", sizes);
//     mapped_results.set("costs", costs);
//     mapped_results.set("comments", comments);

//     return mapped_results;
// }