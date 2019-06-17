
var Component = require('component');

function Message() {
    this.template = 'message';
    this.selector = '.message';

    var Message = this;
    var $ = require('jquery');
    var classes = {
        closing: 'message_closing'
    };
    var dataKeys = {
        timeout: 'timeout'
    };
    var selectors = {        
        close:      '.message__close'
    };

    require('button');    
    require('message/message.css.styl');
    template(Message.template, require('message/message.pug'));
    
    $(document).on('click', selectors.close, function (e) {
        e.preventDefault();

        var $message = $(this).parent();
        Message.close($message);
    });

    $(document).on('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd', Message.selector, function () {
        var $component = $(this);

        if ($component.hasClass(classes.closing)) {
            $component.remove();
        }   
    });    

    this.close = function(component) {
        var $component = $(component);
        $component.addClass(classes.closing);
    }; 

    this.init = function(component) {
        var timeout = $(component).data(dataKeys.timeout);
        
        if (timeout > 0) {
            setTimeout(function() {Message.close(component)}, timeout);
        }
    }

    Component.register(this);
}

Message.prototype = Component;

module.exports = new Message();