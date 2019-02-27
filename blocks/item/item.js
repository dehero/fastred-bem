var Component = require('component');
var json = require('item/item.json');

function loadTypes() {
    var result = {};

    for (var key in json) {
        var arr = json[key];
        if (varIsArr(arr)) {
            for (var i = 0; i < arr.length; i++) {
                result[arr[i]] = 'item_type_' + arr[i];
            }
        }
    }

    return result;
}

function Item() {
    this.template = 'item';
    this.selector = '.item';
    this.classSelected = 'item_selected';

    this.classes = {
        types: loadTypes()
    };

    this.events = {
        beforeSelectedChange:   'beforeSelectedChange',
        selectedChange:         'selectedChange'
    };

    var that = this;
    var $ = require('jquery');
    require('mark.js/dist/jquery.mark.js');

    require('item/item.css.styl');
    template(this.template, require('item/item.pug'));
    template('item__content', require('item/item__content.pug'));

    this.delete = function(components) {
        components = varIsArr(components) ? components : [components];

        $(components).remove();
    };

    this.canOpen = function(component) {
        return typeof that.value(component) !== 'undefined';
    };

    this.open = function(component) {

    };

    this.search = function(component, value) {
        var $component = $(component);        

        $component.unmark();
        if (value) {
            $component.mark(String(value), {
                wildcards: 'withSpaces',
                done: function(count) {
                    $component.toggle(count > 0);    
                }
            });
        } else {
            $component.toggle(true);
        }
    };

    this.selectedToggle = function(component) {
        this.selected(component, !this.selected(component));
    };

    this.selected = function(component, value, noEvent) {
        var $component = $(component);
        var oldValue = $component.hasClass(this.classSelected);

        if (typeof value !== 'undefined') {
            if (value !== oldValue) {
                if (!noEvent) $component.trigger(that.events.beforeSelectedChange);
                $component.toggleClass(this.classSelected, value);
                if (!noEvent) $component.trigger(that.events.selectedChange);
            }
        } else {
            return oldValue;
        }
    };

    this.type = function(component, value) {
        var $component = $(component);
        var oldValue = json.item__type_default;

        for (var key in this.classes.types) {
            if ($component.hasClass(this.classes.types[key])) {
                oldValue = key;
                break;
            }
        }

        if (typeof value !== 'undefined') {
            if (value !== oldValue) {
                for (var key in this.classes.types) {
                    $component.toggleClass(this.classes.types[key], key == value);
                }
            }
        } else {
            return oldValue;
        }
    };

    this.value = function(component) {
        var $component = $(component);
        var result = $component.data('value');

        if (typeof result === 'undefined') {
            result = $component.index();
        }

        return result;
    };

    Component.register(this);
}

Item.prototype = Component;

module.exports = new Item();
