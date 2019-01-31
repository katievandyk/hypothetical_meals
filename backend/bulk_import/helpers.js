
module.exports.isNumeric = function(n){
    return !isNaN(parseFloat(n)) && isFinite(n);
}

module.exports.isPositiveInteger = function(str) {
    let regex = /^[0-9]+$/;
    return regex.test(str) && Number(str) > 0;
}

module.exports.is_upca_standard = function(code_str) {
    if(code_str.length != 12) {
        console.log(code_str.length);
        return false;
    }
    let code = parseInt(code_str);
    var i;
    var sum = 0;
    var code_temp = code;
    code /= 10;
    for(i = 1; i < 12; i++) {
        var digit = Math.floor(code % 10);
        if (i == 11 && !(digit == 0 | digit == 1 | digit >= 6 && digit <= 9)) {
            return false;
        }
            
        code /= 10;
        sum += i%2 == 0 ? digit : digit*3;
    }

    var check_digit = (10-sum%10)%10;
    if(check_digit != code_temp % 10) {
        return false;
    }

    return true;
};

module.exports.checkFileHeaders = function(actual_header, expected_header) {
    var is_same = (actual_header.length == expected_header.length) && actual_header.every(function(element, index) {
        return element === expected_header[index]; 
    });
    if(!is_same) throw new Error(
        `File header doesn't match expected header. Actual: ${actual_header}; Expected: ${expected_header}`);
}
