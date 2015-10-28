/**
 * 遍历数组
 * @id STK.core.arr.foreach
 * @alias STK.foreach
 * @param {Array} o
 * @param {Function} insp
	function(value,index){}
	函数到第一个值参数是数组的值，第二个参数是索引，函数如果返回false会阻断遍历，函数的返回值进入foreach的返回数组
 * @return {Array}
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * var li1 = [1,2,3,4]
 * var li2 = $.core.arr.foreach(li1,function(v,i){return v + i});
 */

$Import('core.arr.isArray');
STK.register('core.arr.foreach', function($){
	
	var arrForeach = function(o, insp){
		var r = [];
		for (var i = 0, len = o.length; i < len; i += 1) {
			var x = insp(o[i], i);
			if (x === false){
				break;
			} else if (x !== null) {
				r[i] = x;
			}
		}
		return r;
	};
	
	var objForeach = function(o, insp){
		var r = {};
		for (var k in o) {
			var x = insp(o[k], k);
			if (x === false){
				break;
			} else if (x !== null) {
				r[k] = x;
			}
		}
		return r;
	};
	return function(o, insp){
		if ($.core.arr.isArray(o) || (o.length && o[0] !== undefined)) {
			return arrForeach(o, insp);
		} else if (typeof o === 'object') {
			return objForeach(o, insp);
		}
		return null;
	};
});
