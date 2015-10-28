if(!STK){
	var STK = (function(){
		var pkgs = {};
		var main = 'theia';
		var logList = [];
		var logMax = 200;
		var logFunction;
		
		pkgs[main] = {
			IE : /msie/i.test(navigator.userAgent),
			E : function(id) {
				if (typeof id === 'string') {
					return document.getElementById(id);
				} else {
					return id;
				}
			},
			C : function(tagName) {
				var dom;
				tagName = tagName.toUpperCase();
				if (tagName == 'TEXT') {
					dom = document.createTextNode('');
				} else if (tagName == 'BUFFER') {
					dom = document.createDocumentFragment();
				} else {
					dom = document.createElement(tagName);
				}
				return dom;
			},
			/**
			 * 日志
			 * 约定日志输出的格式: [log列表, log类型（log/error）, log时间, log信息, log栈]
			 * @method log
			 * @static
			 * @author wangzheng4@Finrila
			 */
			log : function() {
				var logError,
					args = arguments,
					l = args.length,
					logArray = [].slice.apply(args, [0, l]),
					logType = 'error',
					result;
					
				while (logArray[ --l ]) {
					if (logArray[l] instanceof Error) {
						logError = logArray.splice(l, 1)[0];
						break;
					}
				}
				
				if (!logError) {
					logError = new Error();
					logType = 'log';
				}
				
				result = [logArray, logType, new Date().getTime(), logError.message, logError.stack];
				
				if (logFunction) {
					try{
						logFunction.apply(null, result);
					}catch(exp){
						
					}
				} else {
					logList.length >= logMax && logList.shift();
					logList.push(result);
				}
			},
			/**
			 * 注册log方法的回调方法
			 * @method _regLogFn
			 * @static
			 * @param {Function} fn 回调方法
			 */
			_regLogFn : function(fn) {
				logFunction = fn;
			},
			/**
			 * 清空日志列表
			 * @method _clearLogList
			 * @static
			 * @return {Array} logList
			 */
			_clearLogList : function() {
				return logList.splice(0, logList.length);
			}
		};
		
		// var that = (function(o){
		// 			var F = function(){};
		// 			F.prototype = o;
		// 			return new F();
		// 		})(pkgs[main]);
		
		var that = pkgs[main];
		
		that.register = function(ns, maker, pkgName){
			if(!pkgName || typeof pkgName != 'string'){
				pkgName = main;
			}
			if(!pkgs[pkgName]){
				pkgs[pkgName] = {};
			}
			var pkg = pkgs[pkgName];
			var NSList = ns.split('.');
			var step = pkg;
			var k = null;
			while(k = NSList.shift()){
				if(NSList.length){
					if(step[k] === undefined){
						step[k] = {};
					}
					step = step[k];
				}else{
					if(step[k] === undefined){
						try{
							//夸包通讯机制
							if(pkgName && pkgName !== main){
								if(ns === 'core.util.listener'){
									step[k] = pkgs[main].core.util.listener;
									return true;
								}
								if(ns === 'core.util.connect'){
									step[k] = pkgs[main].core.util.connect;
									return true;
								}
							}
							step[k] = maker(pkg);//pkg
							return true;
						}catch(exp){
							setTimeout(function(){
								console.log(exp);
							}, 0);
						}
					}
				}
			}
			return false;
		};
		
		that.unRegister = function(ns, pkgName){
			if(!pkgName || typeof pkgName != 'string'){
				pkgName = main;
			}
			var pkg = pkgs[pkgName];
			var NSList = ns.split('.');
			var step = pkg;
			var k = null;
			while(k = NSList.shift()){
				if(NSList.length){
					if(step[k] === undefined){
						return false;
					}
					step = step[k];
				}else{
					if(step[k] !== undefined){
						delete step[k];
						return true;
					}
				}
			}
			return false;
		};
		
		//STK.regShort
		that.regShort = function (sname, sfun) {
			if (that[sname] !== undefined) {
				throw '[' + sname + '] : short : has been register';
			}
			that[sname] = sfun;
		};
		
		that.shortRegister = function(ns, shortName, pkgName){
			if(!pkgName || typeof pkgName != 'string'){
				pkgName = main;
			}
			var pkg = pkgs[pkgName];
			var NSList = ns.split('.');
			if(!shortName){
				return false;
			}
			if(pkg[shortName]){
				return false;
			}
			var step = pkg;
			var k = null;
			while(k = NSList.shift()){
				if(NSList.length){
					if(step[k] === undefined){
						return false;
					}
					step = step[k];
				}else{
					if(step[k] !== undefined){
						if(pkg[shortName]){
							return false;
						}
						pkg[shortName] = step[k];
						return true;
					}
				}
			}
			return false;
		};
		
		that.getPKG = function(pkgName){
			if(!pkgName || typeof pkgName != 'string'){
				pkgName = main;
			}
			return pkgs[pkgName];
		};
		return that;
	})();
}