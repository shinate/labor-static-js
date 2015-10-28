/**
 * 返回在数组中的索引
 * @id STK.core.arr.indexOf
 * @alias
 * @param {String | Number} oElement 
	需要查找的对象
 * @param {Array} aSource 
	源数组
 * @return {Number} 
	在数组中的索引,-1为未找到
 * @author FlashSoft | fangchao@staff.sina.com.cn
 * @example
 * var a = 2, b=[3,2,1];
 * alert($.core.arr.indexOf(a,b));
 */
STK.register('core.arr.indexOf', function($){
	return function(oElement, aSource){
		if (aSource.indexOf) {
			return aSource.indexOf(oElement);
		}
		for (var i = 0, len = aSource.length; i < len; i++) {
			if (aSource[i] === oElement) {
				return i;
			}
		}
		return -1;
	};
});
