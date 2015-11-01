/**
 * Detecting whether an array
 *
 * @file isArray.js
 * @author shinate | shine.wangrs@gmail.com
 *
 * @param o
 * @returns {boolean}
 */
module.exports = function (o) {
    return Object.prototype.toString.call(o) === '[object Array]';
};