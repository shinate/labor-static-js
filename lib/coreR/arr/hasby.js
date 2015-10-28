/**
 * 查找数组中符合规则到元素
 * @id STK.core.arr.hasby
 * @alias
 * @param {Array} o
 * @param {Function} insp
	函数到第一个值参数是数组的值，第二个参数是索引，函数返回true这个值会进入hasby的返回数组，返回false则相反。
 * @return {Array}
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * var li1 = ['a','b','c','ab']
 * var li2 = $.core.arr.hasby(li1,function(v,i){return (v.indexOf('a') !== -1)});
 * li2 === [0,3]
 */

$Import('core.arr.isArray');
STK.register('core.arr.hasby', function($){
	return function(o, insp){
		if (!$.core.arr.isArray(o)) {
			throw 'the hasBy function needs an array as first parameter';
		}
		var k = [];
		for (var i = 0, len = o.length; i < len; i += 1) {
			if (insp(o[i], i)) {
				k.push(i);
			}
		}
		return k;
	};
});
