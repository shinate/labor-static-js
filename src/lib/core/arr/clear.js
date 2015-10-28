/**
 * 删除数组中的空数据(like undefined/null/empty string)
 * @file clear.js
 * @param {Array} o
 * @return {Array}
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * var li = NS.clear([1, 2, 3, undefined]);
 * li === [1,2,3];
 *
 * [ section ]{_default_a74b90fe5_}
 */
var findout = require('./findout');

module.exports = function (o) {
    if (!isArray(o)) {
        throw new TypeError('the clear function needs an array as first parameter');
    }
    var result = [];
    for (var i = 0, len = o.length; i < len; i += 1) {
        if (!(findout([undefined, null, ''], o[i]).length)) {
            result.push(o[i]);
        }
    }
    return result;
};
