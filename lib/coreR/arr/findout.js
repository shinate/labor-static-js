/**
 * 查找指定元素在数组内的索引
 * @id STK.core.arr.findout
 * @param {Array} o
 * @param {String|Number|Object|Boolean|Function} value
 * @return {Array}
	索引值的数组
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * var li1 = ['a','b','c','a']
 * var li2 = $.core.arr.findout(li1,'a');
 */

$Import('core.arr.isArray');
STK.register('core.arr.findout', function($){
	return function(o, value){
		if (!$.core.arr.isArray(o)) {
			throw 'the findout function needs an array as first parameter';
		}
		var k = [];
		for (var i = 0, len = o.length; i < len; i += 1) {
			if (o[i] === value) {
				k.push(i);
			}
		}
		return k;
	};
});
