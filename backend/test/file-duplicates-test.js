const assert = require('assert');
const Parser = require("../bulk_import/parser");

describe('product line file checks', function() {
    describe('checkPLFileDuplicates', function() {
        it('should not throw error if theres no duplicates', function() {
            let data = [{'Name': "Hello"}, {"Name": "Product"}];
            Parser.checkPLFileDuplicates(data);
        });
    });
    describe('checkPLFileDuplicates', function() {
        it('should throw error if theres duplicates', function() {
            let data = [{'Name': "Hello"}, {'Name': "Hello"}];
            assert.throws(function() {Parser.checkPLFileDuplicates(data)}, Error);
        });
    });
});

describe('ingredients file checks', function() {
    describe('checkIngredientFileDuplicates', function() {
        it('should not throw error if theres no duplicates', function() {
            let data = [
                {
                    "Ingr#": "91",
                    "Name": "Soy Sauce",
                    "Vendor Info": "Kikoman",
                    "Size": "8floz",
                    "Cost": "3.41",
                    "Comment": "asian"
                },
                {
                    "Ingr#": "888894",
                    "Name": "Plastic",
                    "Vendor Info": "Arizona Vendors",
                    "Size": "14lb",
                    "Cost": "10.2",
                    "Comment": ""
                }];
            Parser.checkIngredientFileDuplicates(data);
        });
    });
    describe('checkIngredientFileDuplicates', function() {
        it('should throw error if theres duplicate names', function() {
            let data = [
                {
                    "Ingr#": "91",
                    "Name": "Soy Sauce",
                    "Vendor Info": "Kikoman",
                    "Size": "8floz",
                    "Cost": "3.41",
                    "Comment": "asian"
                },
                {
                    "Ingr#": "888894",
                    "Name": "Soy Sauce",
                    "Vendor Info": "Arizona Vendors",
                    "Size": "14lb",
                    "Cost": "10.2",
                    "Comment": ""
                }];
            assert.throws(function() {Parser.checkIngredientFileDuplicates(data)}, Error);
            ;
        });
    });
    describe('checkIngredientFileDuplicates', function() {
        it('should throw error if theres duplicate numbers', function() {
            let data = [
                {
                    "Ingr#": "91",
                    "Name": "Soy Sauce",
                    "Vendor Info": "Kikoman",
                    "Size": "8floz",
                    "Cost": "3.41",
                    "Comment": "asian"
                },
                {
                    "Ingr#": "91",
                    "Name": "Soy Sauce",
                    "Vendor Info": "Arizona Vendors",
                    "Size": "14lb",
                    "Cost": "10.2",
                    "Comment": ""
                }];
            assert.throws(function() {Parser.checkIngredientFileDuplicates(data)}, Error);
            ;
        });
    });
});

