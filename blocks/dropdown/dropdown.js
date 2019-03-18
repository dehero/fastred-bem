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
        button: '.dropdown__button',
        hover: '.dropdown_hover'
    }

    require('dropdown/dropdown.css.styl');

    $(window).click(function () {
        that.hideAll();
    });

    this.init = function (component) {
        var $component = $(component).not(selectors.hover);

        $component.on('click', selectors.button, function(e) {
            e.stopPropagation();
            e.preventDefault();

            that.toggle(component);
        });

        $component.on('focusin', selectors.button, function(e) {
            e.stopPropagation();
            e.preventDefault();

            that.show(component);
        });
    }

    this.hide = function(component) {
        var $component = $(component).not(selectors.hover);

        $component.removeClass(classes.pressed);
    }

    this.hideAll = function() {
        $(that.selector).each(function() {
            that.hide(this);
        });
    }

    this.toggle = function(component) {
        var $component = $(component).not(selectors.hover);

        if ($component.hasClass(classes.pressed)) {
            that.hide();
        } else {            
            that.show();
        }
    }

    this.show = function(component) {
        var $component = $(component).not(selectors.hover);

        that.hideAll();
        $component.addClass(classes.pressed);
    }

    Component.register(this);
}

Dropdown.prototype = Component;

module.exports = new Dropdown();
