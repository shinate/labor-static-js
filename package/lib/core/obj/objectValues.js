(function(global, __PN__, factory) {
    /* CommonJS */
    if ( typeof require === 'function' && typeof module === 'object' && module && typeof exports === 'object' && exports)
        module['exports'] = factory;
    /* AMD */
    else if ( typeof define === 'function' && define['amd'])
        define(factory);
    /* Global */
    else if (global.__NS__ && (typeof global[global.__NS__] === 'object' || typeof global[global.__NS__] === 'function') && global[global.__NS__])
        global[global.__NS__][__PN__] = global[global.__NS__][__PN__] || factory;
    else
        global[__PN__] = global[__PN__] || factory;

})( window ? window : this, 'objectValues', function(o) {
    if ('[object Object]' !== Object.prototype.toString.call(o)) {
        throw 'Argument must be an object!';
    }
    var a = [];
    for (var i in o) {
        a.push(o[i]);
    }
    return a;
});
