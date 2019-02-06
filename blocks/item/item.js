var Component = require('component');

function Item() {
    this.template = 'item';
    this.selector = '.item';
    this.classSelected = 'item_selected';

    this.classes = {
        types: {
            table:  'item_type_table',
            list:   'item_type_list',
            grid:   'item_type_grid'
        }
    };

    this.events = {
        beforeSelectedChange:   'beforeSelectedChange',
        selectedChange:         'selectedChange'
    };

    var that = this;
    var $ = require('jquery');

    require('item/item.css.styl');
    template(this.template, require('item/item.pug'));
    template('item__content', require('item/item__content.pug'));

    this.delete = function(components) {
        components = varIsArr(components) ? components : [components];

        $(components).remove();
    };

    this.open = function(component) {

    };

    this.search = function(component, value) {
        var $component = $(component);
        
        $component.toggle($component.text().indexOf(value) > -1);
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
        var oldValue = 'list';

        for (var key in this.classes.types) {
            if ($component.hasClass(this.classes.types[key])) {
                oldValue = key;
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
