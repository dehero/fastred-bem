var Component = require('component'); 

function Button() { 
    this.template = 'button';
    this.selector = '.button';

    var that = this;
    var $ = require('jquery');
    var classes = {
        disabled: 'button_disabled'
    };
    var selectors = {
        input: '.button__input'
    }

    require('font-icon');
    require('button/button.css.styl');
    template(this.template, require('button/button.pug'));
    template('button__content', require('button/button__content.pug'));

    this.disabled = function(component, value) {
        var $component = $(component);

        if (typeof value !== 'undefined') {
            $component.toggleClass(classes.disabled, value);
            $component.attr('disabled', value);
        } else {
            return $component.hasClass(classes.disabled);
        }
    };

    this.init = function(component) {
        var $component = $(component);
        var $input = $component.prev(selectors.input);

        $component.data({
            $input: $input
        });

        $component.on('mouseup', function(e) {
            $component.blur();
        });

        $input.change(function(e) {
            e.stopPropagation();
            $component.trigger('change');
        })
    };

    this.toggle = function(component) {
        $(component).data('$input').toggle();
    };

    this.checked = function(component, value) {
        var $input = $(component).data('$input');

        if (typeof value !== 'undefined') {
            $input.prop('checked', value);
        } else {
            return $input.prop('checked');
        }
    };

    this.value = function(component, value) {
        var $input = $(component).data('$input');

        if (typeof value !== 'undefined') {
            $input.val(value);
        } else {
            return $input.val();
        }
    };

    Component.register(this);
}

Button.prototype = Component;

module.exports = new Button();