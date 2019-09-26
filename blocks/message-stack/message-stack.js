
var Component = require('component');

function MessageStack() {
    fastredRequire('template', 'var');

    this.template = 'message-stack';
    this.selector = '.message-stack';

    var MessageStack = this;
    var $ = require('jquery');
    var classes = {
        item: 'message-stack__item'
    }

    var Message = require('message');
    require('message-stack/message-stack.css.styl');
    template(MessageStack.template, require('message-stack/message-stack.pug'));

    this.add = function(component, items) {
        items = varIsStr(items) 
            ? [{content: items}] 
            : (varIsHash(items) ? [items] : items)

        if (!varIsArr(items)) return;

        for (var i = 0; i < items.length; i++) {
            $(component).append(Message.create(items[i], classes.item));
        }
    }

    Component.register(this);
}

MessageStack.prototype = Component;

module.exports = new MessageStack();