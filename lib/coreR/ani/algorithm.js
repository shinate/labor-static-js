/**
 * tween动画运算库
 * @id STK.core.ani.algorthm
 * @author Robin Young | yonglin@staff.sina.com.cn
 */
STK.register('core.ani.algorithm', function($){
	
	var algorithm = {
		'linear' : function(t, b, c, d, s){
			return c * t / d + b;
		},
		
		'easeincubic' : function(t, b, c, d, s){
			return c * (t /= d) * t * t + b;
		},
		
		'easeoutcubic' : function(t, b, c, d, s){
			if ((t /= d / 2) < 1) {
				return c / 2 * t * t * t + b;
			}
			return c / 2 * ((t -= 2) * t * t + 2) + b;
		},
		
		'easeinoutcubic' : function(t, b, c, d, s){
			if (s == undefined) {
				s = 1.70158;
			}
			return c * (t /= d) * t * ((s + 1) * t - s) + b;
		},
		
		'easeinback' : function(t, b, c, d, s){
			if (s == undefined) {
				s = 1.70158;
			}
			return c * (t /= d) * t * ((s + 1) * t - s) + b;;
		},
		
		'easeoutback' : function(t, b, c, d, s){
			if (s == undefined) {
				s = 1.70158;
			}
			return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
		},
		
		'easeinoutback' : function(t, b, c, d, s){
			if (s == undefined) {
				s = 1.70158;
			}
			if ((t /= d / 2) < 1) {
				return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
			}
			return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
		}
	};
	return {
		/**
		 * 添加算法函数
		 * @method addAlgorithm
		 * @param {String} name
			算法名
		 * @param {Function} fn
			算法函数(开始状态，开始位置，当前时间，当前位置，偏移值，额外用户定义参数)
		 * @return {void}
		 * @example
			$.core.ani.algorithm.addAlgorithm('test',function(t, b, c, d, s){
				return c * t / d + b;
			});
		 */
		'addAlgorithm' : function(name, fn){
			if ( algorithm[name] ){
				throw '[core.ani.tweenValue] this algorithm :' + name + 'already exist';
			}
			algorithm[name] = fn;
		},
		
		/**
		 * 计算算法结果
		 * @method compute
		 * @param {String}	type
			动画类型[linear|easeincubic|easeoutcubic|easeinoutcubic|easeinback|easeoutbackeaseinoutback|<自定义>]
		 * @param {Number}	propStart
			开始位置
		 * @param {Number}	proDest
			总移动距离
		 * @param {Number}	timeNow
			当前时间（动画开始后）
		 * @param {Number}	timeDest
			每帧间隔时间
		 * @param {Number}	extra
			偏移值
		 * @param {Number}	params
			额外用户定义参数
		 * @return {Number}
		 * @example
			var res = $.core.ani.algorithm.compute('linear', 0, 100, 50, 500, 5, {});
		 */
		'compute' : function(type, propStart, proDest, timeNow, timeDest, extra, params){
			if ( typeof algorithm[type] !== 'function' ){
				throw '[core.ani.tweenValue] this algorithm :' + type + 'do not exist';
			}
			return algorithm[type](timeNow, propStart, proDest, timeDest,  extra, params);
		}
	};
});
