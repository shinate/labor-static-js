/**
 * 自定义对象事件 注意：使用属性  __custEventKey__ 污染自定义对象
 * 事件添加或绑定前应该先定义事件，定义事件方法为 custEvent.define(obj, type)
 * 约定：事件处理函数的第一个参数为event对象其结构为：
 * 	{
 * 		type:"click",//{String}绑定时的自定义事件类型
 * 		data:{},//{Any}绑定时的扩展属性 可以是任意类型
 * 		preventDefault: Function,//阻止默认Function的执行
 *  }
 * @id STK.core.evt.custEvent
 * @author Finrila|wangzheng4@staff.sina.com.cn
 * @example
 * var a = {};
 * var f = function(event) {
 * 	console.log(event.data);
 * 	console.log(event.type);
 * 	console.log(event.obj);//触发事件的对象
 * 	console.log(arguments[1]);
 * };
 * STK.core.evt.custEvent.define(a, "click");
 * STK.core.evt.custEvent.add(a, "click", f,{aaa:0});
 * STK.core.evt.custEvent.fire(a, "click", 5);
 * STK.core.evt.custEvent.fire(a, "click", 33);
 * STK.core.evt.custEvent.remove(a, "click", f);
 * STK.core.evt.custEvent.fire(a, "click", 22);
 * STK.core.evt.custEvent.remove(a, "click");
 * STK.core.evt.custEvent.remove(a);
 * STK.core.evt.custEvent.undefine(a, "click");
 * STK.core.evt.custEvent.undefine(a);
 * 
 *  var a = {}, b = {};
	STK.custEvent.define(a, ['click', 'over']);
	STK.custEvent.add(a, 'click', function(){
	   console.log('click a 1');
	});
	STK.custEvent.add(a, 'click', function(event){
	   event.preventDefault();//
	   console.log('click a 2');
	});
	STK.custEvent.add(a, 'click', function(){
	   console.log('click a 3');
	});
	STK.custEvent.add(a, 'over', function(){
	   console.log('over a 1');
	});
	STK.custEvent.add(a, 'over', function(){
	   console.log('over a 3');
	});
	
	STK.custEvent.hook(a, b ,{click: 'click_', over:'over'});
	STK.custEvent.add(b, 'click_', function(){
	   console.log('click_ b 1');
	});
	STK.custEvent.add(b, 'click_', function(event){
	   event.preventDefault();
	
	   console.log('click_ b 2');
	});
	STK.custEvent.add(b, 'click_', function(){
	   console.log('click_ b 3');
	});
	STK.custEvent.add(b, 'over', function(){
	   console.log('over b 1');
	});
	STK.custEvent.add(b, 'over', function(){
	   console.log('over b 3');
	});
	STK.custEvent.fire(a, 'click', undefined, function() {
	console.log('fire a click');
	})
	STK.custEvent.fire(a, 'over', undefined, function() {
	console.log('fire a over');
	});
	STK.custEvent.unhook(a, b ,{click: 'click_', over:'over'});
	
 * @import STK.core.arr.isArray
 * @import STK.core.func.getType
 */

$Import("core.arr.isArray");
$Import("core.func.getType");

