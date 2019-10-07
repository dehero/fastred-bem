'use strict';

var global = typeof global !== 'undefined' 
? global 
: typeof window !== 'undefined'
    ? window
    : {};

global.__FASTRED_BEM_TEMPLATE_RENDERING = 0;

exports.template = function(name, template) {
    if (typeof(exports._template) === 'undefined') {
        exports._template = [];
    }

    if (typeof template === 'function') {
        exports._template[name] = template;
    }

    return exports._template[name];
};

exports.templateAttrsToObj = function(attributes) {
    fastredRequire('var');

    return varIsStr(attributes)
        ? {'class': attributes}
        : (varIsHash(attributes) ? attributes : {});
}

exports.templateToHtml = function(name, options, attributes) {
    fastredRequire('var');
      
    var render = template(name);
    var vars = {};
    var result;

    global.__FASTRED_BEM_TEMPLATE_RENDERING++;    

    if (render && typeof render === 'function') {
        vars.options = varIsHash(options) ? options : {};
        vars.attributes = templateAttrsToObj(attributes);
        
        // Webpack's pug-loader wraps template code by anonimous function with all local variables and function names passed as parameter
        // But fastred modules are exported to global scope and if they were not required earlier, these modules will be overriden by the function's local scope
        // This little hack will keep rendering a template until all modules will be loaded with fastredRequire inside a template
        while (true) {
            try {
                result = render(vars);
                break;
            } catch (e) {
                if (e !== 'fastredBemRerender') {
                    result = name;
                    break;
                }
            }
        }
    } else {
        result = name;
    }

    global.__FASTRED_BEM_TEMPLATE_RENDERING--;
    
    return result;    
};