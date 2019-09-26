var Component = require('component');

function Checkbox() {
    fastredRequire('template');
    
    this.template = 'checkbox';
    this.selector = '.checkbox';

    var that = this;
    var $ = require('jquery');

    this.selectors = {
        input: '.checkbox__input'
    }

    require('checkbox/checkbox.css.styl');
    template(this.template, require('checkbox/checkbox.pug'));

    this.init = function(component) {
        var $component = $(component);
        var $input = $component.find(that.selectors.input);

        $component.data({
           $input: $input
        });

        $component.keyup(function(e) {
            switch(e.keyCode) {
                // SPACE
                case 32: that.toggle(component); break;
            }
        })
    }

    this.toggle = function(component) {
        that.value(component, !that.value(component));
    }

    this.value = function(component, value) {
        var $input = $(component).data('$input');

        if (typeof value !== 'undefined') {
            $input.prop('checked', value);
        } else {
            return $input.prop('checked');
        }
    }

    Component.register(this);
}

Checkbox.prototype = Component;

module.exports = new Checkbox();
