(function( global, factory ) {

	if (
		typeof module === "object" 
		&& typeof module.exports === "object"
	){
		module.exports = factory( global );
	} else {
		global.Charon = factory( global );
	}

// Pass this if window is not defined yet
}(typeof window !== "undefined" ? window : this, function( window ) {

var Charon = {};

Charon.extend = require('/lib/core/obj/extend');

Charon.log = require('/lib/core/util/log');

Charon.add = function(NS, func){
	var NSlist = NS.split('.');
	var N = null;
	var S = Charon;
	while(N = NSlist.shift()){
		if(NSlist.length){
			if(S[N] === undefined){
				S[N] = {};
			}
			S = S[N];
		} else {
			if(S[N] === undefined){
				try{
					S[N] = func(Charon);
					return true;
				} catch(exp) {
					setTimeout(function(){
						throw exp;
					}, 0);
				}
			}
		}
	}
};

Charon.isArray = require('/lib/core/arr/isArray');
Charon.indexOf = require('/lib/core/arr/indexOf');
Charon.inArray = require('/lib/core/arr/inArray');

Charon.uniqueKey = (function() {
	var _loadTime = +new Date() + '', _i = 1;
	return function() {
		return _loadTime + (_i++);
	};
})();

/**
 * 将要过河的人
 */
Charon.invade = (function($){
	
	return function(OB, method, opts){
		
		var L = [[],[]];
		
		var cache = {
			'conf'  : {
				'delay' : -1
			}
		};
		
		var it = {
			/**
			 * 初始化
			 */
			'init' : function(){
				cache.func = OB[method];
				cache.index = method;
				it.option(opts);
			}
			/**
			 * 执行方法
			 * 并触发全部后续
			 */
			,'fire' : function(){
				
				var args = Array.prototype.slice.call(arguments);
				
				var fire = function(){
					
					//执行
					cache.func.apply(null, args);
					
					for(var i = 0; i < L[1].length; i++){
						OB[L[1][i]].spark(cache.index, args);
					}
				};
				
				try {
					if(cache.conf.delay > -1){
						setTimeout(fire, cache.conf.delay);
					} else {
						fire();
					}
				} catch(exp) {}
			}
			/**
			 * 异步触发
			 * 若有依赖，则不可触发
			 */
			,'spark' : function(dep, args){
				if(it.perish(dep))
					return;
				
				it.fire.apply(null, args);
			}
			/**
			 * 注册依赖
			 * 判断是否含有依赖
			 */
			,'depend' : function(key){
				if(key === undefined){
					return L[0].length > 0;
				} else {
					L[0].push(key);
				}
			}
			/**
			 * 注册触发
			 * 判断是否含有触发
			 */
			,'trigger' : function(key){
				if(key === undefined){
					return L[1].length > 0;
				} else {
					L[1].push(key);
				}
			}
			/**
			 * 过滤器
			 * dep若在依赖中，则去除
			 * 
			 * 返回依赖剩余个数
			 */
			,'perish' : function(dep){
				if(L[0].length > 0 && dep !== undefined && typeof dep === 'number'){
					L[0].splice($.indexOf(dep, L[0]), 1);
				}
				return L[0].length > 0;
			}
			/**
			 * 原方法
			 */
			,'original' : function(){
				return cache.func;
			}
			/**
			 * 配置项
			 */
			,'option' : function(opts){
				if(opts === undefined){
					return cache.conf;
				} else {
					cache.conf = $.extend({}, cache.conf, opts || {});
				}
			}
		};
		
		var self = {
			'option'   : it.option
			,'fire'    : it.fire
			,'depend'  : it.depend
			,'trigger' : it.trigger
			,'spark'   : it.spark
		};
		
		it.init();
		
		return self;	
	};
})(Charon);

/**
 * 一条船
 */
Charon.boat = (function($){
	
	return function(){
		
		var $RL = {}, $TL = [];
		
		var it = {
			'board' : function(){
				var args = Array.prototype.slice.call(arguments);
				var func = args.shift();
				
				if(func === undefined || $RL.hasOwnProperty(it.cacheKey(func))){
					return;
				}
				
				$TL.push(func);
				
				var pos = $TL.length - 1
					,depend = null
					,opts = {}
					,arg;
				
				while(args.length){
					arg = args.shift();
					if(arg !== undefined){
						if(typeof arg === 'object' && !$.isArray(arg)){
							opts = arg;
						} else {
							depend = arg;
						}
					}
				}
				
				//use for index
				$RL[it.cacheKey(func)] = pos;
				
				$TL[pos] = $.invade($TL, pos, opts);
				it.depend(pos, depend);
				
			}
			,'depend' : function(res, dep){
				var depPos
					,i
					,resPos = it.get.index(res);
				
				if(resPos > -1){
					dep = [].concat(dep);
					
					for(i=0;i<dep.length;i++){
						depPos = it.get.index(dep[i]);
						if(depPos > -1){
							$TL[resPos].depend(depPos);
							$TL[depPos].trigger(resPos);
						}
					}
				}
			}
			,'cacheKey' : function(func){
				return (typeof func) + '::' + func;
			}
			,'get' : {
				'index' : function(res){
					if(typeof res !== 'number'){
						res = $RL[it.cacheKey(res)];
					}
					return res !== undefined && $TL.hasOwnProperty(res) ? res : -1;
				}
			}
			,'res' : function(res){
				var pos = it.get.index(res);
				return pos > -1 ? $TL[pos] : null;
			}
			,'set' : {
				'option' : function(res, opts){
					var p = it.get.index(res);
					if(p > -1){
						$TL[p].option(opts);
					}
				}
			}
			,'passengers' : function(){
				return $TL;
			}
			,'sail' : function(){
				
				var args = Array.prototype.slice.call(arguments)
				,CUR = -1
				,delay
				,findNextSync = function(){
					while(++CUR < $TL.length){
						if(!$TL[CUR].depend()){
							return true;
						}
					} 
					//End
					return false;
				};
				
				var fire = function(){
					
					if( findNextSync() ){
						delay = $TL[CUR].option().delay;
						try {
							if(delay > -1){
								setTimeout(function(){
									$TL[CUR].fire.apply(null, args);
									fire();
								}, delay);
							} else {
								$TL[CUR].fire.apply(null, args);
								fire();
							}
						} catch(exp) {
							$.log('Charon.boat.sail :: function execute error.');
						}
	
					} else {
						//it.destroy();
					}
				};
				
				fire();
				
			}
			,'destroy' : function(){
				it = self = $RL = $TL = null;
			}
		};
		
		/**
		 * 出口
		 * 
		 * 注册链式调用
		 */
		var self = {};
		self.board = function(){
			it.board.apply(null, arguments);
			return this;
		}
		,self.add = self.board
		,self.depend = function(){
			it.depend.apply(null, arguments);
			return this;
		}
		,self.option = function(){
			it.set.option.apply(null, arguments);
			return this;
		}
		,self.sail = it.sail
		,self.res = it.res
		,self.all = it.passengers;
		
		return self;
	};
})(Charon);

/**
 * Charon.ferry
 * 船的调度者
 */
Charon.ferry = (function($){
	/**
	 * All in one LIST
	 */
	var LIST = {};
	
	return function(tName){
		
		if(tName === undefined){
			tName = $.uniqueKey();
		}
		
		if(LIST.hasOwnProperty(tName)){
			return LIST[tName];
		} else {
			return LIST[tName] = $.boat();
		}
	};
})(Charon);

/**
 * Charon.chain
 * 一条水路
 */
Charon.chain = (function($){
	
	var $CHS = {};
	
	var chain = function(){
		
		var cache = {};
		
		return {
			'register' : function(act, func){
				if(!cache.hasOwnProperty(act)){
					cache[act] = $.boat();
				}
				cache[act].board(func, {delay:0});
				return this;
			}
			,'fire' : function(act, args){
				if(cache.hasOwnProperty(act)){
					cache[act].sail(args);
				} else {
					$.log('Charon.chain.fire :: action dose not exist.');
				}
			}
		};
	};
	
	return function(cName){				
		if(!$CHS.hasOwnProperty(cName)){
			$CHS[cName] = chain();
		}
		return $CHS[cName];
	};
})(Charon);

return Charon;

}));
