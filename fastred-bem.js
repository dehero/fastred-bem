'use strict';

require('fastred');

var global = typeof global !== 'undefined' 
    ? global 
    : typeof window !== 'undefined'
        ? window
        : {};

var _fastredRequire = global.fastredRequire;

global.fastredRequire = function(arg1) {
    var required = _fastredRequire.apply(this, arguments);

    if (required && global.__FASTRED_BEM_TEMPLATE_RENDERING) {
        throw 'fastredBemRerender';
    }

    return required;
};

fastredLibrary(require.context('./modules', false, /\.js$/));