/**
 * ===================================================================
 * = 静态扩展
 * ===================================================================
 */

/**
 * 浏览器检测，覆盖jQuery默认方法
 */
jQuery.browser = (function($){
	var ua = navigator.userAgent.toLowerCase();
	var external = window.external || '';
	var core, m, extra, version, os;

	var numberify = function(s) {
		var c = 0;
		return parseFloat(s.replace(/\./g, function() {
			return (c++ == 1) ? '' : '.';
		}));
	};
	try{
        if ((/windows|win32/i).test(ua)) {
            os = 'windows';
        } else if ((/macintosh/i).test(ua)) {
            os = 'macintosh';
        } else if ((/rhino/i).test(ua)) {
            os = 'rhino';
        } else if((/mac os/).test(ua)){
        	os = 'mac';
        }

		if((m = ua.match(/applewebkit\/([^\s]*)/)) && m[1]){
			core = 'webkit';
			version = numberify(m[1]);
		}else if((m = ua.match(/presto\/([\d.]*)/)) && m[1]){
			core = 'presto';
			version = numberify(m[1]);
		}else if(m = ua.match(/msie\s([^;]*)/)){
			core = 'trident';
			version = 1.0;
			if ((m = ua.match(/trident\/([\d.]*)/)) && m[1]) {
				version = numberify(m[1]);
			}
		}else if(/gecko/.test(ua)){
			core = 'gecko';
			version = 1.0;
			if((m = ua.match(/rv:([\d.]*)/)) && m[1]){
				version = numberify(m[1]);
			}
		}

		if(/world/.test(ua)){
			extra = 'world';
		}else if(/360se/.test(ua)){
			extra = '360';
		}else if((/maxthon/.test(ua)) || typeof external.max_version == 'number'){
			extra = 'maxthon';
		}else if(/tencenttraveler\s([\d.]*)/.test(ua)){
			extra = 'tt';
		}else if(/se\s([\d.]*)/.test(ua)){
			extra = 'sogou';
		}
	}catch(e){}
	
	var ret = {
		'OS':os,
		'CORE':core,
		'Version':version,
		'EXTRA':(extra?extra:false),
		'IE': /msie/.test(ua),
		'OPERA': /opera/.test(ua),
		'MOZ': /gecko/.test(ua) && !/(compatible|webkit)/.test(ua),
		'IE5': /msie 5 /.test(ua),
		'IE55': /msie 5.5/.test(ua),
		'IE6': /msie 6/.test(ua),
		'IE7': /msie 7/.test(ua),
		'IE8': /msie 8/.test(ua),
		'IE9': /msie 9/.test(ua),
		'SAFARI': !/chrome\/([\d.]*)/.test(ua) && /\/[\w.]* safari/.test(ua),
		'CHROME': /chrome\/([\d.]*)/.test(ua),
		'IPAD':/\(ipad/i.test(ua),
		'IPHONE':/\(iphone/i.test(ua),
		'ITOUCH':/\(itouch/i.test(ua),
		'MOBILE':/mobile/i.test(ua),
		'UA':ua
	};
	return ret;
})(jQuery);

/**
 * 混合触摸屏的事件绑定，区分单点、多点
 */
jQuery.fixTouchEvent = (function($){
	return function(e){
		if(!e.originalEvent.touches){
			e = [e];
		} else {
			if(e.originalEvent.touches && e.originalEvent.touches.length) {
				e = e.originalEvent.touches;
		    } else if(e.originalEvent.changedTouches && e.originalEvent.changedTouches.length) {
		    	e = e.originalEvent.changedTouches;
		    }
		}
		return e;
	};
})(jQuery);

/**
 * 是否为节点
 */
jQuery.isNode = (function($){
	return function(node){
		node = $(node)[0];
		return (node != undefined) && Boolean(node.nodeName) && Boolean(node.nodeType);
	};
})(jQuery);

/**
 * 隐藏的容器
 */
jQuery.mirage = (function($) {
	var mirage;
	var init = function() {
	 	if(mirage) return;
		mirage = $("<div/>");
		mirage.css({'position':'absolute', 'top':'-10000px', 'left':'-10000px'});
		$("head").append(mirage);
	};
	
	var that = {
	 	'append': function(el) {
			if($(el).isNode()) {
				init();
				mirage.append(el);
			}
		}
		,'remove': function(el) {
			if($(el).isNode()) {
				init();
				mirage && el.remove();
			}
		}
	};
	return that;
	 
})(jQuery);

/**
 * 获取dom尺寸
 */
jQuery.getSize = (function($){
	var act = {
		'size' : function(node){
			return node && node.isNode()
				? {
					'width'   : node.width()
					,'height' : node.height()
				}
				: false;
		}
		,'getSize' : function(dom){
			var ret = null;
			if (dom.css('display') === 'none') {
				dom.css({'visibility':'hidden', 'display':''});
				ret = act.size(dom);
				dom.css({'visibility':'visible', 'display':'none'});
			} else {
				ret = act.size(dom);
			}
			return ret;
		}
	};
	
	return function(node){
		var ret = {};
		if(!node.parent().length){
			$.mirage.append(node);
			ret = act.getSize(node);
			$.mirage.remove(node);
		} else {
			ret = act.getSize(node);
		}
		return ret;
	};
})(jQuery);

//自动缩放
jQuery.FFScale = (function($){
	return function(node, target){
		
		var nodeSize = node.getSize();
		
		if(!target || !target.isNode()){
			return nodeSize;
		}
		
		var targetSize = target.getSize();
		
		var scale = [
			nodeSize.height / targetSize.height,
			nodeSize.width / targetSize.width
		];
		scale = scale[0] < scale[1] ? scale[0] : scale[1];
		
		nodeSize.height = Math.ceil(nodeSize.height / scale);
		nodeSize.width = Math.ceil(nodeSize.width / scale);
		return nodeSize;
	};
})(jQuery);

//读取图片
jQuery.loadImage = (function($){
	return function(url, callback){
		var img = $('<img/>');
		img.bind('onload', function(){
			img.unbind('onload');
			callback && callback(img);
		});
		img.attr('src', url);
		return img;
	};
})(jQuery);

//图片预加载
jQuery.advLoad = (function($){
	return function(selector, getURLCallBack){
		if(selector.length > 0 && $.isFunction(getURLCallBack)){
			var list = [];
			var url;
			selector.each(function(index, ob){
				list.push($.loadImage(getURLCallBack(ob)));
			});
		}
		return [selector, list];
	};
})(jQuery);

jQuery.autoFull = (function($, window){
	var attrs = ['canvas', 'img', 'iframe'];
		
	return function(node, cb){
		if(!node)
			throw 'NE!';
		
		var frameEL,
			currentEL,
			isBind = false,
			winEl = $(window);

		var that = {
			'init' : function(){
				currentEL = $(node);
				frameEL = currentEL.parent() || winEl;
				
				that.bind();
				that.autoSize();
			}
			,'bind' : function(){
				if(!isBind){
					winEl.resize(that.autoSize);
					isBind = true;
				}
			}
			,'size' : function(){
				return {
					"width"  : frameEL.innerWidth(),
					"height" : frameEL.innerHeight()
				};
			}
			,'autoSize' : function(){
				if($.inArray(currentEL.get(0).nodeName.toLowerCase(), attrs) !== false){
					currentEL.attr(that.size());
				} else {
					currentEL.css(that.size());
				}
			}
		};
		
		that.init();
		
		return that;
	};
})(jQuery, window);

jQuery.parseParam = (function(){
	return function(oSource, oParams, isown){
		var key, obj = {};
		oParams = oParams || {};
		for (key in oSource) {
			obj[key] = oSource[key];
			if (oParams[key] != null) {
				if (isown) {// 仅复制自己
					if (oSource.hasOwnProperty(key)) {
						obj[key] = oParams[key];
					}
				}
				else {
					obj[key] = oParams[key];
				}
			}
		}
		return obj;
	};
})(jQuery);

jQuery.clone = (function($) {
	function clone(jsonObj) {
		var buf;
		if (jsonObj instanceof Array) {
			buf = [];
			var i = jsonObj.length;
			while (i--) {
				buf[i] = clone(jsonObj[i]);
			}
			return buf;
		} else if (jsonObj instanceof Object) {
			buf = {};
			for (var k in jsonObj) {
				buf[k] = clone(jsonObj[k]);
			}
			return buf;
		} else {
			return jsonObj;
		}
	}
	return clone;
})(jQuery);

jQuery.custEvent = (function($, window){
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
							//$.log("[error][custEvent]" + e.message, e, e.stack);
						}
					}
				}
				
				if(preventDefaultFlag && $.type(defaultAction) === 'function') {
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
					if ($.isArray(_obj)) {
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
						preventDefaultFlag = false;
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
//暂时不做阻止冒泡stopPropagation: Function//阻止事件的冒泡 注意：由于事件的执行顺序是先添加先执行，所以当想阻止冒泡时请提前添加事件绑定
})(jQuery, window);

jQuery.notice = (function($, window) {
	var custEvent = $.custEvent;
	return function() {
		var list = {};
		var that = {};
		that.define = function(name) {
			custEvent.define(that, name);
			if (typeof name === 'string') {
				list[name] = [];
			} else if ($.core.arr.isArray(name)) {
				for (var i = 0, len = name.length; i < len; i += 1) {
					list[name[i]] = [];
				}
			}
		};
		that.fire = function(name, args) {
			custEvent.fire(that, name, args);
		};
		that.add = function(name, fn) {
			if (list) {
				custEvent.add(that, name, fn);
			}
			if (name in list) {
				list[name].push(fn);
			}
		};
		that.remove = function(name, fn) {
			custEvent.remove(that, name, fn);
		};
		that.destroy = function() {
			for (var name in list) {
				for (var i = 0, len = list[name].length; i < len; i += 1) {
					try {
						custEvent.remove(that, name, list[name][i]);
					} catch(exp) {}
				}
			}
			list = null;
		};
		return that;
	};
})(jQuery, window);

jQuery.relativeMaximum = (function($, window){
	var b = 0;
	return function(rValue, cValue, breach){
		breach = !!(breach || b);
		if(typeof cValue == 'undefined' || (typeof cValue == 'string' && !cValue)){
			return rValue;
		}
		var nv = 1;
		if(/%$/.test(cValue)){	//百分数
			nv = parseFloat(cValue.replace('%', '')) / 100;
			!breach && nv > 1 && (nv = 1);
			return rValue * nv;
		} else if(/^x/i.test(cValue)){	//小数
			nv = parseFloat(cValue.replace('x', ''));
			!breach && nv > 1 && (nv = 1);
			return rValue * nv;
		} else {
			!breach && cValue > rValue && (cValue = rValue);
			return cValue;
		}
	};
})(jQuery, window);

jQuery.numberFormat = (function($){
	var l, a, t;
	return function(n, type){
		n = n.toString();
		a = n.split('.');
		if(a[0]){
			l = [];
			while(a[0].length > 3){
				l.push(a[0].substr(-3, 3));
				a[0] = a[0].substr(0, a[0].length - 3);
			}
			l.push(a[0]);
			n = l.reverse().join(',');
		}
		if(a[1]){
			n += '.' + a[1].substr(0, 2);
		}
		try{
			return n;
		} finally {
			l = a = null;
		}
	};
})(jQuery);

jQuery.queryToJson = (function($){
	return function(QS, isDecode){
		var _Qlist = $.trim(QS).split("&");
		var _json  = {};
		var _fData = function(data){
			if(isDecode){
				return decodeURIComponent(data);
			}else{
				return data;
			}
		};
		for(var i = 0, len = _Qlist.length; i < len; i++){
			if(_Qlist[i]){
				var _hsh = _Qlist[i].split("=");
				var _key = _hsh[0];
				var _value = _hsh[1];
				
				// 如果只有key没有value, 那么将全部丢入一个$nullName数组中
				if(_hsh.length < 2){
					_value = _key;
					_key = '$nullName';
				}
				// 如果缓存堆栈中没有这个数据
				if(!_json[_key]) {
					_json[_key] = _fData(_value);
				}
				// 如果堆栈中已经存在这个数据，则转换成数组存储
				else {
					if($.isArray(_json[_key]) != true) {
						_json[_key] = [_json[_key]];
					}
					_json[_key].push(_fData(_value));
				}
			}
		}
		return _json;
	};
})(jQuery);

jQuery.templet = (function($){
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
})(jQuery);

jQuery.getActionData = (function($){
	return function(node){
		return $.queryToJson(node.attr('action-data') || '');
	};
})(jQuery);

jQuery.builder = (function($){
	return function(node, contain){
		var ns = $('[node-type]', node), dl = {}, nt, el;
		contain = contain || '';
		ns.each(function(n){
			el = ns.eq(n);
			nt = el.attr('node-type');
			if(!contain || contain === nt){
				if(dl[nt]){
					if(!$.isArray(dl[nt])){
						dl[nt] = [dl[nt]];
					}
					dl[nt].push($(el.get(0)));
				} else {
					dl[nt] = $(el.get(0));
				}
			}
		});
		return dl;
	};
})(jQuery);

jQuery.log = (function(){
	return function(){
		window['console'] && console.log.apply(this, arguments);
	};
})();

/**
 * ===================================================================
 * = 动态扩展
 * ===================================================================
 */
jQuery.fn.isNode = (function($){
	return function(){
		return $.isNode($(this));
	};
})(jQuery);

jQuery.fn.getSize = (function($){
	return function(){
		return $.getSize($(this));
	};
})(jQuery);

jQuery.fn.autoFull = (function($){
	return function(cb){
		return $.autoFull($(this), cb);
	};
})(jQuery);

jQuery.fn.getActionData = (function($){
	return function(){
		return $.getActionData($(this));
	};
})(jQuery);

jQuery.fn.buider = (function($){
	return function(contain){
		return $.builder($(this), contain);
	};
})(jQuery);
