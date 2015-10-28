(function(global, __PN__, factory) {
    /* CommonJS */
    if ( typeof require === 'function' && typeof module === 'object' && module && typeof exports === 'object' && exports)
        module['exports'] = (function() {
            var hasProp;
            try {
                hasProp = require('./hasProp');
            }
            catch (e) {
            }
            return factory(hasProp);
        })();
    /* AMD */
    else if ( typeof define === 'function' && define['amd'])
        define(['./hasProp'], function(hasProp) {
            return factory(hasProp);
        });
    /* Global */
    else if (global.__NS__ && (typeof global[global.__NS__] === 'object' || typeof global[global.__NS__] === 'function') && global[global.__NS__])
        global[global.__NS__][__PN__] = global[global.__NS__][__PN__] || factory(global['hasProp']);
    else
        global[__PN__] = global[__PN__] || factory(global['hasProp']);

})( window ? window : this, 'extend', function(hasProp) {

    return function() {
        var args = Array.prototype.slice.call(arguments);
        if (args.length === 0) {
            return {};
        }
        else if (args.length === 1) {
            return args[0];
        }
        else {
            var i, k, o = {}, source = args.shift();
            for ( i = args.length - 1; i >= 0; i--) {
                args[i] = args[i] || {};
                for (k in args[i]) {
                    if (!hasProp(o, k)) {
                        source[k] = args[i][k];
                        o[k] = null;
                    }
                }
            }
            try {
                return source;
            }
            finally {
                args = i = k = o = source = null;
            }
        }
    };
});
