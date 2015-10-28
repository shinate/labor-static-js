/**
 * 判断对象是否为数组
 * @id STK.core.arr.isArray
 * @alias STK.isArray
 * @param {Array} o
 * @return {Boolean}
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * var li1 = [1,2,3]
 * var bl2 = $.core.arr.isArray(li1);
 * bl2 === TRUE
 */
STK.register('core.arr.isArray', function($){
	return function(o){
		return Object.prototype.toString.call(o) === '[object Array]';
	};
});
