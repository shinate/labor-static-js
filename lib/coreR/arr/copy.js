/**
 * 复制数组
 * @id STK.core.arr.copy
 * @alias
 * @param {Array} o
 * @return {Array}
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * var li1 = [1,2,3]
 * var li2 = $.core.arr.copy(li1);
 * li2 === [1,2,3];
 * li2 !== li1;
 */
$Import('core.arr.isArray');
STK.register('core.arr.copy', function($){
	return function(o){
		if (!$.core.arr.isArray(o)) {
			throw 'the copy function needs an array as first parameter';
		}
		return o.slice(0);
	};
});
