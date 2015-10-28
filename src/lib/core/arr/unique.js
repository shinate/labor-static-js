/**
 * 清楚数组中到重复元素
 * @id STK.core.arr.unique
 * @alias
 * @param {Array} o
 * @return {Array}
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * var li1 = ['a','b','c','a']
 * var li2 = unique(li1);
 * li2 === ['a','b','c']
 */

(function(global, __PN__, factory) {
    /* CommonJS */
    if ( typeof require === 'function' && typeof module === 'object' && module && typeof exports === 'object' && exports)
        module['exports'] = (function() {
            var isArray, findout;
            try {
                isArray = require('./isArray');
                findout = require('./indexOf');
            }
            catch (e) {
            }
            return factory(isArray, indexOf);
        })();
    /* AMD */
    else if ( typeof define === 'function' && define['amd'])
        define(['./isArray', './indexOf'], function(isArray, findout) {
            return factory(isArray, indexOf);
        });
    /* Global */
    else if (global.__NS__ && (typeof global[global.__NS__] === 'object' || typeof global[global.__NS__] === 'function') && global[global.__NS__])
        global[global.__NS__][__PN__] = global[global.__NS__][__PN__] || factory(global['isArray'], global['indexOf']);
    else
        global[__PN__] = global[__PN__] || factory(global['isArray'], global['indexOf']);

})( window ? window : this, 'unique', function(isArray, indexOf) {
    return function(o) {
        if (!isArray(o)) {
            throw 'the unique function needs an array as first parameter';
        }
        var result = [];
        for (var i = 0, len = o.length; i < len; i += 1) {
            if (indexOf(o[i], result) === -1) {
                result.push(o[i]);
            }
        }
        return result;
    };
});
