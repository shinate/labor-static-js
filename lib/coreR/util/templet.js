/**
 *	已经废弃，不建议使用
 *	@id STK.core.util.templet
 *	@author Robin Young |yonglin@staff.sina.com.cn
 */
STK.register('core.util.templet', function($){
	return function(template, data){
		return template.replace(/#\{(.+?)\}/ig, function(){
			var key = arguments[1].replace(/\s/ig, '');
			var ret = arguments[0];
			var list = key.split('||');
			for (var i = 0, len = list.length; i < len; i += 1) {
				if (/^default:.*$/.test(list[i])) {
					ret = list[i].replace(/^default:/, '');
					break;
				}
				else 
					if (data[list[i]] !== undefined) {
						ret = data[list[i]];
						break;
					}
			}
			return ret;
		});
	};
});
