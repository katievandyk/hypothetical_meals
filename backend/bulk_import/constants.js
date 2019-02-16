// PL headers
module.exports.pl_fields = pl_fields = {name: 'name'};
module.exports.product_lines_header = [ pl_fields.name ];

// Ingredients headers
module.exports.ing_fields = ing_fields = {number: 'ingr#', name: 'name', vendor: 'vendor info', size: 'size', cost: 'cost', comment: 'comment'};
module.exports.ingredients_header = [ ing_fields.number, ing_fields.name, ing_fields.vendor, ing_fields.size, ing_fields.cost, ing_fields.comment ];

// SKUs headers
module.exports.sku_fields = sku_fields = {number: 'sku#', name: 'name', case_upc: 'case upc', unit_upc: 'unit upc', unit_size: 'unit size', count: 'count per case', pl_name: 'pl name', comment: 'comment', formula_num: "formula#", formula_factor: "formula factor", rate: "rate", mls: "ml shortnames"};
module.exports.skus_header =  [ sku_fields.number,sku_fields.name,sku_fields.case_upc,sku_fields.unit_upc,sku_fields.unit_size,sku_fields.count,sku_fields.pl_name,sku_fields.formula_num,sku_fields.formula_factor,sku_fields.mls,sku_fields.rate,sku_fields.comment ];

// Formula headers
module.exports.formula_fields = formula_fields = {number: 'formula#', name: 'name', ing_num: "ingr#", quantity: "quantity", comment: 'comment'};
module.exports.formula_header = formula_header = [ formula_fields.number, formula_fields.name, formula_fields.ing_num, formula_fields.quantity, formula_fields.comment ];

// Units
module.exports.units = {
    "oz": "weight",
    "ounce": "weight",
    "lb": "weight",
    "pound": "weight",
    "ton": "weight",
    "g": "weight",
    "gram": "weight",
    "kg": "weight",
    "kilogram": "weight",
    "floz": "volume",
    "fluidounce": "volume",
    "pt": "volume",
    "pint": "volume",
    "qt": "volume",
    "quart": "volume",
    "gal": "volume",
    "gallon": "volume",
    "ml": "volume",
    "milliliter": "volume",
    "l": "volume",
    "liter": "volume",
    "ct": "count",
    "count": "count",
}

// the conversion between 1 key and ounce
module.exports.weight_conv = {
    "oz": 1.0,
    "ounce": 1.0,
    "lb": 16.0,
    "pound": 16.0,
    "ton": 32000,
    "g": 0.035274,
    "gram": 0.035274,
    "kg": 35.274,
    "kilogram": 35.274
}

// the conversion between 1 key and floz
module.exports.volume_conv = {
    "floz": 1.0,
    "fluidounce": 1.0,
    "pt": 19.2152,
    "pint": 19.2152,
    "qt": 32.0,
    "quart": 32.0,
    "gal": 128.0,
    "gallon": 128.0,
    "ml": 0.033814,
    "milliliter": 0.033814,
    "l": 33.814,
    "liter": 33.814
}