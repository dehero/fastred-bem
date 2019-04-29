var Component = require('component');

function Popup() {
    this.template = 'popup';
    this.selector = '.popup';
    this.events = {
        submit: 'submit.popup'
    };

    var Popup = this;
    var $ = require('jquery');
    var Body = require('body'); 
    var popupCount = 0;

    var dataKeys = {
        popup: 'popup'
    }

    var selectors = {        
        content:    '.popup__content',
        hide:       '.popup__hide',
        status:     '.popup__status',
        submit:     '.popup__submit',
        title:      '.popup__title',
        toggle:     '.popup__show',
        top:        '.popup_top'
    };

    var classes = {
        top:        'popup_top',
        visible:    'popup_visible',
        hiding:     'popup_hiding',
        showing:    'popup_showing'
    };

    require('button');
    require('toolbar');
    require('popup/popup.css.styl');
    template(this.template, require('popup/popup.pug'));
    template('popup__buttons', require('popup/popup__buttons.pug'));

    $(document).on('click', selectors.toggle, function (e) {
        e.preventDefault();

        var $popup = $('#' + $(this).data(dataKeys.popup));
        Popup.show($popup);
    });      

    this.hide = function(component) {
        var $component = $(component);

        $component.addClass([classes.visible, classes.hiding].join(' '));
    };

    this.show = function(component) {
        var $component = $(component);

        if (!$component.hasClass(classes.visible)) {
            popupCount++;
            Body.scrollBarVisible(false);
            $component.addClass([classes.visible, classes.showing].join(' '));
        }        

        // Make last shown popup topmost
        if (popupCount > 1) {
            $(selectors.top).removeClass(classes.top);
            $component.addClass(classes.top);
        }
    };

    this.init = function(component) {
        var $component = $(component);
        var $buttonHide = $component.find(selectors.hide);
        var $buttonSubmit = $component.find(selectors.submit);

        $component.click(function(e) {
            if (e.target !== this) return;
            Popup.hide(component);
        });

        $component.on('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd', function () {
            if ($component.hasClass(classes.hiding)) {
                $component.removeClass([classes.hiding, classes.visible].join(' '));                
                popupCount--;
                Body.scrollBarVisible(popupCount === 0);
                // Remove topmost class if there's one or less popups visible
                if (popupCount < 2) {
                    $(selectors.top).removeClass(classes.top);
                }
            } else {       
                $component.removeClass(classes.showing);
            }
        });

        $buttonSubmit.click(function(e) {
            e.preventDefault();            
            Popup.submit(component);
        });

        $buttonHide.click(function(e) {
            e.preventDefault();
            Popup.hide(component);
        });        
    };

    this.content = function(component, value) {
        var $component = $(component);
        var $content = $component.find(selectors.content);

        return $content.text(value);        
    };

    this.contentHtml = function(component, value) {
        var $component = $(component);
        var $content = $component.find(selectors.content);

        if (typeof value !== 'undefined') {
            $content.empty();
            $content.append($(value));
        } else {
            return $content.html();
        }
    };

    this.status = function(component, value) {
        var $component = $(component);
        var $status = $component.find(selectors.status);

        return $status.text(value); 
    };

    this.statusHtml = function(component, value) {
        var $component = $(component);
        var $status = $component.find(selectors.status);

        if (typeof value !== 'undefined') {
            $status.empty();
            $status.append($(value));
        } else {
            return $status.html(); 
        }
    };     

    this.submit = function(component) {
        var $component = $(component);

        $component.trigger(Popup.events.submit);
        Popup.hide(component);
    };

    this.title = function(component, value) {
        var $component = $(component);
        var $title = $component.find(selectors.title);

        return $title.text(value); 
    };

    this.titleHtml = function(component, value) {
        var $component = $(component);
        var $title = $component.find(selectors.title);

        if (typeof value !== 'undefined') {
            $title.empty();
            $title.append($(value));
        } else {
            return $title.html();
        }
    };    

    Component.register(this);
}

Popup.prototype = Component;

module.exports = new Popup();