var Component = require('component');

function ListView() {
    fastredRequire('arr', 'template', 'var');

    this.template = 'listview';
    this.selector = '.listview';

    var ListView = this;
    var $ = require('jquery');
    var selectors = {
        content:        '.listview__content',
        header:         '.listview__header'
    };
    this.events = {
        selectionChange: 'item-select.listview',
        itemOpen:        'item-open.listview',
        modeChange:      'mode-change.listview'        
    };

    var dataKeys = {
        itemTemplate:   'item-template',
        modeLocked:     'mode-locked',
        mode:           'mode',
        multiselect:    'multiselect',
        search:         'search',
        tapholdItem:    'taphold-item',
        type:           'type'
    }; 

    var classes = {
        loading:    'listview_loading'
    };        

    require('spinner');
    require('jquery-touch-events')($);
    require('item');
    require('listview/listview.css.styl');
    template(this.template, require('listview/listview.pug'));

    this.add = function(component, items) {
        ListView.insert(component, items, ListView.count(component));   
        ListView.research(component);    
    };

    this.canOpenSelection = function(component) {
        var $component = $(component);
        var ItemComponent = $component.data('ItemComponent');        
        var items = ListView.getSelectedItems($component);

        return ItemComponent.canOpen(items.length == 1 ? items[0] : items);
    };

    this.clear = function(component) {
        var $component = $(component);
        var $content = $component.data('$content');

        $content.empty();
    };

    this.deleteSelection = function(component) {
        var $component = $(component);
        var ItemComponent = $component.data('ItemComponent');        
        var items = ListView.getSelectedItems($component);

        ItemComponent.delete(items);
    };

    this.getSelectedItems = function(component) {
        var $component = $(component);
        var ItemComponent = $component.data('ItemComponent');
        var $content = $component.data('$content');

        var items = [];

        $content.children().each(function() {
            if (ItemComponent.selected(this)) {
                items.push(this);
            }
        });  
        
        return items;
    }    

    this.insert = function(component, item, position) {
        var $component = $(component);
        var $content = $component.data('$content');
        var ItemComponent = $component.data('ItemComponent');

        var items = varIsArr(item) ? item : [item];
        position = position || 0;
        var components = [];

        for(var i = 0; i < items.length; i++) {
            components.push(ItemComponent.create({data: items[i], type: ListView.type(component)}));
        }

        if(position <= 0) {
            $(components).prependTo($content);
        } else {
            var $previous = $content.children().eq(position - 1);
            $(components).insertAfter($previous);
        }
    };

    this.clearSelection = function(component, noEvent) {
        ListView.selection(component, [], noEvent);
    };

    this.count = function(component) {
        return $(component).data('$content').children().length;
    };

    this.init = function(component) {
        var $component = $(component);
        var $content = $component.find(selectors.content);
        var $header = $component.find(selectors.header);
        var ItemComponent = Component.findRegistered($component.data(dataKeys.itemTemplate) || 'item');

        $component.data('$content', $content);
        $component.data('$header', $header);
        $component.data('ItemComponent', ItemComponent);
        ListView.research($component);

        $component.keyup(function(e) {
            switch(e.keyCode) {
                // DEL
                case 46:
                    ListView.deleteSelection(component);
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

            if (ListView.mode(component) === 'select') {
                if (ListView.multiselect(component)) {
                    ItemComponent.selectedToggle(this);
                } else {
                    ItemComponent.selected(this, true);
                }
            } else {
                ItemComponent.open(this);
            }
        });

        $content.on('taphold', ItemComponent.selector, function(e) {
            e.preventDefault();

            $content.data(dataKeys.tapholdItem, this);
            $(this).one('mouseout', function(e) {
                $content.removeData(dataKeys.tapholdItem);
            });

            if (ListView.mode(component) === 'browse' && !ListView.modeLocked(component)) {
                ListView.mode(component, 'select');
                if (ListView.multiselect(component)) {
                    ItemComponent.selectedToggle(this);
                } else {
                    ItemComponent.selected(this, true);
                }
            } else {
                ItemComponent.open(this);
            }
        });

        $content.on(ItemComponent.events.beforeSelectedChange, ItemComponent.selector, function(e) {
            if (!ListView.multiselect(component)) {
                ListView.clearSelection(component, true);
            }
        });

        $content.on(ItemComponent.events.selectedChange, ItemComponent.selector, function(e) {
            $component.trigger(ListView.events.selectionChange);
        });

        $header.on(ItemComponent.events.sort, ItemComponent.selector, function(e, data) {

        });
    };

    this.loading = function(component, value) {
        var $component = $(component);

        if (typeof value !== 'undefined') {
            $component.toggleClass(classes.loading);
        } else {
            return $component.hasClass(classes.loading);
        }
    }; 

    this.modeLocked = function(component) {
        return typeof $(component).attr('data-' + dataKeys.modeLocked) !== 'undefined';
    };

    this.multiselect = function(component) {
        return typeof $(component).attr('data-' + dataKeys.multiselect) !== 'undefined';
    };

    this.mode = function(component, value) {
        var $component = $(component);
        var currentMode = $component.data(dataKeys.mode) || 'browse';

        if (typeof value !== 'undefined') {
            value = arrGetFound(['browse', 'select'], value, 'browse');

            if (value !== currentMode) {
                ListView.clearSelection(component);
                $(component).data(dataKeys.mode, value);

                $component.trigger(ListView.events.modeChange);                
            }

            return value;
        } else {
            return currentMode;
        }
    };

    this.openSelection = function(component) {
        var $component = $(component);
        var ItemComponent = $component.data('ItemComponent');        
        var items = ListView.getSelectedItems($component);

        ItemComponent.open(items.length == 1 ? items[0] : items);
    };

    this.research = function(component) {
        var $component = $(component);
        var ItemComponent = $component.data('ItemComponent');
        var $content = $component.data('$content');
        var oldValue = ListView.search($component);

        $content.children().each(function() {
            ItemComponent.search(this, oldValue);
        });
    };

    this.search = function(component, value) {
        var $component = $(component);
        var oldValue = $component.data(dataKeys.search);

        if (typeof value !== 'undefined') {    
            if (oldValue !== value) {
                $component.data(dataKeys.search, value);
                ListView.research(component);
            }            
        } else {
            return oldValue;
        }
    };

    this.selection = function(component, value, noEvent) {
        var $component = $(component);
        var ItemComponent = $component.data('ItemComponent');
        var $content = $component.data('$content');

        if (typeof value !== 'undefined') {
            $content.children().each(function () {
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

    this.sort = function(component, column) {
        var $component = $(component);
        var ItemComponent = $component.data('ItemComponent');
        var $content = $component.data('$content');

        $content.find(ItemComponent.selector).sort(function(item1, item2) {
            // return a.dataset.sid > b.dataset.sid;
            console.log(item1, item2); 
       }).appendTo($content);
    };

    this.type = function(component, value) {
        var $component = $(component);
        var oldValue = $component.data(dataKeys.type);

        if (typeof value !== 'undefined') {
            var ItemComponent = $component.data('ItemComponent');
            var $content = $component.data('$content');
            var $header = $component.data('$header');

            if (oldValue !== value) {
                $content.children().each(function() {
                    ItemComponent.type(this, value);
                });
                $header.children().each(function() {
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

ListView.prototype = Component;

module.exports = new ListView();
