/**
 * @file isArray.js
 * @param o
 * @returns {boolean}
 */
module.exports = function (o) {
    return Object.prototype.toString.call(o) === '[object Array]';
};