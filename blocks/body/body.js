var Component = require('component');

function Body() {
    this.selector = '.body';
    this.template = 'body';

    var $ = require('jquery');
    var $body;
    var classes = {
        messageStack: 'body__message-stack',
        noScrollbar: 'body_scrollbar-override'
    };
    var selectors = {
        messageStack: '.body__message-stack'
    }

    require('body/body.css.styl');

    this.init = function(component) {
        $body = $(component);
    };

    this.message = function(messages) {
        var $messageStack = $body.find(selectors.messageStack);
        var MessageStack = require('message-stack');

        if ($messageStack.length == 0) {
            $messageStack = $(MessageStack.create({items: messages}, classes.messageStack));
            $messageStack.prependTo($body);
        } else {
            MessageStack.add($messageStack, messages);
        }
    }

    this.scrollBarVisible = function(value) {
        $body.toggleClass(classes.noScrollbar, !value);
    };

    Component.register(this);
}

Body.prototype = Component;

module.exports = new Body();