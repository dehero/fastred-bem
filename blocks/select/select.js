var Input = require('input');

function Select() {
    this.template = 'select';
    this.selector = '.select';

    var that = this;
    var $ = require('jquery');
    this.events = {
        change: 'change.select'
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

        $component.change(function(e) {
            $component.trigger(that.events.change);
        });
    }

    this.insert = function(component, item, position) {
        var $component = $(component);

        var items = varIsArr(item) ? item : [item];
        var position = position || 0;
        var components = [];

        for(var i = 0; i < items.length; i++) {
            components.push($(templateToHtml('select__item', {data: items[i]})).get(0));
        }

        if(position <= 0) {
            $(components).prependTo($component);
        } else {
            var $previous = $component.children().eq(position - 1);
            $(components).insertAfter($previous);
        }
    }

    this.clear = function(component) {
        $(component).empty();
    }

    this.count = function(component) {
        $(component).children().length;
    }

    Input.register(this);
}

Select.prototype = Input;

module.exports = new Select();
