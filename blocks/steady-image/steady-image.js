var Component = require('component');

function SteadyImage() {
    this.template = 'steady-image';
    this.selector = '.steady-image';

    var $ = require('jquery');
    var classes = {
        lazyload:   'steady-image_lazyload'
    };
    var selectors = {
        lazyload:   '.steady-image_lazyload',
        image:      '.steady-image__image'
    };

    require('jquery-inview');
    require('steady-image/steady-image.css.styl');
    template(this.template, require('steady-image/steady-image.pug'));

    this.init = function(component) {

        $(component).filter(selectors.lazyload).one('inview', function() {
            var $img = $(this).find(selectors.image);
            var src = $img.data('src');
            var srcset = $img.data('srcset');

            if (src) {
                $img.fadeOut(0);
                $img.attr('srcset', srcset);
                $img.attr('src', src);
                $img.removeAttr('data-srcset');
                $img.removeAttr('data-src');                
                $img.fadeIn();
            }
        });
    };

    this.src = function(component, value) {
        var $component = $(component);
        var $image = $component.find(selectors.image);
        var attr = $component.hasClass(classes.lazyload) ? 'data-src' : 'src';
        var oldValue = $image.attr(attr);

        if (typeof value !== 'undefined') {
            if (oldValue !== value) {
                $image.attr(attr, value);
            }
        } else {
            return oldValue;
        }
    };

    this.srcset = function(component, value) {
        var $component = $(component);
        var $image = $component.find(selectors.image);
        var attr = $component.hasClass(classes.lazyload) ? 'data-srcset' : 'srcset';
        var oldValue = $image.attr(attr);

        if (typeof value !== 'undefined') {
            if (oldValue !== value) {
                $image.attr(attr, value);
            }
        } else {
            return oldValue;
        }
    };    

    this.width = function(component, value) {
        var $component = $(component);
        var oldValue = $component.css('width');

        if (typeof value !== 'undefined') {
            if (oldValue !== value) {
                $component.css('width', value);
            }
        } else {
            return oldValue;
        }
    };

    Component.register(this);
}

SteadyImage.prototype = Component;

module.exports = new SteadyImage();