'use strict';

var locksmithFilters = angular.module('locksmithFilters', []);

locksmithFilters.filter('byNameOrAccountNumber', function() {
    var q = function(item, query) {
        if (typeof(query) == "undefined") return true;
        if (query == "") return true;

        return item['name'].toLowerCase().indexOf(query.toLowerCase()) > -1 ||
            item['account_number'].indexOf(query) > -1;
    };

    return function(input, query) {
        var out = [];
        angular.forEach(input, function(item) {
            if (q(item, query)) out.push(item);
        });
        return out;
    };
});