STK.register("core.evt.custEvent", function($) {
	
	var custEventAttribute = "__custEventKey__",
		custEventKey = 1,
		custEventCache = {},
		/**
		 * 从缓存中查找相关对象 
		 * 当已经定义时 
		 * 	有type时返回缓存中的列表 没有时返回缓存中的对象
		 * 没有定义时返回false
		 * @param {Object|number} obj 对象引用或获取的key
		 * @param {String} type 自定义事件名称
		 */
		findCache = function(obj, type) {
			var _key = (typeof obj == "number") ? obj : obj[custEventAttribute];
			return (_key && custEventCache[_key]) && {
				obj: (typeof type == "string" ? custEventCache[_key][type] : custEventCache[_key]),
				key: _key
			};
		};
	////
	//事件迁移相关
	var hookCache = {};//arr key -> {origtype-> {fn, desttype}}
	//
	var add = function(obj, type, fn, data, once) {
		if(obj && typeof type == "string" && fn) {
			var _cache = findCache(obj, type);
			if(!_cache || !_cache.obj) {
				throw "custEvent (" + type + ") is undefined !";
			}
			_cache.obj.push({fn: fn, data: data, once: once});
			return _cache.key;
		}
	};
	
	var fire = function(obj, type, args, defaultAction) {
		//事件默认行为阻止
		var preventDefaultFlag = true;
		var preventDefault = function() {
			preventDefaultFlag = false;
		};
		if(obj && typeof type == "string") {
			var _cache = findCache(obj, type), _obj;
			if (_cache && (_obj = _cache.obj)) {
				args = typeof args != 'undefined' && [].concat(args) || [];
				for(var i = _obj.length - 1; i > -1 && _obj[i]; i--) {
					var fn = _obj[i].fn;
					var isOnce = _obj[i].once;
					if(fn && fn.apply) {
						try{
							fn.apply(obj, [{obj: obj, type: type, data: _obj[i].data, preventDefault: preventDefault}].concat(args));
							if(isOnce){
								_obj.splice(i,1);
							}
						} catch(e) {
							$.log("[error][custEvent]" + e.message, e, e.stack);
						}
					}
				}
				
				
				if(preventDefaultFlag && $.core.func.getType(defaultAction) === 'function') {
					defaultAction();
				}
				return _cache.key;
			}
		}
	};
	
	var that = {
		/**
		 * 对象自定义事件的定义 未定义的事件不得绑定
		 * @method define
		 * @static
		 * @param {Object|number} obj 对象引用或获取的下标(key); 必选 
		 * @param {String|Array} type 自定义事件名称; 必选
		 * @return {number} key 下标
		 */
		define: function(obj, type) {
			if(obj && type) {
				var _key = (typeof obj == "number") ? obj : obj[custEventAttribute] || (obj[custEventAttribute] = custEventKey++),
					_cache = custEventCache[_key] || (custEventCache[_key] = {});
				type = [].concat(type);
				for(var i = 0; i < type.length; i++) {
					_cache[type[i]] || (_cache[type[i]] = []);
				}
				return _key;
			}
		},
		
		/**
		 * 对象自定义事件的取消定义 
		 * 当对象的所有事件定义都被取消时 删除对对象的引用
		 * @method define
		 * @static
		 * @param {Object|number} obj 对象引用或获取的(key); 必选
		 * @param {String} type 自定义事件名称; 可选 不填可取消所有事件的定义
		 */
		undefine: function(obj, type) {
			if (obj) {
				var _key = (typeof obj == "number") ? obj : obj[custEventAttribute];
				if (_key && custEventCache[_key]) {
					if (type) {
						type = [].concat(type);
						for(var i = 0; i < type.length; i++) {
							if (type[i] in custEventCache[_key]) delete custEventCache[_key][type[i]];
						}
					} else {
						delete custEventCache[_key];
					}
				}
			}
		},
		
		/**
		 * 事件添加或绑定
		 * @method add
		 * @static
		 * @param {Object|number} obj 对象引用或获取的(key); 必选
		 * @param {String} type 自定义事件名称; 必选
		 * @param {Function} fn 事件处理方法; 必选
		 * @param {Any} data 扩展数据任意类型; 可选
		 * @return {number} key 下标
		 */
		add: function(obj, type, fn, data) {
			return add(obj, type, fn, data, false);
		},
		/**
		 * 单次事件绑定
		 * @method once
		 * @static
		 * @param {Object|number} obj 对象引用或获取的(key); 必选
		 * @param {String} type 自定义事件名称; 必选
		 * @param {Function} fn 事件处理方法; 必选
		 * @param {Any} data 扩展数据任意类型; 可选
		 * @return {number} key 下标
		 */
		once: function(obj, type, fn, data) {
			return add(obj, type, fn, data, true);
		},
		/**
		 * 事件删除或解绑
		 * @method remove
		 * @static
		 * @param {Object|number} obj 对象引用或获取的(key); 必选
		 * @param {String} type 自定义事件名称; 可选; 为空时删除对象下的所有事件绑定
		 * @param {Function} fn 事件处理方法; 可选; 为空且type不为空时 删除对象下type事件相关的所有处理方法
		 * @return {number} key 下标
		 */
		remove: function(obj, type, fn) {
			if (obj) {
				var _cache = findCache(obj, type), _obj, index;
				if (_cache && (_obj = _cache.obj)) {
					if ($.core.arr.isArray(_obj)) {
						if (fn) {
							//for (var i = 0; i < _obj.length && _obj[i].fn !== fn; i++);
							var i = 0;
							while(_obj[i]) {
								if(_obj[i].fn === fn) {
									break;
								}
								i++;
							}
							_obj.splice(i, 1);
						} else {
							_obj.splice(0, _obj.length);
						}
					} else {
						for (var i in _obj) {
							_obj[i] = [];
						}
					}
					return _cache.key;
				}
			}
		},
		
		/**
		 * 事件触发
		 * @method fire
		 * @static
		 * @param {Object|number} obj 对象引用或获取的(key); 必选
		 * @param {String} type 自定义事件名称; 必选
		 * @param {Any|Array} args 参数数组或单个的其他数据; 可选
		 * @param {Function} defaultAction 触发事件列表结束后的默认Function; 可选 注：当args不需要时请用undefined/null填充,以保证该参数为第四个参数
		 * @return {number} key 下标
		 */
		fire: function(obj, type, args, defaultAction) {
			return fire(obj, type, args, defaultAction);
		},
		/**
		 * 事件由源对象迁移到目标对象
		 * @method hook
		 * @static
		 * @param {Object} orig 源对象
		 * @param {Object} dest 目标对象
		 * @param {Object} typeMap 事件名称对照表
		 * {
		 * 	源事件名->目标事件名
		 * }
		 */
		hook: function(orig, dest, typeMap) {
			if(!orig || !dest || !typeMap) {
				return;
			}
			var destTypes = [],
				origKey = orig[custEventAttribute],
				origKeyCache = origKey && custEventCache[origKey],
				origTypeCache,
				destKey = dest[custEventAttribute] || (dest[custEventAttribute] = custEventKey++),
				keyHookCache;
			if(origKeyCache) {
				keyHookCache = hookCache[origKey +'_'+ destKey] || (hookCache[origKey +'_'+ destKey] = {});
				var fn = function(event) {
					var preventDefaultFlag = true;
					fire(dest, keyHookCache[event.type].type, Array.prototype.slice.apply(arguments, [1, arguments.length]), function() {
						preventDefaultFlag = false
					});
					preventDefaultFlag && event.preventDefault();
				};
				for(var origType in typeMap) {
					var destType = typeMap[origType];
					if(!keyHookCache[origType]) {
						if(origTypeCache = origKeyCache[origType]) {
							origTypeCache.push({fn: fn, data: undefined});
							keyHookCache[origType] = {
								fn: fn,
								type: destType
							};
							destTypes.push(destType);
						}
					}
				}
				that.define(dest, destTypes);
			}
		},
		/**
		 * 取消事件迁移
		 * @method unhook
		 * @static
		 * @param {Object} orig 源对象
		 * @param {Object} dest 目标对象
		 * @param {Object} typeMap 事件名称对照表
		 * {
		 * 	源事件名->目标事件名
		 * }
		 */
		unhook: function(orig, dest, typeMap) {
			if(!orig || !dest || !typeMap) {
				return;
			}
			var origKey = orig[custEventAttribute],
				destKey = dest[custEventAttribute],
				keyHookCache = hookCache[origKey +'_'+ destKey];
			if(keyHookCache) {
				for (var origType in typeMap) {
					var destType = typeMap[origType];
					if (keyHookCache[origType]) {
						that.remove(orig, origType, keyHookCache[origType].fn);
					}
				}
			}
		},
		/**
		 * 销毁
		 * @method destroy
		 * @static
		 */
		destroy: function() {
			custEventCache = {};
			custEventKey = 1;
			hookCache = {};
		}
	};
	return that;
});
//暂时不做阻止冒泡stopPropagation: Function//阻止事件的冒泡 注意：由于事件的执行顺序是先添加先执行，所以当想阻止冒泡时请提前添加事件绑定