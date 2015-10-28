/**
 * 判断一个元素是否在数组里
 * @id STK.core.arr.inArray
 * @alias
 * @param {String | Number} oElement 
	需要查找的对象
 * @param {Array} aSource 
	源数组
 * @return {Boolean}
 * @author FlashSoft | fangchao@staff.sina.com.cn
 * @example
 * var a = 2,b=[3,2,1]
 * alert($.core.arr.inArray(a,b));
 */
$Import('core.arr.indexOf');
STK.register('core.arr.inArray', function($){
	return function(oElement, aSource){
		return $.core.arr.indexOf(oElement, aSource) > -1;
	};
});
