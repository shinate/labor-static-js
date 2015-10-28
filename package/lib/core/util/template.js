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

})( window ? window : this, 'template', function() {
    return function(template, data) {
        return template.replace(/#\{(.+?)\}/ig, function() {
            var key = arguments[1].replace(/\s/ig, '');
            var ret = arguments[0];
            var list = key.split('||');
            for (var i = 0, len = list.length; i < len; i += 1) {
                if (/^default:.*$/.test(list[i])) {
                    ret = list[i].replace(/^default:/, '');
                    break;
                }
                else if (data[list[i]] !== undefined) {
                    ret = data[list[i]];
                    break;
                }
            }
            return ret;
        });
    };
});
