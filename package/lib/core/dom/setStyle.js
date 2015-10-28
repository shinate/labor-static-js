/**
 * set Elements style
 * @id STK.core.dom.setStyle
 * @alias STK.core.dom.setStyle
 * @param {Element} node
 * @param {String} property
 * @param {String} val
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * STK.core.dom.setStyle($.E('test'),'display','none');
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

})( window ? window : this, 'setStyle', function() {

    function supportFilters() {
        if ('y' in supportFilters) {
            return supportFilters.y;
        }
        return supportFilters.y = ('filters' in document.createElement('div'));
    }

    return function(node, property, val) {
        if (supportFilters()) {
            switch (property) {
                case "opacity":
                    node.style.filter = "alpha(opacity=" + (val * 100) + ")";
                    if (!node.currentStyle || !node.currentStyle.hasLayout) {
                        node.style.zoom = 1;
                    }
                    break;
                case "float":
                    property = "styleFloat";
                default:
                    node.style[property] = val;
            }
        }
        else {
            if (property == "float") {
                property = "cssFloat";
            }
            node.style[property] = val;
        }
    };
});
