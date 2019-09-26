var Component = require('component');

function Slider() {
    fastredRequire('float', 'template', 'var');

    this.template = 'slider';
    this.selector = '.slider';

    var Slider = this;
    var $ = require('jquery');
    var $activeHandle;
    var dataKeys = {
        $input: '$input',
        max: 'max',
        min: 'min',
        step: 'step',
        precision: 'precision',
        range: 'range'
    };
    var selectors = {
        handle:     '.slider__handle',
        handle1:    '.slider__handle_1',
        handle2:    '.slider__handle_2',        
        input:      '.slider__input',
        input1:     '.slider__input_1',
        input2:     '.slider__input_2',
        selection:  '.slider__selection'
    };

    require('slider/slider.css.styl');
    template(this.template, require('slider/slider.pug'));

    $(document).mousemove(function(e) {        
        if(!$activeHandle) return;

        var $component = $activeHandle.parent();

        var fraction = (e.pageX - $component.offset().left) / $component.outerWidth();
        var max = Slider.max($component);
        var min = Slider.min($component);
        var range = Slider.range($component);
        var value;

        if (range) {
            var oldValue = Slider.value($component);
            var index = $activeHandle.filter(selectors.handle1).length > 0 ? 0 : 1;

            value = oldValue;
            value[index] = min + (max - min) * fraction;
        } else {
            value = min + (max - min) * fraction;
        }

        Slider.value($component, value);
    });
    
    $(document).mouseup(function(e) {        
        if(!$activeHandle) return;

        $activeHandle = null;
    });

    this.max = function(component, value) {
        var $component = $(component);
        var oldValue = $component.data(dataKeys.max);

        if (typeof value !== 'undefined') {
            var precision = Slider.precision(component);
            value = floatToStr(parseFloat(value), precision);

            if (oldValue !== value) {
                $component.data(dataKeys.max, value);
            }
        } else {
            return parseFloat(oldValue);
        }
    };    
    
    this.min = function(component, value) {
        var $component = $(component);
        var oldValue = $component.data(dataKeys.min);

        if (typeof value !== 'undefined') {
            var precision = Slider.precision(component);
            value = floatToStr(parseFloat(value), precision);

            if (oldValue !== value) {
                $component.data(dataKeys.min, value);
            }
        } else {
            return parseFloat(oldValue);
        }
    };

    this.init = function(component) {
        var $component = $(component);
        var $handle = $component.find(selectors.handle);
        var $input = $component.find(selectors.input);

        $component.data(dataKeys.$input, $input);

        $handle.mousedown(function(e) {
            $activeHandle = $(this);
        });
    };

    this.precision = function(component) {
        var $component = $(component);
        var oldValue = parseInt($component.data(dataKeys.precision));

        if (typeof value !== 'undefined') {
            value = parseInt(value);
            if (value !== oldValue) {
                $component.data(dataKeys.precision, value);
            }
        } else {
            return oldValue;
        }
    };

    this.range = function(component) {
        return $(component).data(dataKeys.$input).length > 1;
    };

    this.step = function(component, value) {
        var $component = $(component);
        var oldValue = $component.data(dataKeys.step);

        if (typeof value !== 'undefined') {
            var precision = Slider.precision(component);
            value = floatToStr(parseFloat(value), precision);

            if (oldValue !== value) {
                $component.data(dataKeys.step, value);
            }
        } else {
            return parseFloat(oldValue);
        }
    };

    this.validateValue = function(component, value) {
        var $component = $(component);
        var max = Slider.max($component);
        var min = Slider.min($component);
        var step = Slider.step($component);
        var precision = Slider.precision($component);

        var result = parseFloat(min + floatGetRound((value - min) / step) * step);
    
        if (result < min) {
            result = min;
        } else if (result > max) {
            result = max;
        }

        return floatToStr(result, precision);
    };

    this.value = function(component, value) {
        var $component = $(component);
        var $input = $component.data(dataKeys.$input);
        var range = Slider.range($component);

        if (range) {
            var $input1 = $input.filter(selectors.input1);
            var $input2 = $input.filter(selectors.input2);

            var oldValue1 = $input1.val();
            var oldValue2 = $input2.val();

            if (typeof value !== 'undefined') {
                var max = Slider.max($component);
                var min = Slider.min($component);

                if (varIsArr(value)) {
                    value1 = value[0];
                    value2 = value[1];
                } else {
                    value1 = value2 = value;
                }

                value1 = Slider.validateValue($component, value1);
                value2 = Slider.validateValue($component, value2);

                if (oldValue1 !== value1 || oldValue2 !== value2) {
                    var $selection = $component.find(selectors.selection);
                    var $handle = $component.find(selectors.handle);
                    var $handle1 = $handle.filter(selectors.handle1);
                    var $handle2 = $handle.filter(selectors.handle2);
                    var float1 = parseFloat(value1);
                    var float2 = parseFloat(value2);
                    var percent1 = (float1 - min) / (max - min) * 100;
                    var percent2 = (float2 - min) / (max - min) * 100;

                    if (float2 < float1) {
                        var dummy = value2;
                        value2 = value1;
                        value1 = dummy;

                        if ($handle2.is($activeHandle) || $handle1.is($activeHandle)) {
                            dummy = $handle1.attr('class');                            
                            $handle1.attr('class', $handle2.attr('class'));
                            $handle2.attr('class', dummy);

                            dummy = $handle1;
                            $handle1 = $handle2;
                            $handle2 = dummy;                            
                        }
                    }

                    if (oldValue1 !== value1) {
                        $input1.val(value1);
                        $handle1.css('left', percent1 + '%');
                    }

                    if (oldValue2 !== value2) {
                        $input2.val(value2);
                        $handle2.css('left', percent2 + '%');                    
                    }

                    $selection.css({width: (percent2 - percent1) + '%', left: percent1 + '%'});
                }                
            } else {
                return [parseFloat(oldValue1), parseFloat(oldValue2)];
            }
        } else {
            var oldValue = $input.val();

            if (typeof value !== 'undefined') {
                var max = Slider.max($component);
                var min = Slider.min($component);
    
                value = Slider.validateValue($component, value);
    
                if (oldValue !== value) {
                    var $handle = $component.find(selectors.handle);
                    var $selection = $component.find(selectors.selection);
                    var percent = (parseFloat(value) - min) / (max - min) * 100;
    
                    $input.val(value);
                    $handle.css('left', percent + '%');
                    $selection.css('width', percent + '%');
                }                
            } else {
                return parseFloat(oldValue);
            }            
        }
    };

    Component.register(this);
}

Slider.prototype = Component;

module.exports = new Slider(); 