describe('skus file checks', function() {
    describe('checkSKUFileDuplicates', function() {
        it('should not throw error if theres no duplicates', function() {
            let data = [
                {
                    "SKU#": "12345",
                    "Name": "Tomato soup",
                    "Case UPC": "005102218476",
                    "Unit UPC": "164802618600",
                    "Unit size": "28oz",
                    "Count per case": "24",
                    "Product Line Name": "Canned goods",
                    "Comment": "asdfsdf"
                }
            ];
            Parser.checkSKUFileDuplicates(data);
        });
    });
    describe('checkSKUFileDuplicates', function() {
        it('should not throw error if theres name duplicates', function() {
            let data = [
                {
                    "SKU#": "12345",
                    "Name": "Tomato soup",
                    "Case UPC": "005102218476",
                    "Unit UPC": "164802618600",
                    "Unit size": "28oz",
                    "Count per case": "24",
                    "Product Line Name": "Canned goods",
                    "Comment": "asdfsdf"
                },
                {
                    "SKU#": "12346",
                    "Name": "Tomato soup",
                    "Case UPC": "005102218475",
                    "Unit UPC": "164802618600",
                    "Unit size": "28oz",
                    "Count per case": "24",
                    "Product Line Name": "Canned goods",
                    "Comment": "asdfsdf"
                }
            ];
            Parser.checkSKUFileDuplicates(data);
        });
    });
    describe('checkSKUFileDuplicates', function() {
        it('should throw error if theres SKU# duplicates', function() {
            let data = [
                {
                    "SKU#": "12345",
                    "Name": "Tomato soup",
                    "Case UPC": "005102218476",
                    "Unit UPC": "164802618600",
                    "Unit size": "28oz",
                    "Count per case": "24",
                    "Product Line Name": "Canned goods",
                    "Comment": "asdfsdf"
                },
                {
                    "SKU#": "12345",
                    "Name": "Tomato soup",
                    "Case UPC": "005102218475",
                    "Unit UPC": "164802618600",
                    "Unit size": "28oz",
                    "Count per case": "24",
                    "Product Line Name": "Canned goods",
                    "Comment": "asdfsdf"
                }
            ];
            assert.throws(function() {Parser.checkSKUFileDuplicates(data);}, Error);
        });
    });
    describe('checkSKUFileDuplicates', function() {
        it('should throw error if theres case UPC duplicates', function() {
            let data = [
                {
                    "SKU#": "12345",
                    "Name": "Tomato soup",
                    "Case UPC": "005102218476",
                    "Unit UPC": "164802618600",
                    "Unit size": "28oz",
                    "Count per case": "24",
                    "Product Line Name": "Canned goods",
                    "Comment": "asdfsdf"
                },
                {
                    "SKU#": "12346",
                    "Name": "Tomato soup",
                    "Case UPC": "005102218476",
                    "Unit UPC": "164802618600",
                    "Unit size": "28oz",
                    "Count per case": "24",
                    "Product Line Name": "Canned goods",
                    "Comment": "asdfsdf"
                }
            ];
            assert.throws(function() {Parser.checkSKUFileDuplicates(data);}, Error);
        });
    });
});

describe('formulas file checks', function() {
    describe('checkFormulaFileDuplicates', function() {
        it('should not throw error if theres no duplicates', function() {
            let data = [
                {
                    "SKU#": "1548732089006",
                    "Ingr#": "1548274337896",
                    "Quantity": "1.2"
                }
            ];
            Parser.checkFormulaFileDuplicates(data);
        });
    });
    describe('checkFormulaFileDuplicates', function() {
        it('should not throw error if theres sku# duplicates but no ing duplicates', function() {
            let data = [
                {
                    "SKU#": "1548732089006",
                    "Ingr#": "1548274337896",
                    "Quantity": "1.2"
                },
                {
                    "SKU#": "1548732089006",
                    "Ingr#": "1548274337895",
                    "Quantity": "1.2"
                }
            ];
            Parser.checkFormulaFileDuplicates(data);
        });
    });
    describe('checkFormulaFileDuplicates', function() {
        it('should not throw error if theres ing duplicates but no sku# duplicates', function() {
            let data = [
                {
                    "SKU#": "1548732089005",
                    "Ingr#": "1548274337896",
                    "Quantity": "1.2"
                },
                {
                    "SKU#": "1548732089006",
                    "Ingr#": "1548274337896",
                    "Quantity": "1.2"
                }
            ];
            Parser.checkFormulaFileDuplicates(data);
        });
    });
    describe('checkFormulaFileDuplicates', function() {
        it('should throw error if theres sku# and ing duplicates', function() {
            let data = [
                {
                    "SKU#": "1548732089006",
                    "Ingr#": "1548274337896",
                    "Quantity": "1.2"
                },
                {
                    "SKU#": "1548732089006",
                    "Ingr#": "1548274337896",
                    "Quantity": "1.2"
                }
            ];
            assert.throws(function() {Parser.checkFormulaFileDuplicates(data)}, Error);
        });
    });
});