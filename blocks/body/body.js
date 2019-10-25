var Component = require('component');

function Body() {
    this.selector = '.body';
    this.template = 'body';

    var $ = require('jquery');
    var $body;
    var classes = {
        headerHiding: 'body_header-hiding',
        headerHide:   'body__header_hide',
        messageStack: 'body__message-stack',
        noScrollbar: 'body_scrollbar-override'
    };
    var selectors = {
        header:       '.body__header',
        messageStack: '.body__message-stack'
    }

    require('body/body.css.styl');

    this.init = function(component) {
        $body = $(component);

        if ($body.hasClass(classes.headerHiding)) {
            var $header = $(selectors.header);
            var $window = $(window);
            var lastScrollTop = 0;
            var navbarHeight = $header.outerHeight();

            $window.on('scroll', function(e) {                
                var scrollTop = $window.scrollTop();
    
                if (scrollTop > lastScrollTop && scrollTop > navbarHeight) {
                    // Scroll down
                    $header.addClass(classes.headerHide);
                } else if(scrollTop + $window.height() < $(document).height()) {
                    // Scroll up
                    $header.removeClass(classes.headerHide);
                }
                
                lastScrollTop = scrollTop;
            });
        }     
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