/**
 * from https://github.com/douglascrockford/JSON-js
 * @id STK.core.json.strToJson
 * @alias STK.core.json.strToJson
 * @param {String} source
 * @param {Function} reviver
 * @return {Object|Json} value
 * @author Json.org
 * @example
 *   var b = STK.core.json.strToJson('{"test":"test"}');
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

})( window ? window : this, 'stringToJson', function() {

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

    return function(text, reviver) {

        if (window.JSON && window.JSON.parse) {
            return window.JSON.parse(text, reviver);
        }

        var j;

        function walk(holder, key) {

            var k, v, value = holder[key];
            if (value && typeof value === 'object') {
                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = walk(value, k);
                        if (v !== undefined) {
                            value[k] = v;
                        }
                        else {
                            delete value[k];
                        }
                    }
                }
            }
            return reviver.call(holder, key, value);
        }

        text = String(text);
        cx.lastIndex = 0;
        if (cx.test(text)) {
            text = text.replace(cx, function(a) {
                return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            });
        }

        if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

            j = eval('(' + text + ')');

            return typeof reviver === 'function' ? walk({
                '' : j
            }, '') : j;
        }

        throw new SyntaxError('JSON.parse');
    };
});

