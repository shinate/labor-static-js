/**
 *
 * @param {Number} Y 年
 * @param {Number} M 月
 * @param {Number} D 日
 * @param {Number} H 时
 * @param {Number} I 分
 * @param {Number} S 秒
 * @param {Number} V 毫秒
 */

(function (global, __PN__, factory) {
    /* CommonJS */
    if ( typeof require === 'function' && typeof module === 'object' && module && typeof exports === 'object' && exports)
        module['exports'] = factory();
    /* AMD */
    else if ( typeof define === 'function' && define['amd'])
        define(function () {
            return factory();
        });
    /* Global */
    else if (global.__NS__ && (typeof global[global.__NS__] === 'object' || typeof global[global.__NS__] === 'function') && global[global.__NS__])
        global[global.__NS__][__PN__] = global[global.__NS__][__PN__] || factory();
    else
        global[__PN__] = global[__PN__] || factory();

})( window ? window : this, 'browser', function () {

    return function (Y, M, D, H, I, S, V) {
        Y = Y || 0, M = M || 1, D = D || 0, H = H || 0, I = I || 0, S = S || 0, V = V || 0;
        V > 1000 && ( V = 0);
        var DH = new Date (0);
        DH.setFullYear(Y), DH.setMonth(M - 1), DH.setDate(D), DH.setHours(H), DH.setMinutes(I), DH.setSeconds(S), DH.setMilliseconds(V);
        return DH;
    };
}); 