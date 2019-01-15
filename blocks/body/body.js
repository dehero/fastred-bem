var Component = require('component');

function Body() {
    this.selector = '.body';
    this.template = 'body';

    var $ = require('jquery');
    var $body;
    var classes = {
        noScrollbar: 'body_scrollbar-override'
    };

    require('body/body.css.styl');

    this.init = function(component) {
        $body = $(component);
    };

    this.scrollBarVisible = function(value) {
        $body.toggleClass(classes.noScrollbar, !value);
    };

    Component.register(this);
}

Body.prototype = Component;

module.exports = new Body();