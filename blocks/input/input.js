var Component = require('component');

function Input() {
    fastredRequire('template');
    
    this.template = 'input';
    this.selector = '.input';

    var $ = require('jquery');

    require('input/input.css.styl');
    template(this.template, require('input/input.pug'))

    this.value = function(component, value) {

        if (typeof value !== 'undefined') {
            $(component).val(value);
        } else {
            return $(component).val();
        }
    }

    Component.register(this);
}

Input.prototype = Component;

module.exports = new Input();