/**
 * Describe 判断对象类型
 * @id	STK.core.func.getType
 * @alias
 * @param {Object}
	需要判断类型的对象,可以是任意对象
 * @return {String}
	传入对象的类型,取值全部为小写
 * @author FlashSoft | fangchao@staff.sina.com.cn
 * @example
 * var type = $.core.func.getType("str");
 */
STK.register('core.func.getType', function($){
	return function(oObject){
		var _t;
		return ((_t = typeof(oObject)) == "object" ? oObject == null && "null" || Object.prototype.toString.call(oObject).slice(8, -1) : _t).toLowerCase();
	};
});
