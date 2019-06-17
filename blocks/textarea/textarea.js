var Component = require('component');

function Textarea() {
    this.template = 'textarea';
    this.selector = '.textarea';

    var $ = require('jquery');
    var classes = {
        autosize: 'textarea_autosize'
    };

    require('textarea/textarea.css.styl');
    template(this.template, require('textarea/textarea.pug'));

    this.init = function(component) {
        if ($(component).hasClass(classes.autosize)) {
            var autosize = require('autosize');

            autosize(component);
        }
    };

    Component.register(this);
}

Textarea.prototype = Component;

module.exports = new Textarea();