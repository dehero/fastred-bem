'use strict';

window.template = function(name, template) {
    if (typeof(window._template) === 'undefined') {
        window._template = [];
    }

    if (typeof template === 'function') {
        window._template[name] = template;
    }

    return window._template[name];
};

window.templateAttrsToObj = function(attributes) {
    fastredRequire('var');

    return varIsStr(attributes)
        ? {'class': attributes}
        : (varIsHash(attributes) ? attributes : {});
}

window.templateToHtml = function(name, options, attributes) {
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