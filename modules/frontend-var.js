'use strict';

exports.frontendVar = function(key) {
    fastredRequire('str', 'var');

    var
        vars = FRONTEND_VARS,
        result = vars[key]; 

    if (varIsStr(result)) {
        if (strEndsWith(result, 'px')) {
            result = parseInt(result);
        } else if (strEndsWith(result, 'rem')) {
            result = parseFloat(result) * frontendVar('root__font-size');
        } else if (strEndsWith(result, 's')) {
            result = parseFloat(result) * 1000;
        }
    }

    return result;
};