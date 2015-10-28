(function(global, __PN__, factory) {
    /* CommonJS */
    if ( typeof require === 'function' && typeof module === 'object' && module && typeof exports === 'object' && exports)
        module['exports'] = (function() {
            var parseXML, xml2json;
            try {
                parseXML = require('../str/parseXML');
                xml2json = require('./xmlToJson');
            }
            catch(e) {
            }
            return factory(parseXML, xml2json);
        })();
    /* AMD */
    else if ( typeof define === 'function' && define['amd'])
        define(['../str/parseXML', './xmlToJson'], function(parseXML, xml2json) {
            return factory(parseXML, xml2json);
        });
    /* Global */
    else if (global.__NS__ && (typeof global[global.__NS__] === 'object' || typeof global[global.__NS__] === 'function') && global[global.__NS__])
        global[global.__NS__][__PN__] = global[global.__NS__][__PN__] || factory(global['parseXML'], global['xmlToJson']);
    else
        global[__PN__] = global[__PN__] || factory(global['parseXML'], global['xmlToJson']);

})( window ? window : this, 'xmlSToJson', function(parseXML, xml2json) {

    return function(xmlString) {
        return xml2json(parseXML(xmlString));
    };

});
