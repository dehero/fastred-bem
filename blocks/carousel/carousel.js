var Component = require('component'); 

function Carousel() { 
    this.template = 'carousel';
    this.selector = '.carousel';

    var Carousel = this;
    var $ = require('jquery');
    var dataKeys = {
        interval: 'interval',
        timer: 'timer'
    }
    var classes = {
        itemActive: 'carousel__item_selected',
        itemHiding: 'carousel__item_hiding',
        itemShowing: 'carousel__item_showing',
        indicatorActive: 'carousel__indicator_selected',
        previous: 'carousel__control_previous',
        reverse: 'carousel_reverse'        
    }
    var selectors = {
        item: '.carousel__item',
        itemActive: '.carousel__item_selected',
        itemHiding: '.carousel__item_hiding',
        itemShowing: '.carousel__item_showing',        
        control: '.carousel__control',
        indicator: '.carousel__indicator',
        indicatorActive: '.carousel__indicator_selected'
    }

    require('jquery-touch-events')($);
    require('font-icon');
    require('steady-image');
    require('carousel/carousel.css.styl');
    template(this.template, require('carousel/carousel.pug'));

    this.endAnimation = function(component) {
        var $component = $(component);
        var $items = $component.find(selectors.item);
        var $item = $items.filter(selectors.itemShowing);
        var $oldItem = $items.filter(selectors.itemHiding);

        $component.removeClass(classes.reverse);
        $oldItem.removeClass(classes.itemHiding);
        $item.removeClass(classes.itemShowing);
    }

    this.index = function(component, value) {
        var $component = $(component);
        var $items = $component.find(selectors.item);
        var $oldItem = $items.filter(selectors.itemActive);
        var oldValue = $oldItem.index();

        if (typeof value !== 'undefined') {
            value = parseInt(value) || 0;

            if (value >= $items.length) {
                value = 0
            } else if (value < 0) {
                value = $items.length - 1;
            }

            if (value != oldValue) {
                var $item = $($items.get(value));
                var $indicators = $component.find(selectors.indicator);
                var $indicator = $($indicators.get(value));
                var lastValue = $items.length - 1;
                
                $indicators.removeClass(classes.indicatorActive);                
                $indicator.addClass(classes.indicatorActive);

                // Finish all slide changing animations
                Carousel.endAnimation(component);

                if ((oldValue === 0 && value === lastValue) ||
                    (value < oldValue && !(value === 0 && oldValue === lastValue))) {
                    $component.addClass(classes.reverse);
                }                

                $item.addClass([classes.itemActive, classes.itemShowing].join(' '));
                $oldItem.removeClass(classes.itemActive).addClass(classes.itemHiding);

                Carousel.resetTimer(component);                
            }
        } else {
            return oldValue;
        }
    }

    this.init = function(component) {
        var $component = $(component);
        var $controls = $component.find(selectors.control);
        var $indicators = $component.find(selectors.indicator);
        var $items = $component.find(selectors.item);

        if ($items.length > 1) {

            Carousel.resetTimer(component);

            $items.on('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd', function (e) {
                Carousel.endAnimation(component);
            });        

            $controls.click(function(e) {
            e.preventDefault();
            var step = $(this).hasClass(classes.previous) ? -1 : 1;

            Carousel.index(component, Carousel.index(component) + step);
            });

            $indicators.click(function(e) {
                e.preventDefault();
                var index = $(this).index();

                Carousel.index(component, index);
            });

            $component.on('swipeleft', function(e) {
                Carousel.index(component, Carousel.index(component) + 1);
            });

            $component.on('swiperight', function(e) {
                Carousel.index(component, Carousel.index(component) - 1);
            });        
        }
    };

    this.interval = function(component, value) {
        var $component = $(component);
        var oldValue = $component.data(dataKeys.interval);

        if (typeof value !== 'undefined') {
            value = parseInt(value) || 0;

            if (value !== oldValue) {
                $component.data(dataKeys.interval, value);
                Carousel.resetTimer(component);
            }
        } else {
            return oldValue;
        }
    }

    this.resetTimer = function(component) {
        var $component = $(component);
        var interval = Carousel.interval(component);

        clearTimeout($component.data(dataKeys.timer));
        
        $component.data(dataKeys.timer, setTimeout(function () {
            Carousel.index(component, Carousel.index(component) + 1);
        }, interval));
    }

    Component.register(this);
}

Carousel.prototype = Component;

module.exports = new Carousel();