/**
 * decode HTML
 * @id STK.core.str.decodeHTML
 * @alias STK.core.str.decodeHTML
 * @param {String} str
 * @return {String} str
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * STK.core.str.decodeHTML('&amp;&lt;&gt;&quot;$nbsp;') === '&<>" ';
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

})( window ? window : this, 'decodeHTML', function() {
    return function(str) {
        // var div = document.createElement('div');
        // 		div.innerHTML = str;
        // 		return div.innerText == undefined ? div.textContent : div.innerText;
        //	modify by Robin Young | yonglin@staff.sina.com.cn
        if ( typeof str !== 'string') {
            throw 'decodeHTML need a string as parameter';
        }
        return str.replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, '\'').replace(/&nbsp;/g, '\u00A0').replace(/&#32;/g, '\u0020').replace(/&amp;/g, '\&');
    };
});
