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

		if (typeof value !== 'undefined') {
			$(component)[0].reset();
			$.each(value, function (key, value) {
				var ctrl = $('[name=' + key + ']', component);
				switch (ctrl.prop("type")) {
					case "radio": case "checkbox":
						ctrl.each(function () {
							if ($(this).attr('value') == value) $(this).attr("checked", value);
						});
						break;
					default:
						ctrl.val(value);
				}
			});
		} else {
			var result = {};
			var extend = function (i, element) {
				var node = result[element.name];

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
		}
	};

	Component.register(this);
}

Form.prototype = Component;

module.exports = new Form();
