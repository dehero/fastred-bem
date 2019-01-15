'use strict';

var $ = require('jquery');

$.fn.scrollTo = function(duration, callback) {
    duration = typeof duration  !== 'undefined' ? duration : 400;
    
    var $scroller = $(this).closest('.popup');
	
    if (!$scroller.length) {
        $scroller = $('html,body');
    }
    
    if (duration > 0) {
        $scroller.animate({scrollTop: $(this).offset().top}, duration);  
    } else {
        $scroller.scrollTop($(this).offset().top);    
    }    
    
    if (callback && typeof callback == 'function') {
        callback();
    }
};