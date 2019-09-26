var Component = require('component');

function FileIcon() {
    fastredRequire('template');
    
    this.template = 'file-icon';
    this.selector = '.file-icon';
    
    require('file-icon/file-icon.css.styl');
    template(this.template, require('file-icon/file-icon.pug'));    

    Component.register(this);
}

FileIcon.prototype = Component;

module.exports = new FileIcon();

