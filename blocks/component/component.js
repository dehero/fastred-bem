function Component() {
    var Component = this;
    var inheritors = {};
    var $ = require('jquery');

    this.create = function(options, attributes) {
        var component = null;

        if (this.template) {
            var html = templateToHtml(this.template, options, attributes);
            component = $(html).get(0);
            Component.initAll(component);
        }

        return component;
    };

    this.initAll = function(component) {
        var $component = $(component);

        for(var key in inheritors) {
            var Inheritor = inheritors[key];
            var selector = Inheritor.selector;
            var init = Inheritor.init;

            if (init && typeof init === 'function') {
                var $collection = $component.find(selector);

                if ($component.is(selector)) {
                    $collection = $collection.add(component);
                }

                $collection.each(function (index, component) {
                    component.inits = component.inits || [];

                    // Some components meet both parent and child selectors and inherit parent functions, including "init"
                    // function. Check here that each init function runs only once on component to prevent doubling.
                    if (component.inits.indexOf(init) < 0) {
                        init(component);
                        component.inits.push(init);
                    }
                });
            }
        }
    };

    this.findRegistered = function(template) {
        return inheritors[template];
    };

    this.register = function(inheritor) {
        inheritors[inheritor.template] = inheritor;

        return inheritor;
    };

    $(function() {
        Component.initAll(document);
    });
}

module.exports = new Component();