var Component = require('component');

function Dropdown() {
    this.template = 'dropdown';
    this.selector = '.dropdown';

    var Dropdown = this;
    var $ = require('jquery');
    var classes = {
        pressed: 'dropdown_pressed'
    };
    var selectors = {
        button: '.dropdown__button',
        hover: '.dropdown_hover',
        menu: '.dropdown__menu'
    }

    require('dropdown/dropdown.css.styl');

    $(window).click(function () {
        Dropdown.hideAll();
    });

    this.init = function (component) {
        var $component = $(component);

        $component.on('click', selectors.menu, function(e) {
            e.stopPropagation();
        });

        $component.on('click', selectors.button, function(e) {
            e.stopPropagation();
            e.preventDefault();
        });

        $component.on('focusin', selectors.button, function(e) {
            e.stopPropagation();
            e.preventDefault();

            Dropdown.toggle(component);
        });
    }

    this.hide = function(component) {
        var $component = $(component);
        $component.removeClass(classes.pressed);
    }

    this.hideAll = function() {
        $(Dropdown.selector).each(function() {
            Dropdown.hide(this);
        });
    }

    this.toggle = function(component) {
        var $component = $(component);             

        if ($component.hasClass(classes.pressed)) {
            Dropdown.hide(component);
        } else {            
            Dropdown.show(component);
        }
    }

    this.show = function(component) {
        var $component = $(component);

        Dropdown.hideAll();
        $component.addClass(classes.pressed);
    }

    Component.register(this);
}

Dropdown.prototype = Component;

module.exports = new Dropdown();