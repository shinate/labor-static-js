/**
 * get querykey's value
 * @id STK.core.str.queryString
 * @alias STK.core.str.queryString
 * @param {String} sKey
 * @param {Object} oOpts
 * @return {String} str
 * @author FlashSoft | fangchao@staff.sina.com.cn
 * @example
 * STK.core.str.queryString('author',{'source':'author=flashsoft&test=1'}) === 'flashsoft';
 */
(function(global, __PN__, factory) {
    /* CommonJS */
    if ( typeof require === 'function' && typeof module === 'object' && module && typeof exports === 'object' && exports)
        module['exports'] = (function() {
            var extend;
            try {
                extend = require('../obj/extend');
            }
            catch(e) {
            }
            return factory(global, extend);
        })();
    /* AMD */
    else if ( typeof define === 'function' && define['amd'])
        define(['../obj/extend'], function(extend) {
            return factory(global, extend);
        });
    /* Global */
    else if (global.__NS__ && (typeof global[global.__NS__] === 'object' || typeof global[global.__NS__] === 'function') && global[global.__NS__])
        global[global.__NS__][__PN__] = global[global.__NS__][__PN__] || factory(global, global['extend']);
    else
        global[__PN__] = global[__PN__] || factory(global, global['extend']);

})( window ? window : this, 'queryString', function(global, extend) {
    return function(key, opts) {
        var opts = extend({}, {
            source : global.location.search.substr(1),
            split : '&'
        }, opts || {});
        var rs = new RegExp("(^|" + opts.split + ")" + key + "=([^\\" + opts.split + "]*)(\\" + opts.split + "|$)", "gi").exec(opts.source), tmp;
        if ( tmp = rs) {
            return tmp[2];
        }
        return null;
    };
});
