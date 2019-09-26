var Component = require('component');

function TreeviewItem() {
    this.template = 'treeview__item';
    this.selector = '.treeview__item';

    var TreeviewItem = this;    

    template(TreeviewItem.template, require('treeview/treeview__item.pug'));    

    Component.register(TreeviewItem);
}

function Treeview() {
    fastredRequire('arr', 'template');

    this.template = 'treeview';
    this.selector = '.treeview';

    var Treeview = this;
    var $ = window.jQuery = require('jquery');
    var selectors = {
        content:        '.treeview__content'
    };
    this.events = {
        selectionChange: 'item-select.treeview',
        itemOpen:        'item-open.treeview'
    };

    var classes = {
        itemExpanded: 'treeview__item_expanded'
    }
    var dataKeys = {
        itemTemplate:   'item-template',
        modeLocked:     'mode-locked',
        mode:           'mode',
        tapholdItem:    'taphold-item',
        type:           'type' 
    };

    require('jquery-touch-events')($);
    require('item');
    require('treeview/treeview.css.styl');
    template(this.template, require('treeview/treeview.pug'));

    this.add = function(component, items) {
        Treeview.insert(component, items, Treeview.count(component));
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

        var items = varIsArr(item) ? item : [item];
        position = position || 0;
        var components = [];

        for(var i = 0; i < items.length; i++) {
            components.push(new TreeviewItem().create({data: items[i], type: Treeview.type(component), depth: 1, itemTemplate: $component.data(dataKeys.itemTemplate)}));
        }

        if(position <= 0) {
            $(components).prependTo($content);
        } else {
            var $previous = $content.children().eq(position - 1);
            $(components).insertAfter($previous);
        }
    };

    this.clearSelection = function(component, noEvent) {
        Treeview.selection(component, [], noEvent);
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
                    Treeview.deleteSelection(component);
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

            if (Treeview.mode(component) === 'select' && !ItemComponent.selected(this)) {
                ItemComponent.selected(this, true);
            }
        });

        $content.on(ItemComponent.events.expandedChange, ItemComponent.selector, function(e) {
            var $item = $(this).parent();

            if (ItemComponent.expanded(this)) {
                $item.addClass(classes.itemExpanded);
            } else {
                $item.removeClass(classes.itemExpanded);
            }
        });

        $content.on('taphold', ItemComponent.selector, function(e) {
            e.preventDefault();

            $content.data(dataKeys.tapholdItem, this);
            $(this).one('mouseout', function(e) {
                $content.removeData(dataKeys.tapholdItem);
            });

            if (Treeview.mode(component) === 'browse' && !Treeview.modeLocked(component)) {
                Treeview.mode(component, 'select');
                ItemComponent.selected(this, true);
            } else {
                ItemComponent.open(this);
            }
        });

        $content.on(ItemComponent.events.beforeSelectedChange, ItemComponent.selector, function(e) {
            Treeview.clearSelection(component, true);
        });

        $content.on(ItemComponent.events.selectedChange, ItemComponent.selector, function(e) {
            $component.trigger(Treeview.events.selectionChange);
        });
    };

    this.modeLocked = function(component) {
        return typeof $(component).attr('data-' + dataKeys.modeLocked) !== 'undefined';
    };

    this.mode = function(component, value) {
        var $component = $(component);
        var currentMode = $component.data(dataKeys.mode) || 'browse';

        if (typeof value !== 'undefined') {
            value = arrGetFound(['browse', 'select'], value, 'browse');

            if (value !== currentMode) {
                Treeview.clearSelection(component);
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

            $content.find(ItemComponent.selector).each(function () {
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

    Component.register(Treeview);
}

Treeview.prototype = Component;
TreeviewItem.prototype = Component;

module.exports = new Treeview();