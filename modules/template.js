'use strict';

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

    if (render && typeof render === 'function') {
        vars.options = varIsHash(options) ? options : {};
        vars.attributes = templateAttrsToObj(attributes);

        return render(vars);
    } else {
        return name;
    }
};