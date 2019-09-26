var Component = require('component');

function ButtonGroup() {
    fastredRequire('template');
    
    this.template = 'button-group';
    this.selector = '.button-group';

    var that = this;
    var $ = require('jquery');
    var Button = require('button');
    var selectors = {
        item: '.button-group__item'
    }

    require('button-group/button-group.css.styl');
    template(this.template, require('button-group/button-group.pug'));

    this.value = function(component, value) {
        var $component = $(component);
        var $items = $component.children(selectors.item);

        if (typeof value !== 'undefined') {
            $items.each(function() {
                if (Button.value(this) == value) {
                    Button.checked(this, true);
                    return false;
                }
            });
        } else {
            var result;

            $items.each(function() {
                if (Button.checked(this)) {
                    result = Button.value(this);
                    return false;
                }
            });

            return result;
        }
    }

    Component.register(this);
}

ButtonGroup.prototype = Component;

module.exports = new ButtonGroup();