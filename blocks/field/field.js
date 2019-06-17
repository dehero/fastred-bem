var Component = require('component');

function Field() {
	this.template = 'field';
	this.selector = '.field';

	var selectors = {
		error: '.field__error'
	}

	var Field = this;
	var $ = require('jquery');

    require('field/field.css.styl');
    template('field', require('field/field.pug'));

    this.error = function(component, value) {
        var $component = $(component).closest(Field.selector);
        var $error = $component.find(selectors.error);

        if (typeof value !== 'undefined') {
            $error.text(value);
        } else {
            return $error.text();
        }
    };

	Component.register(this);
}

Field.prototype = Component;

module.exports = new Field();