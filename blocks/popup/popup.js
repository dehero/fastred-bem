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
        toggle:     '.popup__show'
    };

    var classes = {
        visible: 'popup_visible',
        hiding: 'popup_hiding' 
    };

    require('button');
    require('toolbar');
    require('popup/popup.css.styl');
    template(this.template, require('popup/popup.pug'));

    $(document).on('click', selectors.toggle, function (e) {
        e.preventDefault();

        var $popup = $('#' + $(this).data(dataKeys.popup));
        Popup.show($popup);
    });      

    this.hide = function(component) {
        $(component).fadeOut('fast', function() {
            popupCount--;
            Body.scrollBarVisible(popupCount === 0);
        });
    };

    this.show = function(component) {
        popupCount++;
        Body.scrollBarVisible(false);
        $(component).css('display', 'flex').hide().fadeIn('fast');
    };

    this.init = function(component) {
        var $component = $(component);
        var $buttonHide = $component.find(selectors.hide);
        var $buttonSubmit = $component.find(selectors.submit);

        $component.click(function(e) {
            if (e.target !== this) return;
            Popup.hide(component);
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