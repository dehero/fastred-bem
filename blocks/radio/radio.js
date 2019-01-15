var Checkbox = require('checkbox');

function Radio() {
    this.template = 'radio';
    this.selector = '.radio';

    var $ = require('jquery');

    this.selectors = {
        input: '.radio__input'
    }

    require('radio/radio.css.styl');
    template(this.template, require('radio/radio.pug'));

    Checkbox.register(this);
}

Radio.prototype = Checkbox;

module.exports = new Radio();
