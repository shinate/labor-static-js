/**
 * 查找指定元素在数组内的索引
 *
 * @file findout.js
 * @author shinate | shine.wangrs@gmail.com
 *
 * @param {Array} o
 * @param {String|Number|Object|Boolean|Function} value
 * @return {Array} 索引值的数组
 * @example
 * var li1 = ['a','b','c','a']
 * var li2 = NS.findout(li1,'a');
 */
module.exports = function (o, value) {
    if (!isArray(o)) {
        throw new TypeError('the findout function needs an array as first parameter');
    }
    var k = [];
    for (var i = 0, len = o.length; i < len; i += 1) {
        if (o[i] === value) {
            k.push(i);
        }
    }
    return k;
};