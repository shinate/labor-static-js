(function(global, __PN__, factory) {
    /* CommonJS */
    if ( typeof require === 'function' && typeof module === 'object' && module && typeof exports === 'object' && exports)
        module['exports'] = factory();
    /* AMD */
    else if ( typeof define === 'function' && define['amd'])
        define(function() {
            return factory();
        });
    /* Global */
    else if (global.__NS__ && (typeof global[global.__NS__] === 'object' || typeof global[global.__NS__] === 'function') && global[global.__NS__])
        global[global.__NS__][__PN__] = global[global.__NS__][__PN__] || factory();
    else
        global[__PN__] = global[__PN__] || factory();

})( window ? window : this, 'hashCode', function() {
    return function(str) {
        var h = 0, off = 0;
        var len = str.length;
        for (var i = 0; i < len; i++) {
            h = 31 * h + str.charCodeAt(off++);
        }
        var t = -2147483648 * 2;
        while (h > 2147483647) {
            h += t;
        }
        return h;
    };
});
