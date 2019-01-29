var Input = require('input');

function Select() {
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

    require('font-icon');
    require('select/select.css.styl');
    template(this.template, require('select/select.pug'));
    template('select__item', require('select/select__item.pug'));

    this.add = function(component, items) {
        that.insert(component, items, that.count(component));
    }

    this.init = function(component) {
        var $component = $(component);
        var $control = $component.find(selectors.control);

        $component.data(dataKeys.$control, $control);

        $control.change(function(e) {
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

    this.clear = function(component) {
        var $control = $(component).data(dataKeys.$control);

        $control.empty();
    }

    this.count = function(component) {
        var $control = $(component).data(dataKeys.$control);

        return $control.children().length;
    }

    Input.register(this);
}

Select.prototype = Input;

module.exports = new Select();
