/**
 * 获取一个隐藏iframe提交数据到通道
 * @id STK.core.io.getIframeTrans
 * @alias
 * @param {Object} spec
	{
		id : {String}//唯一标示
	}
 * @return {Object}
	{
		getId:{function}	//获取现有id
		destroy:{function}	//销毁通道
	}
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 */

$Import("core.obj.parseParam");
$Import("core.util.getUniqueKey");
$Import("core.util.templet");
$Import("core.util.hideContainer");

STK.register('core.io.getIframeTrans', function($){
	var TEMP = '<iframe id="#{id}" name="#{id}" height="0" width="0" frameborder="no"></iframe>';
	return function(spec){
		var box, conf, that;
		conf = $.core.obj.parseParam({
			'id' : 'STK_iframe_' + $.core.util.getUniqueKey()
		}, spec);
		that = {};
		
		box = $.C('DIV');
		box.innerHTML = $.core.util.templet(TEMP, conf);
		$.core.util.hideContainer.appendChild(box);
		
		that.getId = function(){
			return conf['id'];
		};
		
		that.destroy = function(){
			box.innerHTML = '';
			try{
				box.getElementsByTagName('iframe')[0].src = "about:blank";
			}catch(exp){
			
			}
			$.core.util.hideContainer.removeChild(box);
			box = null;
		};
		
		return that;
	};
});