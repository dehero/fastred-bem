var Component = require('component');

function Form() {
    this.template = 'form';
    this.selector = '.form';
    this.events = {
        submit: 'submit'
    };

    var that = this; 
    var $ = require('jquery');

    this.data = function(component, value) {

		var result = {};
		var extend = function (i, element) {
			var node = result[element.name];

	        // If node with same name exists already, need to convert it to an array as it
	        // is a multi-value field (i.e., checkboxes)

			if ('undefined' !== typeof node && node !== null) {
				if ($.isArray(node)) {
					node.push(element.value);
				} else {
					result[element.name] = [node, element.value];
				}
			} else {
				result[element.name] = element.value;
			}
		};

        $.each($(component).serializeArray(), extend);
        
		return result;
    };

    Component.register(this);
}

Form.prototype = Component;

module.exports = new Form();