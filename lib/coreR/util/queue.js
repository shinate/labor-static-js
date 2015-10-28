/**
 *	已经废弃，不要使用
 *	@id STK.core.util.queue
 *	@author Robin Young |yonglin@staff.sina.com.cn
 */
STK.register('core.util.queue', function($){
	return function(){
		var that = {};
		var que = [];
		that.add = function(item){
			que.push(item);
			return that;
		};
		that.get = function(){
			if (que.length > 0) {
				return que.shift();
			}
			else {
				return false;
			}
		};
		return that;
	};
});
