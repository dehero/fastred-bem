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
        header: 'item_header',
        types: loadTypes()
    };

    this.events = {
        beforeSelectedChange:   'beforeSelectedChange',
        expandedChange:         'expandedChange',
        selectedChange:         'selectedChange',
        sort:                   'sort'
    };

    var selectors = {
        offset: '.item__offset'
    }    

    var Item = this;
    var $ = require('jquery');
    var Button = require('button');

    require('mark.js/dist/jquery.mark.js');

    require('item/item.css.styl');
    template(this.template, require('item/item.pug'));
    template('item__content', require('item/item__content.pug'));

    this.delete = function(components) {
        components = varIsArr(components) ? components : [components];

        $(components).remove();
    };

    this.canOpen = function(component) {
        return typeof Item.value(component) !== 'undefined';
    };

    this.init = function(component) {
        var $component = $(component);
        var $offset = $component.find(selectors.offset);

        $offset.on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            Item.expanded($component, !Item.expanded($component));
        });
    }

    this.expanded = function(component, value) {
        var $component = $(component);
        var $offset = $component.find(selectors.offset);
        var oldValue = Button.caret($offset) === 'arrow-down';
        
        if (typeof value !== 'undefined') {
            if (oldValue !== value) {
                if (value) {
                    Button.caret($offset, 'arrow-down');
                } else {
                    Button.caret($offset, 'arrow-right');
                }
                $component.trigger(Item.events.expandedChange);
            }
        } else {
            return oldValue;
        }        
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
                if (!noEvent) $component.trigger(Item.events.beforeSelectedChange);
                $component.toggleClass(this.classSelected, value);
                if (!noEvent) $component.trigger(Item.events.selectedChange);
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
