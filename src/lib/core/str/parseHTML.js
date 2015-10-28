/**
 * parse HTML
 * @id STK.core.str.parseHTML
 * @alias STK.core.str.parseHTML
 * @param {String} str
 * @return {Array} ret
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * STK.core.str.parseHTML('<div></div>') === [["<div>", "", "div", ""], ["</div>", "/", "div", ""]];
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

})( window ? window : this, 'parseHTML', function() {
    return function(htmlStr) {
        var tags = /[^<>]+|<(\/?)([A-Za-z0-9]+)([^<>]*)>/g;
        var a, i;
        var ret = [];
        while (( a = tags.exec(htmlStr))) {
            var n = [];
            for ( i = 0; i < a.length; i += 1) {
                n.push(a[i]);
            }
            ret.push(n);
        }
        return ret;
    };
});
