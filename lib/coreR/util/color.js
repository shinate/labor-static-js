/**
 * Describe 颜色管理对象
 * @id	STK.core.util.color
 * @alias
 * @param {String} color
	颜色的RGBA #fff #ffffff rgb(255,255,255) rgba(255,255,255,255) 写法都支持
 * @return {Object}
	{
		getR:{Function}
		getG:{Function}
		getB:{Function}
		getA:{Function}
	}
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 */
$Import('core.arr.foreach');
STK.register('core.util.color',function($){
	
	
	var analysisHash = /^#([a-fA-F0-9]{3,8})$/;
	var testRGBorRGBA = /^rgb[a]?\s*\((\s*([0-9]{1,3})\s*,){2,3}(\s*([0-9]{1,3})\s*)\)$/;
	var analysisRGBorRGBA = /([0-9]{1,3})/ig;
	var splitRGBorRGBA = /([a-fA-F0-9]{2})/ig;
	var foreach = $.core.arr.foreach;
	
	var analysis = function(str){
		var ret = [];
		var list = [];
		if(analysisHash.test(str)){
			list = str.match(analysisHash);
			if(list[1].length <= 4){
				ret = foreach(list[1].split(''),function(value, index){
					return parseInt(value + value, 16);
				});
			} else if( list[1].length <= 8) {
				ret = foreach(list[1].match(splitRGBorRGBA),function(value, index){
					return parseInt(value, 16);
				});
			}
			return ret;
		}
		if(testRGBorRGBA.test(str)){
			list = str.match(analysisRGBorRGBA);
			ret = foreach(list, function(value, index){
				return parseInt(value, 10);
			});
			return ret;
		}
		return false;
	};
	
	return function(colorStr, spec){
		var ret = analysis(colorStr);
		if(!ret){
			return false;
		}
		var that = {};
		/**
		 * Describe 获取red
		 * @method getR
		 * @return {Number}
		 * @example
		 */
		that.getR = function(){
			return ret[0];
		};
		/**
		 * Describe 获取green
		 * @method getG
		 * @return {Number}
		 * @example
		 */
		that.getG = function(){
			return ret[1];
		};
		/**
		 * Describe 获取blue
		 * @method getB
		 * @return {Number}
		 * @example
		 */
		that.getB = function(){
			return ret[2];
		};
		/**
		 * Describe 获取alpha
		 * @method getA
		 * @return {Number}
		 * @example
		 */
		that.getA = function(){
			return ret[3];
		};
		return that;
	};
});