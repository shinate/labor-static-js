/**
 * 合并参数
 * @id STK.core.obj.isEmpty
 * @alias STK.core.obj.isEmpty
 * @param {Object} o
 * @param {boolean} isprototype 继承的属性是否也在检查之列
 * @return {Boolean} ret
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * STK.core.obj.isEmpty({}) === true;
 * STK.core.obj.isEmpty({'test':'test'}) === false;
 */
STK.register('core.obj.isEmpty',function($){
	return function(o,isprototype){
		for(var k in o){
			if(isprototype || o.hasOwnProperty(k)){
				return false;
			}
		}
		return true;
	};
});