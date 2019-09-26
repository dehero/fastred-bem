var Input = require('component');

function InputSearch() {
    fastredRequire('template');
    
    this.template = 'input-search';
    this.selector = '.input-search';

    this.events = {
        search: 'search.input-search'
    };
    var dataKeys = {
        timeout: 'timeout'
    }
    var selectors = {
        input: '.input-search__input',
        reset: '.input-search__reset'
    }    

    var that = this;
    var $ = require('jquery');

    var Input = require('input');
    require('button');    
    require('input-search/input-search.css.styl');
    template(this.template, require('input-search/input-search.pug'));

    this.init = function(component) {
        var $component = $(component);
        var $input = $component.find(selectors.input);
        var $reset = $component.find(selectors.reset);
        var timeoutId;

        $reset.click(function(e) {
            var oldValue = $input.val();

            if (oldValue != '') {
                $input.val('').trigger('change');
            }
        });

        $input.on('keyup change paste', function(e) {
            var timeout = $component.data(dataKeys.timeout);

            if (timeoutId) {
                clearTimeout(timeoutId);
            }            

            if (timeout > 0) {
                timeoutId = setTimeout(function() {
                    $component.trigger(that.events.search);
                }, timeout);
            } else {
                $component.trigger(that.events.search);
            } 
        });
    }

    this.value = function(component, value) {
        var $input = $(component).find(selectors.input);

        return Input.value($input, value);
    }

    Input.register(this);
}

InputSearch.prototype = Input;

module.exports = new InputSearch();
