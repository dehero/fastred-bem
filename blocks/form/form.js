var Component = require('component');

function Form() {
	fastredRequire('template');
	
	this.template = 'form';
	this.selector = '.form';

	this.events = {
		submit: 'submit.form',
		submittingChange: 'submitting-change.form'
	}

	var dataKeys = {
		submitting: 'submitting'
	}

	var selectors = {
		submit: '.form__submit'
	}

	var Form = this;
	var $ = require('jquery');

	require('form/form.css.styl');
	template('form__submit', require('form/form__submit.pug'));

	this.data = function(component, value) {		
		var CRLF = /\r?\n/g;
		var submitterTypes = /^(?:submit|button|image|reset|file)$/i;
		var submittable = /^(?:input|select|textarea|keygen)/i;
		var checkableType = /^(?:checkbox|radio)$/i; 

		if (typeof value !== 'undefined') {				
			$(component)[0].reset();
			$.each(value, function (key, value) {
				var ctrl = $('[name=' + key + ']', component);
				var type = ctrl.prop('type');

				if (checkableType.test(type)) {
					ctrl.each(function () {
						if ($(this).attr('value') == value) $(this).attr('checked', value);
					});
				} else {
					ctrl.val(value);
				}
			});
		} else {
			var result = {};

			var nodes = $(component).map(function() {
				var elements = $.prop(this, 'elements');
				return elements ? $.makeArray(elements) : this;
			})
			.filter(function() {
				var type = this.type;
		
				return this.name && submittable.test(this.nodeName) && !submitterTypes.test(type) &&
					(this.checked || type !== 'radio');
			})
			.map(function(i, elem) {
				var type = this.type;
				var val = $(this).val();

				if (type === 'checkbox') {
					val = this.checked ? val : null;
				} else if (val === null) {
					return null;
				} else if (Array.isArray(val)) {
					return $.map(val, function(val) {
						return { name: elem.name, value: val.replace(CRLF, '\r\n') };
					});
				} else {
					val = val.replace(CRLF, '\r\n');
				}

				return { name: elem.name, value: val };				
			}).get();

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

			$.each(nodes, extend);

			return result;
		}
	};

	this.init = function(component) {
		var $component = $(component);
		var $submit = $(templateToHtml('form__submit'));		

		// Allow form submitting from keyboard
		$component.append($submit);

		$component.submit(function(e) {
			e.stopImmediatePropagation();

			var newEvent = $.Event(Form.events.submit);
			$component.trigger(newEvent);
						
			if (newEvent.isDefaultPrevented()) {
				e.preventDefault();
			};     				
		});
	}

	this.submit = function(component) {
		var $component = $(component);
		var $submit = $component.find(selectors.submit);

		$submit.click();
	};

	this.submitting = function(component, value) {
		var $component = $(component);
		var oldValue = $component.data(dataKeys.submitting);

		if (typeof value !== 'undefined') {
			if (oldValue !== value) {
				$component.data(dataKeys.submitting, value);
				$component.trigger(Form.events.submittingChange, value);
			}			
		} else {
			return oldValue;
		}
	}

	Component.register(this);
}

Form.prototype = Component;

module.exports = new Form();