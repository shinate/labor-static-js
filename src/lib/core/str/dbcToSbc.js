/**
 * 全角字转半角字
 * @id STK.core.str.dbcToSbc
 * @alias STK.core.str.dbcToSbc
 * @param {String} str
 * @return {String} str
 * @author yuwei | yuwei@staff.sina.com.cn
 * @example
 * STK.core.str.dbcToSbc('ＳＡＡＳＤＦＳＡＤＦ') === 'SAASDFSADF';
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

})( window ? window : this, 'dbcToSbc', function() {
    return function(str) {
        return str.replace(/[\uff01-\uff5e]/g, function(a) {
            return String.fromCharCode(a.charCodeAt(0) - 65248);
        }).replace(/\u3000/g, " ");
    };
});
