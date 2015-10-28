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

})( window ? window : this, 'log', function(global) {
    return function() {
        window['console'] && window.console.log.apply(window.console, arguments);
    };
});