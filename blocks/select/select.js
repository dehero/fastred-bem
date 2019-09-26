var Input = require('input');

function Select() {
    fastredRequire('template');
    
    this.template = 'select';
    this.selector = '.select';

    var that = this;
    var $ = require('jquery');
    this.events = {
        change: 'change.select'
    };
    var selectors = {
        control: '.select__control'
    };
    var dataKeys = {
        $control: '$control'
    }
    var classes = {
        empty: 'select_empty' 
    }

    require('font-icon');
    require('select/select.css.styl');
    template(this.template, require('select/select.pug'));
    template('select__item', require('select/select__item.pug'));

    this.add = function(component, items) {
        that.insert(component, items, that.count(component));
    }
    
    this.clear = function(component) {
        var $control = $(component).data(dataKeys.$control);

        $control.empty();
    }

    this.count = function(component) {
        var $control = $(component).data(dataKeys.$control);

        return $control.children().length;
    }

    this.disabled = function(component, value) {
        var $control = $(component).data(dataKeys.$control);

        return Input.disabled($control, value);
    }

    this.init = function(component) {
        var $component = $(component);
        var $control = $component.find(selectors.control);

        $component.data(dataKeys.$control, $control);

        $control.change(function(e) {
            $component.toggleClass(classes.empty, Input.value($control) == '');
            $component.trigger(that.events.change);
        });
    }

    this.insert = function(component, item, position) {
        var $component = $(component);
        var $control = $component.data(dataKeys.$control);

        var items = varIsArr(item) ? item : [item];
        var position = position || 0;
        var components = [];

        for(var i = 0; i < items.length; i++) {
            components.push($(templateToHtml('select__item', {data: items[i]})).get(0));
        }

        if(position <= 0) {
            $(components).prependTo($control);
        } else {
            var $previous = $control.children().eq(position - 1);
            $(components).insertAfter($previous);
        }
    }

    this.value = function(component, value) {
        var $control = $(component).data(dataKeys.$control);

        if (typeof value !== 'undefined') {
            $control.val(value);

            if ($control.prop('selectedIndex') < 0) {
                $control.prop('selectedIndex', 0);
            };
        } else {
            return $control.val();
        }        
    }

    Input.register(this);
}

Select.prototype = Input;

module.exports = new Select();