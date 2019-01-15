window.localeGetStr = function(key, args, pluralInt) {
    var values = localeGetStrObj();
    var str = values[key];

    if (varIsNumber(args)) pluralInt = args;

    if (varIsNumber(pluralInt)) {
        str = localeIntGetPlural(pluralInt, str);
    }

    if (args !== null) {
        fastredRequire('str');

        return strGetFormatted(str, args);
    }

    return varIsNotEmpty(str) ? str : key;
};

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