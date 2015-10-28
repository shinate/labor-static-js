/**
 * delete the space at the beginning and end of the string
 * @param {String} str
 * @return {String} str
 */
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

})( window ? window : this, 'trim', function() {
    return function(str) {
        if ( typeof str !== 'string') {
            throw 'trim parameter must be a string!';
        }
        var len = str.length;
        var s = 0;
        var reg = /(\u3000|\s|\t|\u00A0)/;

        while (s < len) {
            if (!reg.test(str.charAt(s))) {
                break;
            }
            s += 1;
        }
        while (len > s) {
            if (!reg.test(str.charAt(len - 1))) {
                break;
            }
            len -= 1;
        }
        return str.slice(s, len);
    };

});
