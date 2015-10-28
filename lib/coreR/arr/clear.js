/**
 * 删除数组中的空数据(like undefined/null/empty string)
 * @id STK.core.arr.clear
 * @alias
 * @param {Array} o
 * @return {Array}
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * var li = $.core.arr.clear([1,2,3,undefined]);
 * li === [1,2,3];
 */
$Import('core.arr.isArray');
$Import('core.arr.findout');
STK.register('core.arr.clear', function($){
	return function(o){
		if (!$.core.arr.isArray(o)) {
			throw 'the clear function needs an array as first parameter';
		}
		var result = [];
		for (var i = 0, len = o.length; i < len; i += 1) {
			if (!($.core.arr.findout([undefined,null,''],o[i]).length)) {
				result.push(o[i]);
			}
		}
		return result;
	};
});
