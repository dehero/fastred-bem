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
		if (typeof value !== 'undefined') {				
			$(component)[0].reset();
			$.each(value, function (key, value) {
				var ctrl = $('[name=' + key + ']', component);
				switch (ctrl.prop("type")) {
					case 'radio':
					case 'checkbox':
						ctrl.each(function () {
							if ($(this).attr('value') == value) $(this).attr('checked', value);
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
