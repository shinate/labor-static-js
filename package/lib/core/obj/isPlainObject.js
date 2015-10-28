(function(global, __PN__, factory) {
    /* CommonJS */
    if ( typeof require === 'function' && typeof module === 'object' && module && typeof exports === 'object' && exports)
        module['exports'] = (function() {
            var isObject, isWindow;
            try {
                isObject = require('./isObject');
                isWindow = require('../util/isWindow');
            }
            catch (e) {
            }
            return factory(hasProp);
        })();
    /* AMD */
    else if ( typeof define === 'function' && define['amd'])
        define(['./isObject', '../util/isWindow'], function(isObject, isWindow) {
            return factory(isObject, isWindow);
        });
    /* Global */
    else if (global.__NS__ && (typeof global[global.__NS__] === 'object' || typeof global[global.__NS__] === 'function') && global[global.__NS__])
        global[global.__NS__][__PN__] = global[global.__NS__][__PN__] || factory(global['isObject'], global['isWindow']);
    else
        global[__PN__] = global[__PN__] || factory(global['isObject'], global['isWindow']);

})( window ? window : this, 'isPlainObject', function(isObject, isWindow) {

    return function(obj) {
        var key;

        // Must be an Object.
        // Because of IE, we also have to check the presence of the constructor property.
        // Make sure that DOM nodes and window objects don't pass through, as well
        if (!obj || !isObject(obj) || obj.nodeType || isWindow(obj)) {
            return false;
        }

        try {
            // Not own constructor property must be Object
            if (obj.constructor && !hasOwn.call(obj, "constructor") && !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
                return false;
            }
        }
        catch ( e ) {
            // IE8,9 Will throw exceptions on certain host objects #9897
            return false;
        }

        // Support: IE<9
        // Handle iteration over inherited properties before own properties.
        if (support.ownLast) {
            for (key in obj ) {
                return hasOwn.call(obj, key);
            }
        }

        // Own properties are enumerated firstly, so to speed up,
        // if last one is own, then all properties are own.
        for (key in obj ) {
        }

        return key === undefined || hasOwn.call(obj, key);
    };
});
