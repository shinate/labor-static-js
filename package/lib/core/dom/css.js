(function(global, __PN__, factory) {
    /* CommonJS */
    if ( typeof require === 'function' && typeof module === 'object' && module && typeof exports === 'object' && exports)
        module['exports'] = (function() {
            var isNode, setStyle;
            try {
                isArray = require('./isNode');
                findout = require('./setStyle');
            }
            catch (e) {
            }
            return factory(isNode, setStyle);
        })();
    /* AMD */
    else if ( typeof define === 'function' && define['amd'])
        define(['./isNode', './setStyle'], function(isNode, setStyle) {
            return factory(isNode, setStyle);
        });
    /* Global */
    else if (global.__NS__ && (typeof global[global.__NS__] === 'object' || typeof global[global.__NS__] === 'function') && global[global.__NS__])
        global[global.__NS__][__PN__] = global[global.__NS__][__PN__] || factory(global['isNode'], global['setStyle']);
    else
        global[__PN__] = global[__PN__] || factory(global['isNode'], global['setStyle']);

})( window ? window : this, 'css', function(isNode, setStyle) {
    return function(node, styles) {
        if (isNode(node) && typeof styles === 'object') {
            for (var s in styles) {
                setStyle(node, s, styles[s]);
            }
        }
    };
});
