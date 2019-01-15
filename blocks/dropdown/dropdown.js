var Component = require('component');

function Dropdown() {
    this.template = 'dropdown';
    this.selector = '.dropdown';

    var that = this;
    var $ = require('jquery');
    var classes = {
        pressed: 'dropdown_pressed'
    };
    var selectors = {
        hover: '.dropdown_hover'
    }

    require('dropdown/dropdown.css.styl');

    $(window).click(function () {
        $(that.selector).each(function() {
            that.hide(this);
        });
    });

    this.init = function (component) {
        var $component = $(component).not(selectors.hover);

        $component.click(function(e) {
            e.stopPropagation();
            e.preventDefault();

            that.toggle(component);
        });
    }

    this.hide = function(component) {
        var $component = $(component).not(selectors.hover);

        $component.removeClass(classes.pressed);
    }

    this.toggle = function(component) {
        var $component = $(component).not(selectors.hover);

        $component.toggleClass(classes.pressed);
    }

    Component.register(this);
}

Dropdown.prototype = Component;

module.exports = new Dropdown();