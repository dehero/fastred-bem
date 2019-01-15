var Component = require('component');

function Popup() {
    this.template = 'popup';
    this.selector = '.popup';

    var Popup = this;
    var $ = require('jquery');
    var Body = require('body');
    var popupCount = 0;

    var selectors = {
        close:      '.popup__close',
        content:    '.popup__content',
        title:      '.popup__title'
    };

    var classes = {
        visible: 'popup_visible',
        hiding: 'popup_hiding'
    };

    require('button');
    require('toolbar');
    require('popup/popup.css.styl');
    template(this.template, require('popup/popup.pug'));

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
        var $buttonClose = $component.find(selectors.close);

        $component.click(function(e) {
            if (e.target !== this) return;
            Popup.hide(component);
        });

        $buttonClose.click(function(e) {
            e.preventDefault();
            Popup.hide(component);
        });
    };

    this.content = function(component, value) {
        var $component = $(component);
        var $content = $component.find(selectors.content);

        $content.empty();
        $content.append($(value));
    };

    this.title = function(component, value) {
        var $component = $(component);
        var $title = $component.find(selectors.title);

        if (typeof value !== 'undefined') {
            $title.text(value);
        } else {
            return $title.text();
        }
    };

    Component.register(this);
}

Popup.prototype = Component;

module.exports = new Popup();