window.localeGetStrObj = function() {
    var key = locale();

    return cache('localeGetStrObj?' + key, function() {
        var url = require('../locales/' + key + '.json');
        var $ = require('jquery');
        var result = {};

        $.ajax({
            url: url,
            async: false,
            dataType: "json",
            success: function(data) {
                result = data;
            }
        });

        return result;
    });
};
