/**
 * 从左到右取字符串，中文算两个字符.
 * @id STK.core.str.leftB
 * @alias STK.core.str.leftB
 * @param {String} str
 * @param {Number} lens
 * @return {String} str
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * STK.core.str.leftB( '世界真和谐'， 6 ) === '世界真';//向汉编致敬
 */
(function(global, __PN__, factory) {
    /* CommonJS */
    if ( typeof require === 'function' && typeof module === 'object' && module && typeof exports === 'object' && exports)
        module['exports'] = (function() {
            var bLength;
            try {
                bLength = require('./bLength');
            }
            catch(e) {
            }
            return factory(bLength);
        })();
    /* AMD */
    else if ( typeof define === 'function' && define['amd'])
        define(['./bLength'], function(bLength) {
            return factory(bLength);
        });
    /* Global */
    else if (global.__NS__ && (typeof global[global.__NS__] === 'object' || typeof global[global.__NS__] === 'function') && global[global.__NS__])
        global[global.__NS__][__PN__] = global[global.__NS__][__PN__] || factory(global['bLength']);
    else
        global[__PN__] = global[__PN__] || factory(global['bLength']);

})( window ? window : this, 'leftB', function(bLength) {
    return function(str, lens) {
        var s = str.replace(/\*/g, ' ').replace(/[^\x00-\xff]/g, '**');
        str = str.slice(0, s.slice(0, lens).replace(/\*\*/g, ' ').replace(/\*/g, '').length);
        if (bLength(str) > lens && lens > 0) {
            str = str.slice(0, str.length - 1);
        }
        return str;
    };
});
