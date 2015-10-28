/**
 * 多语言引擎
 * @id STK.core.util.language
 * @alias STK.core.util.language
 * @param {string} template 要处理语言变换的字符串
 * @param {object} data 语言包的对照对象
 * @param {string} replaceValue 对template中出现的%s做替换的值 。。。
 * @return {string} ret 变换后的字符串
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * STK.core.util.language('#L{bei%sjing}欢迎你',{'bei%sjing':'北%s京'}, '-') === '北-京欢迎你';
 */

STK.register('core.util.language', function($){
	return function(template, data){
		var rep = [];
		for(var i = 2, len = arguments.length; i < len; i += 1){
			rep.push(arguments[i]);
		}
		return template.replace(/#L\{((.*?)(?:[^\\]))\}/ig, function(){
			var key = arguments[1];
			var ret;
			if (data && data[key] !== undefined) {
				ret = data[key];
			}else{
				ret = key;
			}
			if(rep.length){
				ret = ret.replace(/(\%s)/ig, function(){
					var pic = rep.shift();
					if(pic !== undefined){
						return pic;
					}else{
						return arguments[0];
					}
				});
			}
			return ret;
		});
	};
});