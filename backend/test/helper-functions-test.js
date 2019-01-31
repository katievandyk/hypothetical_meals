const assert = require('assert');
const Helpers = require("../bulk_import/helpers");

describe('positive number checks', function() {
    describe('isPositiveInteger()', function() {
        it('should return false when value is negative', function() {
        assert.equal(Helpers.isPositiveInteger("-1"), false);
        });
    });
    describe('isPositiveInteger()', function() {
        it('should return true when value is positive integer', function() {
        assert.equal(Helpers.isPositiveInteger("100247589432384"), true);
        });
    });
    describe('isPositiveInteger()', function() {
        it('should return false when value is positive decimal', function() {
        assert.equal(Helpers.isPositiveInteger("1002475894323.84"), false);
        });
    });
    describe('isPositiveInteger()', function() {
        it('should return false when value is not a number', function() {
        assert.equal(Helpers.isPositiveInteger("1002475894323b84"), false);
        });
    });
    describe('isPositiveInteger()', function() {
        it('should return true when value is not a number', function() {
        assert.equal(Helpers.isPositiveInteger("005102218476"), true);
        });
    });
});

describe('number checks', function() {
    describe('isNumeric()', function() {
        it('should return false when value is not a number', function() {
        assert.equal(Helpers.isNumeric("12323534b.0"), false);
        });
    });
    describe('isNumeric()', function() {
        it('should return true when value is a number', function() {
        assert.equal(Helpers.isNumeric("1232353.02"), true);
        });
    });
    describe('isNumeric()', function() {
        it('should return true when value is a number', function() {
        assert.equal(Helpers.isNumeric("-1232353.02"), true);
        });
    });
});

describe('UPCA-compliance', function() {
    describe('is_upca_standard()', function() {
        it('should return false when check digit is not correct', function() {
        assert.equal(Helpers.is_upca_standard("005102218475"), false);
        });
    });
    describe('is_upca_standard()', function() {
        it('should return true when check digit is correct', function() {
        assert.equal(Helpers.is_upca_standard("005102218476"), true);
        });
    });
    describe('is_upca_standard()', function() {
        it('should return false when first digit is 3', function() {
        assert.equal(Helpers.is_upca_standard("305102218477"), false);
        });
    });
    describe('is_upca_standard()', function() {
        it('should return true when first digit is 9', function() {
        assert.equal(Helpers.is_upca_standard("905102218479"), true);
        });
    });
    describe('is_upca_standard()', function() {
        it('should return true when first digit is 8', function() {
        assert.equal(Helpers.is_upca_standard("805102218472"), true);
        });
    });
    describe('is_upca_standard()', function() {
        it('should return true when first digit is 7', function() {
        assert.equal(Helpers.is_upca_standard("705123418472"), true);
        });
    });
    describe('is_upca_standard()', function() {
        it('should return true when first digit is 6', function() {
        assert.equal(Helpers.is_upca_standard("611111111105"), true);
        });
    });
    describe('is_upca_standard()', function() {
        it('should return false when check digit is wrong', function() {
        assert.equal(Helpers.is_upca_standard("611111111102"), false);
        });
    });
});