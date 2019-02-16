// PL headers
module.exports.pl_fields = pl_fields = {name: 'name'};
module.exports.product_lines_header = [ pl_fields.name ];

// Ingredients headers
module.exports.ing_fields = ing_fields = {number: 'ingr#', name: 'name', vendor: 'vendor Info', size: 'size', cost: 'cost', comment: 'comment'};
module.exports.ing_fields = [ ing_fields.number, ing_fields.name, ing_fields.vendor, ing_fields.size, ing_fields.cost, ing_fields.comment ];

// SKUs headers
module.exports.sku_fields = sku_fields = {number: 'sku#', name: 'name', case_upc: 'case upc', unit_upc: 'unit upc', unit_size: 'unit size', count: 'count per case', pl_name: 'pl name', comment: 'comment', formula_num: "formula#", formula_factor: "formula factor", rate: "rate", mls: "ml shortnames"};
module.exports.skus_header =  [ sku_fields.number,sku_fields.name,sku_fields.case_upc,sku_fields.unit_upc,sku_fields.unit_size,sku_fields.count,sku_fields.pl_name,sku_fields.formula_num,sku_fields.formula_factor,sku_fields.mls,sku_fields.rate,sku_fields.comment ];

// Formula headers
module.exports.formula_fields = formula_fields = {number: 'formula#', name: 'name', ing_num: "ingr#", quantity: "quantity", comment: 'comment'};
module.exports.formula_header = formula_header = [ formula_fields.number, formula_fields.name, formula_fields.ing_num, formula_fields.quantity, formula_fields.comment ];

