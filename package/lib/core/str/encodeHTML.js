/**
 * encode HTML
 * @id STK.core.str.encodeHTML
 * @alias STK.core.str.encodeHTML
 * @param {String} str
 * @return {String} str
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * STK.core.str.encodeHTML('&<>" ') === '&amp;&lt;&gt;&quot;$nbsp;';
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

})( window ? window : this, 'encodeHTML', function() {
    return function(str) {
        // var div = document.createElement('div');
        // 		div.appendChild(document.createTextNode(str));
        // 		return div.innerHTML.replace(/\s/g, '&nbsp;').replace(/"/g, "&quot;");
        //	modify by Robin Young | yonglin@staff.sina.com.cn
        if ( typeof str !== 'string') {
            throw 'encodeHTML need a string as parameter';
        }
        return str.replace(/\&/g, '&amp;').replace(/"/g, '&quot;').replace(/\</g, '&lt;').replace(/\>/g, '&gt;').replace(/\'/g, '&#39;').replace(/\u00A0/g, '&nbsp;').replace(/(\u0020|\u000B|\u2028|\u2029|\f)/g, '&#32;');
    };
});
