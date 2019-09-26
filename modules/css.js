'use strict';

exports.cssBemClassArr = function() {
    fastredRequire('str');

    var obj = cssClassObj.apply(this, arguments);
    var result = [];

    for(var key in obj) {
        var value = obj[key];
        if (value) {
            if (strEndsWith(key, '_')) {
                key = key + value;
            }
            result.push(key);
        }
    }

    return result;
};