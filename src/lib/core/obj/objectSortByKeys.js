var $objectKeys = require('../obj/keys');
(function(global, __PN__, factory) {
    /* CommonJS */
    if ( typeof require === 'function' && typeof module === 'object' && module && typeof exports === 'object' && exports)
        module['exports'] = (function() {
            var objectKeys;
            try {
                objectKeys = require('./objectKeys');
            }
            catch (e) {
            }
            return factory(objectKeys);
        })();
    /* AMD */
    else if ( typeof define === 'function' && define['amd'])
        define(['./objectKeys'], function(objectKeys) {
            return factory(objectKeys);
        });
    /* Global */
    else if (global.__NS__ && (typeof global[global.__NS__] === 'object' || typeof global[global.__NS__] === 'function') && global[global.__NS__])
        global[global.__NS__][__PN__] = global[global.__NS__][__PN__] || factory(global['objectKeys']);
    else
        global[__PN__] = global[__PN__] || factory(global['objectKeys']);

})( window ? window : this, 'objectSortByKeys', function(objectKeys) {
    return function(obj, type) {
        type != null && ( type = type.toLowerCase());
        var sortRule = objectKeys(obj);
        sortRule.sort();
        if (type === 'desc') {
            sortRule.reverse();
        }
        var sortIndex = {};
        for (var i = 0, len = sortRule.length; i < len; i++) {
            sortIndex[sortRule[i]] = obj[sortRule[i]];
        }
        return sortIndex;
    };
});
