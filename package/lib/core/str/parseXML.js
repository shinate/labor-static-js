(function(global, __PN__, factory) {
    /* CommonJS */
    if ( typeof require === 'function' && typeof module === 'object' && module && typeof exports === 'object' && exports)
        module['exports'] = factory(global);
    /* AMD */
    else if ( typeof define === 'function' && define['amd'])
        define(function() {
            return factory(global);
        });
    /* Global */
    else if (global.__NS__ && (typeof global[global.__NS__] === 'object' || typeof global[global.__NS__] === 'function') && global[global.__NS__])
        global[global.__NS__][__PN__] = global[global.__NS__][__PN__] || factory(global);
    else
        global[__PN__] = global[__PN__] || factory(global);

})( window ? window : this, 'parseXML', function(global) {

    return function(xml) {
        var dom = null;
        if (global.hasOwnProperty('DOMParser')) {
            try {
                dom = (new DOMParser()).parseFromString(xml, 'text/xml');
            }
            catch (e) {
                dom = null;
            }
        }
        else if (global.ActiveXObject) {
            try {
                dom = new ActiveXObject('Microsoft.XMLDOM');
                dom.async = false;
                if (!dom.loadXML(xml))// parse error ..
                    throw dom.parseError.reason + dom.parseError.srcText;
            }
            catch (e) {
                dom = null;
            }
        }
        else
            throw 'cannot parse xml string!';

        return dom;
    };
});
