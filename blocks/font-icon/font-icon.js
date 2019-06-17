var Component = require('component');

function FontIcon() {
	this.template = 'font-icon';
	this.selector = '.font-icon';

	var FontIcon = this;
    var $ = require('jquery');
    var classes = {
        id: 'font-icon_id_'
    }

    require('font-icon/font-icon.css.styl');
    template('font-icon', require('font-icon/font-icon.pug'));

    this.id = function(component, value) {
        var $component = $(component);
        var oldClass = Component.classByPrefix($component, classes.id);
        var oldValue = oldClass.split('_').pop();

        if (typeof value !== 'undefined') {
            if (oldValue !== value) {
                $component.removeClass(oldClass).addClass(classes.id + value);
            }
        } else {
            return oldValue;
        }
    }

	Component.register(this);
}

FontIcon.prototype = Component;

module.exports = new FontIcon();