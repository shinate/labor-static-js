/**
 * Remove duplicate elements
 *
 * @id unique.js
 * @author shinate | shine.wangrs@gmail.com
 *
 * @param {Array} o
 * @return {Array}
 * @example
 * var list = ['a','b','c','a']
 * var unique(list) === ['a','b','c']
 */
var indexOf = require('./indexOf');
var isArray = require('./isArray');

module.exports = function (o) {
    if (!isArray(o)) {
        throw 'the unique function needs an array as first parameter';
    }
    var result = [];
    for (var i = 0, len = o.length; i < len; i += 1) {
        if (indexOf(o[i], result) === -1) {
            result.push(o[i]);
        }
    }
    return result;
};
