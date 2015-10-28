/**
 * Describe 动画运算
 * @id	STK.core.ani.tweenArche
 * @alias
 * @param {Function} tween
		运算执行函数(以当前帧计算结果为参数)
 * @param {Object} spec
		{
			'animationType' : 'linear',		//动画类型
			'distance' : 1,					//动作距离
			'duration' : 500,				//持续时间(毫秒)
			'callback' : function(){},		//执行后的返回函数
			'algorithmParams' : {},			//动画算法所需要的额外参数
			'extra' : 5,					//基本动画需要的偏移量信息
			'delay' : 25					//动画间隔时间
		}
 * @return {Object}
		{
			getStatus	: {Function}//获取当点状态
			play		: {Function}//播放动画
			stop		: {Function}//停止动画
			resume		: {Function}//继续播放
			pause		: {Function}//暂停动画
			destroy		: {Function}//销毁对象
		}
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 */
$Import("core.ani.algorithm");
$Import('core.func.empty');
$Import('core.obj.parseParam');
STK.register('core.ani.tweenArche', function($){
	
	return function(tween, spec){
		var conf, that, currTime, startTime, currValue, timer, pauseTime, status;
		that = {};
		conf = $.core.obj.parseParam({
			'animationType' : 'linear',
			'distance' : 1,
			'duration' : 500,
			'callback' : $.core.func.empty,
			'algorithmParams' : {},
			'extra' : 5,
			'delay' : 25
		}, spec);
		
		var onTween = function(){
			currTime = (+new Date() - startTime);
			if(currTime < conf['duration']){
				currValue = $.core.ani.algorithm.compute(
					conf['animationType'],
					0,
					conf['distance'],
					currTime,
					conf['duration'],
					conf['extra'],
					conf['algorithmParams']
				);
				tween(currValue);
				
				timer = setTimeout(onTween, conf['delay']);
			}else{
				status = 'stop';
				conf['callback']();
			}
		};
		
		status = 'stop';
		/**
		 * Describe 获取当点状态
		 * @method getStatus
		 * @return {String}[stop|play|pause]
		 * @example
		 */
		that.getStatus = function(){
			return status;
		};
		/**
		 * Describe 播放动画
		 * @method play
		 * @example 
		 */
		that.play = function(){
			startTime = +new Date();
			currValue = null;
			onTween();
			status = 'play';
			return that;
		};
		/**
		 * Describe 停止动画
		 * @method stop
		 * @example 
		 */
		that.stop = function(){
			clearTimeout(timer);
			status = 'stop';
			return that;
		};
		/**
		 * Describe 继续播放
		 * @method resume
		 * @example 
		 */
		that.resume = function(){
			if(pauseTime){
				startTime += (+new Date() - pauseTime);
				onTween();
			}
			return that;
		};
		/**
		 * Describe 暂停动画
		 * @method pause
		 * @example 
		 */
		that.pause = function(){
			clearTimeout(timer);
			pauseTime = +new Date();
			status = 'pause';
			return that;
		};
		/**
		 * Describe 销毁对象
		 * @method destroy
		 * @example 
		 */
		that.destroy = function(){
			clearTimeout(timer);
			pauseTime = 0;
			status = 'stop';
		};
		return that;
	};
});
