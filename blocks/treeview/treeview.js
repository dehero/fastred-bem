var Component = require('component');

function Treeview() {
    this.template = 'treeview';
    this.selector = '.treeview';

    var that = this;
    var $ = window.jQuery = require('jquery');
    var selectors = {
        content:        '.treeview__content'
    };
    this.events = {
        selectionChange: 'item-select.treeview',
        itemOpen:        'item-open.treeview'
    };

    var dataKeys = {
        itemTemplate:   'item-template',
        modeLocked:     'mode-locked',
        mode:           'mode',
        tapholdItem:    'taphold-item',
        type:           'type'
    };

    require('jquery-taphold');
    require('item');
    require('treeview/treeview.css.styl');
    template(this.template, require('treeview/treeview.pug'));

    this.add = function(component, items) {
        that.insert(component, items, that.count(component));
    };

    this.clear = function(component) {
        var $component = $(component);
        var $content = $component.data('$content');

        $content.empty();
    };

    this.deleteSelection = function(component) {
        var $component = $(component);
        var ItemComponent = $component.data('ItemComponent');
        var $content = $component.data('$content');

        var items = [];

        $content.children().each(function() {
            if (ItemComponent.selected(this)) {
                items.push(this);
            }
        });

        ItemComponent.delete(items);
    };

    this.insert = function(component, item, position) {
        var $component = $(component);
        var $content = $component.data('$content');
        var ItemComponent = $component.data('ItemComponent');

        var items = varIsArr(item) ? item : [item];
        position = position || 0;
        var components = [];

        for(var i = 0; i < items.length; i++) {
            components.push(ItemComponent.create({data: items[i], type: that.type(component)}));
        }

        if(position <= 0) {
            $(components).prependTo($content);
        } else {
            var $previous = $content.children().eq(position - 1);
            $(components).insertAfter($previous);
        }
    };

    this.clearSelection = function(component, noEvent) {
        that.selection(component, [], noEvent);
    };

    this.count = function(component) {
        return $(component).data('$content').children().length;
    };

    this.init = function(component) {
        var $component = $(component);
        var $content = $component.find(selectors.content);
        var ItemComponent = Component.findRegistered($component.data(dataKeys.itemTemplate) || 'item');

        $component.data('$content', $content);
        $component.data('ItemComponent', ItemComponent);

        $component.keyup(function(e) {
            switch(e.keyCode) {
                // DEL
                case 46:
                    that.deleteSelection(component);
                    break;
            }
        });

        $content.on('click', ItemComponent.selector, function(e) {
            e.preventDefault();

            // Prevent click event right after taphold
            if ($content.data(dataKeys.tapholdItem) === this) {
                $content.removeData(dataKeys.tapholdItem);
                return;
            }

            if (that.mode(component) === 'select' && !ItemComponent.selected(this)) {
                ItemComponent.selected(this, true);
            } else {
                var $group = $(this).next();
                if ($group.is(':visible')) {
                    $group.slideUp();
                } else {
                    $group.slideDown();
                }
                //.toggle();
                //ItemComponent.open(this);
            }
        });

        $content.on('taphold', ItemComponent.selector, function(e) {
            e.preventDefault();

            $content.data(dataKeys.tapholdItem, this);
            $(this).one('mouseout', function(e) {
                $content.removeData(dataKeys.tapholdItem);
            });

            if (that.mode(component) === 'browse' && !that.modeLocked(component)) {
                that.mode(component, 'select');
                ItemComponent.selected(this, true);
            } else {
                ItemComponent.open(this);
            }
        });

        $content.on(ItemComponent.events.beforeSelectedChange, ItemComponent.selector, function(e) {
            that.clearSelection(component, true);
        });

        $content.on(ItemComponent.events.selectedChange, ItemComponent.selector, function(e) {
            $component.trigger(that.events.selectionChange);
        });
    };

    this.modeLocked = function(component) {
        return typeof $(component).attr('data-' + dataKeys.modeLocked) !== 'undefined';
    };

    this.type = function(component) {
        return arrGetFound(['list', 'grid', 'table'], $(component).data(dataKeys.type), 'list');
    };

    this.mode = function(component, value) {
        var $component = $(component);
        var currentMode = $component.data(dataKeys.mode) || 'browse';

        if (typeof value !== 'undefined') {
            value = arrGetFound(['browse', 'select'], value, 'browse');

            if (value !== currentMode) {
                that.clearSelection(component);
                $(component).data(dataKeys.mode, value);
            }

            return value;
        } else {
            return currentMode;
        }
    };

    this.openSelection = function(component) {
        var $component = $(component);
        var ItemComponent = $component.data('ItemComponent');
        var $content = $component.data('$content');

        var items = [];

        $content.children().each(function() {
            if (ItemComponent.selected(this)) {
                items.push(this);
            }
        });

        ItemComponent.open(items.length == 1 ? items[0] : items);
    };

    this.selection = function(component, value, noEvent) {
        var $component = $(component);
        var ItemComponent = $component.data('ItemComponent');
        var $content = $component.data('$content');

        if (typeof value !== 'undefined') {
            $content.find(ItemComponent.selector).each(function () {
                ItemComponent.selected(this, arrIncludes(value, ItemComponent.value(this)), noEvent);
            });
        } else {
            var result = [];

            $content.children().each(function () {
                if (ItemComponent.selected(this)) {
                    result.push(ItemComponent.value(this));
                }
            });

            return result;
        }
    };

    this.type = function(component, value) {
        var $component = $(component);
        var oldValue = $component.data(dataKeys.type);


        if (typeof value !== 'undefined') {
            var ItemComponent = $component.data('ItemComponent');
            var $content = $component.data('$content');

            if (oldValue !== value) {
                $content.children().each(function() {
                    ItemComponent.type(this, value);
                });
                $component.data(dataKeys.type, value);
            }
        } else {
            return oldValue;
        }
    };

    Component.register(this);
}

Treeview.prototype = Component;

module.exports = new Treeview();