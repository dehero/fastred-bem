var Component = require('component');

function Spinner() {
    this.template = 'spinner';
    this.selector = '.spinner';

    var Spinner = this;
    var $ = require('jquery');

    var classes = {
        disabled: 'spinner_disabled'
    }

    require('font-icon');
    require('spinner/spinner.css.styl');
    template('spinner', require('spinner/spinner.pug'));

    this.disabled = function(component, value) {
        var $component = $(component);

        if (typeof value !== 'undefined') {
            $component.toggleClass(classes.disabled, value);
        } else {
            return $component.hasClass(classes.disabled);
        }
    }

    Component.register(this);
}

Spinner.prototype = Component;

module.exports = new Spinner();