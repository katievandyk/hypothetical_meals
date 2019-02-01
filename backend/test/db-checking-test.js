const mongoose = require('mongoose');
const assert = require('assert');
const Configs =require("../configs");
const Ingredient = require('../models/Ingredient');
const Parser = require("../bulk_import/parser");
const ProductLine = require('../models/ProductLine');
const SKU = require('../models/SKU');

var pl_id = new mongoose.Types.ObjectId();
var ing1_id = new mongoose.Types.ObjectId();
var sku_id = new mongoose.Types.ObjectId();

describe('Database Tests', function() {
    before(function (done) {
        console.log(pl_id);
        mongoose.connect(Configs.mongoUnitTestsURI);
        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error'));
        db.once('open', function() {
            mongoose.connection.db.dropDatabase().then(() => {
                plPromise = new ProductLine({"name": "Hello_Stored", _id: pl_id}).save();
                ing1Promise = new Ingredient({
                    "_id": ing1_id,
                    "name": "crackers",
                    "number": "1548274308267",
                    "vendor_info": "asdfd",
                    "package_size": "7lbs",
                    "cost_per_package": 2.31,
                    "comment": "crun chy"}).save();
                ing2Promise = new Ingredient({
                    "_id": new mongoose.Types.ObjectId(),
                    "name": "salt",
                    "number": "1548274337896",
                    "vendor_info": "umbrella",
                    "package_size": "3lbs",
                    "cost_per_package": 1,
                    "comment": "salty"}).save();
                skuPromise = new SKU({
                    "_id": sku_id,
                    "name": "Reeses",
                    "number": "8",
                    "case_number": "905102218479",
                    "unit_number": "905102218479",
                    "unit_size": "2lbs",
                    "product_line": pl_id,
                    "count_per_case": "1"}).save();
                Promise.all([plPromise, ing1Promise, ing2Promise, skuPromise])
                .then(() => done()).catch(error => console.error.bind(console, error.message));
            })
        });
    });

    describe('preprocessOnePL', () => {
        it('preprocesses one pl thats not in the db', (done) => {
            data = {"Name": "Hello"};
            Parser.preprocessOnePL(data).then(result => {
                expected_result = {"Name": "Hello", "status": "Store"};
                assert(expected_result.Name === result.Name);
                assert(expected_result.status === result.status);
                done();
            });
        })
    })

    describe('preprocessOnePL', () => {
        it('preprocesses one pl thats is in the db', (done) => {
            data = {"Name": "Hello_Stored"};
            Parser.preprocessOnePL(data).then(result => {
                expected_result = {"Name": "Hello_Stored", "status": "Ignore"};
                assert(expected_result.Name === result.Name);
                assert(expected_result.status === result.status);
                done();
            });
        })
    })

    describe('preprocessOneIngredient', () => {
        it('preprocesses one ingredient thats not in the db', (done) => {
            data = {
                "Name": "Plastic",
                "Ingr#": "888894",
                "Vendor Info": "Arizona Vendors",
                "Size": "14lb",
                "Cost": 10.2,
                "Comment": ""};
            Parser.preprocessOneIngredient(data).then(result => {
                expected_result = {
                    "Name": "Plastic",
                    "Ingr#": "888894",
                    "Vendor Info": "Arizona Vendors",
                    "Size": "14lb",
                    "Cost": "10.2",
                    "Comment": "",
                    "status": "Store"};
                assert(expected_result.Name === result.Name);
                assert(expected_result.status === result.status);
                done();
            });
        })
    })

    describe('preprocessOneIngredient', () => {
        it('preprocesses one ingredient whose name is in the db', (done) => {
            data = {
                "Name": "crackers",
                "Ingr#": "1548274308266",
                "Vendor Info": "Arizona Vendors",
                "Size": "7lbs",
                "Cost": "2.31",
                "Comment": ""};
            Parser.preprocessOneIngredient(data).then(result => {
                    assert.fail("Should give error");
                }).catch(err => {done()});
        })
    })

    describe('preprocessOneIngredient', () => {
        it('preprocesses one ingredient whose number is in the db', (done) => {
            data = {
                "Name": "crackers1",
                "Ingr#": "1548274308267",
                "Vendor Info": "Arizona Vendors",
                "Size": "7lbs",
                "Cost": "2.31",
                "Comment": ""};
            Parser.preprocessOneIngredient(data).then(result => {
                expected_result = {
                    "Name": "crackers1",
                    "Ingr#": "1548274308267",
                    "Vendor Info": "Arizona Vendors",
                    "Size": "7lbs",
                    "Cost": "2.31",
                    "Comment": "",
                    "status": "Overwrite"};
                assert.equal(expected_result.Name, result.Name);
                assert.equal(expected_result.status, result.status);
                done();
            }).catch(done);
        })
    })

    describe('preprocessOneIngredient', () => {
        it('preprocesses one ingredient thats duplicate of db item', (done) => {
            data = {
                "Name": "crackers",
                "Ingr#": "1548274308267",
                "Vendor Info": "asdfd",
                "Size": "7lbs",
                "Cost": "2.31",
                "Comment": "crun chy"};
            Parser.preprocessOneIngredient(data).then(result => {
                expected_result = {
                    "Name": "crackers",
                    "Ingr#": "1548274308267",
                    "Vendor Info": "asdfd",
                    "Size": "7lbs",
                    "Cost": "2.31",
                    "Comment": "crun chy",
                    "status": "Ignore"};
                assert.equal(expected_result.Name, result.Name);
                assert.equal(expected_result.status, result.status);
                done();
            }).catch(done);
        })
    })

    describe('preprocessOneIngredient', () => {
        it('preprocesses one ingredient thats conflicting with db', (done) => {
            data = {
                "Name": "crackers",
                "Ingr#": "1548274337896",
                "Vendor Info": "asdfd",
                "Size": "7lbs",
                "Cost": "2.31",
                "Comment": "crun chy"};
            Parser.preprocessOneIngredient(data).then(result => {
                assert.fail("Should give error");
            }).catch(err => {done()});
        })
    })

    describe('preprocessOneSKU', () => {
        it('preprocesses one sku with valid product line name', (done) => {
            data = {
                "SKU#": "12345",
                "Name": "Tomato soup",
                "Case UPC": "005102218476",
                "Unit UPC": "164802618600",
                "Unit size": "28oz",
                "Count per case": "24",
                "Product Line Name": "Hello_Stored",
                "Comment": "asdfsdf"
            };
            Parser.checkOneSKU(data).then(result => {
                expected_result = {
                    "SKU#": "12345",
                    "Name": "Tomato soup",
                    "Case UPC": "005102218476",
                    "Unit UPC": "164802618600",
                    "Unit size": "28oz",
                    "Count per case": "24",
                    "Product Line Name": "Hello_Stored",
                    "Comment": "asdfsdf",
                    "pl_id": pl_id,
                    "status": "Store"
                };
                assert.equal(expected_result.Name, result.Name);
                assert.equal(expected_result.status, result.status);
                assert.equal(expected_result.pl_id.id.toString(), result.pl_id.id.toString());
                done();
            }).catch(done);
        })
    })

    describe('preprocessOneSKU', () => {
        it('preprocesses one sku with invalid product line name', (done) => {
            data = {
                "SKU#": "12345",
                "Name": "Tomato soup",
                "Case UPC": "005102218476",
                "Unit UPC": "164802618600",
                "Unit size": "28oz",
                "Count per case": "24",
                "Product Line Name": "Hello_Stored1",
                "Comment": "asdfsdf"
            };
            Parser.checkOneSKU(data).then(result => {
                assert.fail("Should give error");
            }).catch(err => {done()});
        })
    })

    describe('checkOneForumla', () => {
        it('preprocesses one formula thats valid', (done) => {
            data = {
                "SKU#": "8",
                "Ingr#": "1548274308267",
                "Quantity": "1.2"};
            Parser.checkOneForumla(data).then(result => {
                done();
            });
        })
    })

    describe('checkOneForumla', () => {
        it('preprocesses one formula with invalid sku number', (done) => {
            data = {
                "SKU#": "9",
                "Ingr#": "1548274308267",
                "Quantity": "1.2"};
            Parser.checkOneForumla(data).then(result => {
                assert.fail("Should give error");
            }).catch(err => {done()});
        })
    })

    describe('checkOneForumla', () => {
        it('preprocesses one formula with invalid ing number', (done) => {
            data = {
                "SKU#": "8",
                "Ingr#": "1548274308266",
                "Quantity": "1.2"};
            Parser.checkOneForumla(data).then(result => {
                assert.fail("Should give error");
            }).catch(err => {done()});
        })
    })
});
