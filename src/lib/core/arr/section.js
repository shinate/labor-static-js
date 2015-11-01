/**
 * Split an array
 *
 * @file section.js
 * @author shinate | shine.wangrs@gmail.com
 *
 * @param {array} a
 * @param {number} length
 * @returns {*}
 *
 * NS.section([1, 2, 3, 4, 5, 6, 7], 3) === [[1, 2, 3], [4, 5, 6], [7]]
 */
var isArray = require('./isArray');

module.exports = function (a, length) {
    if (!isArray(a)) {
        throw new TypeError('Parameter must be an array');
    }
    if (!a.length) {
        return a;
    }
    length = length || a.length;

    var o = [];
    for (var i = 0, len = Math.ceil(a.length / length); i < len; i++) {
        o.push(a.slice(i * length, (i + 1) * length));
    }
    return o;
};
