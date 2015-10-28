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

})( window ? window : this, 'randColor', function() {

    var F = 0, T = 255;

    var int2hex = function(num) {
        return (num < 16 ? '0' : '') + num.toString(16);
    };

    var randomCode = function() {
        return Math.floor((Math.random() * 1000 % (T - F)) + F);
    };

    module.exports = function(from, to) {
        F = from == null ? F : from;
        T = to == null ? T : to;

        return '#' + [int2hex(randomCode()), int2hex(randomCode()), int2hex(randomCode())].join('');
    };
});
