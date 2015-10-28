/**
 * 清楚数组中到重复元素
 * @id STK.core.arr.unique
 * @alias
 * @param {Array} o
 * @return {Array}
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * var li1 = ['a','b','c','a']
 * var li2 = unique(li1);
 * li2 === ['a','b','c']
 */

var $isArray = require('isArray');
var $indexOf = require('indexOf');
module.exports = function(o) {
		if (!$isArray(o)) {
			throw 'the unique function needs an array as first parameter';
		}
		var result = [];
		for (var i = 0, len = o.length; i < len; i += 1) {
			if ($indexOf(o[i], result) === -1) {
				result.push(o[i]);
			}
		}
		return result;
};