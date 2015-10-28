( function(global, factory) {

	if ( typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(factory);
	} else if ( typeof exports === 'object') {
		// Node/CommonJS style for Browserify
		module.exports = factory(global);
	} else {
		// Browser globals
		global.Catlike = factory(global);
	}

}( typeof window !== "undefined" ? window : this, function(window) {
	
	var $isArray = require('../core/arr/isArray');
	
	var $indexOf = require('../core/arr/indexOf');
	
	var $inArray = require('../core/arr/inArray');
	
	var $extend = require('../core/obj/extend');

	var $hasProp = require('../core/obj/hasProp');
	
	var $fixEvent = require('../core/evt/fixEvent');
	
	var $addEvent = require('../core/evt/addEvent');
	
	var $css = require('../core/dom/css');
	
	var $preventDefault = require('../core/evt/preventDefault');
	
	var $message = require('/model/tray/message')();
	
	var $dataTable = require('/model/tray/dataTable');
	
	var $followTip = require('/model/bubble/followTips');
	
	/**
	 * Configure
	 */
	var EVTS = [
		'touchstart MozTouchDown touchmove MozTouchMove touchend touchcancel MozTouchRelease'
		,'mousedown mousemove mouseup'
	];
	
	var BROWSER_STYLE_PREFIX = [
		'-webkit-'
		,'-moz-'
		,'-ms-'
		,'-o-'
		,'-khtml-'
		,''
	];
		
	/**
	 * default options
	 */
	var options = {
		// Speed ​​sampling rate
		'speedSample'   : 300
		
		// onTouch daze timeout
		,'holdTime'     : 1500
		
		// onTouch daze timeout [ think... which way??  ( . .)  emmmmmmm~ ]
		,'hesitateTime' : 3000
		
		// unit: pixels(px)
		,'captureRange' : 20
		
		,'eventType'    : 1
		
		// Sector configuration
		
		/**
		 * Sector
		 * 
		 * Integer or Array
		 * 
		 * Integer: average angle
		 * 
		 * Array: Segmentation of the sector based on the configuration parameters
		 *     eg :  [0, 30, 100, 180, 235, 360] 
		 *         =>     =>     => 
		 *     0 > {AREA4} < 30 > {AREA2} < 100 > {AREA3} < 180 > {AREA5} < 235 > {AREA6} < 360
		 */
		,'sector'       : 4
		
		// Named for the sector
		,'alias'        : ['left', 'top', 'right', 'bottom']
		
		// Sector angle offset 
		,'offset'       : 180 - (90 / 2)
	};
	
	/**
	 * fix touch events
	 * 
	 * @param {Object} event object
	 * 
	 * @return {Array} fingers data
	 */
	var fixTouchEvent = function(e) {
		if (!e.touches) {
			e = [e];
		} else {
			if (e.touches && e.touches.length) {
				e = e.touches;
			} else if (e.changedTouches && e.changedTouches.length) {
				e = e.changedTouches;
			}
		}
		return e;
	};
	
	/**
	 * sector split
	 */
	var splitSector = function(num){
		var a = [];
		for(var i=0; i<num; i++){
			a.push(i / num * 360);
		}
		return a;
	};
	
	/**
	 * distance between two points
	 */
	var distance = function(p1, p2){
		return Math.pow(Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2), 0.5);
	};
	
	/**
	 * capture a point position
	 * 
	 * @param {Array} pos position [x,y]
	 * @param {Array} pList position list [[x,y],[x,y],...]
	 * @param [{range}] range default:20
	 * 
	 * return {Number} position of pos in pList
	 */
	var capture = function(pos, pList, range){
		
		range = range || 0;
		
		var index = -1
			,len = pList.length;
			
		if(len > 0){
			if(range > 0){
				var closein = 10000
					,naRange;
				var nr = [];
				while(-1 < --len){
					naRange = distance(pos, pList[len]);
					nr.push(naRange);
					if(range >= naRange && closein > naRange){
						index = len;
						closein = naRange;
					}
				}
			} else {
				while(-1 < --len){
					if(pos.toString() === pList[len].toString()){
						index = len;
						break;
					}
				}
			}
		}
		
		return index;
	};
	
	var getTouches = function(e){
		var p = [];
		for(var i=0,len=e.touches.length;i<len;i++){
			p.push([e.touches[i].pageX, e.touches[i].pageY].join(','));
		}
		
		return p;
	};
	
	var getToucheIndex = function(e){
		var p = [];
		for(var i=0,len=e.touches.length;i<len;i++){
			p.push(e.touches[i].identifier);
		}
		return p;
	};
	
	var getChangeTouches = function(e){
		var p = [];
		for(var i=0,len=e.changedTouches.length;i<len;i++){
			p.push([e.changedTouches[i].pageX, e.changedTouches[i].pageY].join(','));
		}
		
		return p;
	};
	
	var getChangeToucheIndex = function(e){
		var p = [];
		for(var i=0,len=e.changedTouches.length;i<len;i++){
			p.push(e.changedTouches[i].identifier);
		}
		return p;
	};
	
	return function(node, opts){
		
		//status
		var STATE = {};
		
		//sector
		var SECTOR = {};
		
		//points data
		var POS_DATA = {};
		
		//points hex
		var POS_HEX = {};
		
		//extra data
		var EXT_DATA = {};
		
		//handle manage
		var HL = {
			handle:[]
			,touch:[]
			,move:[]
			,hold:[]
			,transform:[]
			,hesitate:[]
		};
		
		//listener manag
		var LSN = {};
		
		var EVTS_HASH;
		
		var it = {
			'init' : function(){

				it.parseParam();
				it.hackCSS();
				it.createSector();
				
				it.bind();
				
				//$message.show('UA', {m:window.navigator.userAgent}, {autohide:0});
			}
			,'parseParam' : function(){
				opts = $extend({}, options, opts || {});
			}
			,'bind' : function(){
				var c = opts.eventType.toString(2);
				var e = [];
				for(var i=0,cl=c.length,len=EVTS.length;i<len;i++){
					if(c.charAt(cl-1-i) === '1'){
						e.push(EVTS[i]);
					}
				}
				EVTS_HASH = e.join(' ').split(' ');
				for(var i=0,len=EVTS_HASH.length;i<len;i++){
					$addEvent(node, EVTS_HASH[i], fingerHandle);
				}
			}
			,'hackCSS' : function(){
				// some css hacks
				var props = {
					'user-select' : 'none'
					,'touch-callout' : 'none'
					,'user-drag' : 'none'
					,'tap-highlight-color' : 'rgba(0,0,0,0)'
				};
				
				for(var i = 0, len = BROWSER_STYLE_PREFIX.length, css; i < len; i++){
					css = {};
					for(var prop in props) {
					    css[BROWSER_STYLE_PREFIX[i] + prop] = props[prop];
					}
					$css(node, css);
				}
			}
			/**
			 * 获取方位配置(可根据多种配置生成不同的分度信息)
			 */
			,'createSector' : function(){
				SECTOR.area = [];
				SECTOR.alias = [];
				SECTOR.offset = opts['offset'] || 0;
				
				if(opts.sector > -1){
					opts.sector = splitSector(opts.sector);
				}

				for(var i = 0, len = opts.sector.length; i < len; i++){
					SECTOR.area.push(opts.sector[i]);
					SECTOR.alias.push(opts['alias'] && opts.alias[i] || i);
				}
			}
			,'add' : function(type, callback){
				type = 'on' + type.toLowerCase();
				if($hasProp(HL, type)){
					HL[type].push(callback);
				} else {
					HL[type] = [callback];
				}
			}
			,'exec' : function(name){
				
				name = 'on' + name.toLowerCase();
				
				if(typeof HL[name] === 'undefined' || !HL[name] || HL[name].length == 0){
					return;
				}
				
				var args = Array.prototype.slice.call(arguments, 1);
				var FL = HL[name];
				
				//try{
					for(var i=0;i<FL.length;i++){
						if(typeof FL[i] === 'function'){
							FL[i].apply(null, args);
						}
					}
				//} catch(e){}
			}
		};
		
		var status = {
			'get' : {
				'pos' : function(es){
					return [es.pageX, es.pageY];
				}
				,'fingers' : function(){
					return EVT_HANDLE.length;
				}
			}
			,'set' : {
				'start' : function(){
					STATE.start = true;
				}
				,'moving' : function(){
					STATE.moving = true;
				}
				,'end' : function(){
					STATE.end = true;
				}
			}
			,'is' : {
				'start' : function(){
					return STATE.start;
				}
				,'moving' : function(){
					return STATE.moving;
				}
				,'end' : function(){
					return STATE.end;
				}
			}
			,'reset' : function(){
				STATE.start = false;
				STATE.moving = false;
				STATE.end = false;
			}
		};
		
		var extra = {
			'getCenterPoint' : function(plist){
			
				if(plist == null || !$isArray(plist)){
					return [];
				}
				
				var len = plist.length;
				if(len === 1){
					return plist[0];
				}
				var x=0, y=0;
				for(var i=0;i<len;i++){
					x += plist[i][0];
					y += plist[i][1];
				}
				
				return [x/len, y/len];
			}
		};
		
		
		var TRACK = {}
			,TRACK_HASH_START = []
			,TRACK_HASH_MOVE = [];
			
		var fingerHandle = function(e){
			
			for(var i=0,len=e.touches.length;i<len;i++){
				var pos = [e.touches[i].pageX, e.touches[i].pageY - 120];
				
				var content = [
					Math.floor(e.touches[i].pageX)+':'+Math.floor(e.touches[i].pageY)
					,e.touches[i].target.id
				].join('<br>');
				
				$followTip.show(e.touches[i].identifier, content, pos);
			}
			
			if(e.type == 'touchend'){
				console.log(e.changedTouches);
				for(var i=0,len=e.changedTouches.length;i<len;i++){
					$followTip.hide(e.changedTouches[i].identifier);
				}
			}
			
			$preventDefault(e);
			
			return;
		
			e = $fixEvent(e);
			
			console.log(e.type, getToucheIndex(e), getChangeToucheIndex(e), getTouches(e), getChangeTouches(e));
			
			switch(e.type){
				case 'mousedown':
				case 'touchstart':
				case 'MozTouchDown':
						
					/**
					 * Current status
					 */
					status.set.start();
					
					/**
					 * Fingers status
					 */
					!$hasProp(TRACK, 'fingers') && (TRACK.fingers = []);

					if($hasProp(e, 'changedTouches') && e.changedTouches.length){
						for(var i=0,len=e.changedTouches.length;i<len;i++){
							var pos = [e.changedTouches[i].pageX, e.changedTouches[i].pageY];
							TRACK.fingers.push({
								'start' : pos
							});
							TRACK_HASH_START.push(pos);
							TRACK_HASH_MOVE.push(pos);
						}
					}
					
					/**
					 * Extra attribute
					 */
					TRACK.center = extra.getCenterPoint(TRACK_HASH_MOVE);
					
					break;
				case 'mousemove':
				case 'touchmove':
				case 'MozTouchMove':
								
					/**
					 * Current status
					 */
					if(!status.is.start()){
						return;
					}
					status.set.moving();
					
					/**
					 * Fingers status
					 */
					if($hasProp(e, 'touches') && e.touches.length){
						for(var i=0,len=e.touches.length;i<len;i++){
							var pos = [e.touches[i].pageX, e.touches[i].pageY];
							TRACK.fingers[i].move = pos;
							TRACK_HASH_MOVE[i] = pos;
						}
					}
					
					/**
					 * Extra attribute
					 */
					TRACK.center = extra.getCenterPoint(TRACK_HASH_MOVE);
					
					break;
				case 'mouseup':
				case 'touchend':
				case 'touchcancel':
				case 'MozTouchRelease':
						
					/**
					 * Current status
					 */
					if(!status.is.start()){
						return;
					}
					
					/**
					 * Fingers status
					 */
					if($hasProp(e, 'changedTouches') && e.changedTouches.length){
						var ml = status.is.moving(); //!!TRACK_HASH_MOVE.length
						for(var i=0,len=e.changedTouches.length;i<len;i++){
							var index
								,pos = [e.changedTouches[i].pageX, e.changedTouches[i].pageY];
							
							if(-1 < (index = capture(pos, ml ? TRACK_HASH_MOVE : TRACK_HASH_START))){
								TRACK.fingers.splice(index, 1);
								TRACK_HASH_START.splice(index, 1);
								ml && TRACK_HASH_MOVE.splice(index, 1);
							}
						}
					}
					
					if(TRACK_HASH_START.length === 0 || e.touches.length === 0){	//fingers start track is empty or hold list is empty, regarded as the end.
						TRACK = {};
						TRACK_HASH_START = [];
						TRACK_HASH_MOVE = [];
						status.reset();
					}
					
					/**
					 * Extra attribute
					 */
					if(TRACK_HASH_START.length > 0){
						TRACK.center = extra.getCenterPoint(status.is.moving() ? TRACK_HASH_MOVE : TRACK_HASH_START);
					}
					
					break;
			}
			
			if($inArray(e.type, EVTS_HASH)){
			
				$message.msg('TRACK', $dataTable(TRACK), {autohide:0});
				
				it.exec('handle', TRACK);
				
			}
			
			return false;
		};
		
		var self = {
		
		};
		
		it.init();
		
		return self;		
		
		var _this = {};
		
		var _pos = {},
			_mouseDown = false,
			_directionConfig = {},
			_state = {},
			_options = {},
			_lsn = {},
			_tachometer = {};
		
		
		
		
		/**
		 * 状态控制
		 * state 分为状态标识和行为标识
		 *    状态分为:
		 *       down      开始
		 *       moving    移动中   
		 *       end       结束
		 *    [gesture]默认行为目前有：
		 *       hold      等待
		 *       drag      单指滑动
		 *       hesitate  发呆
		 *       transform 多指滑动缩放
		 *       end       结束
		 */
		var state = {
			/**
			 * 更新手指数量
			 */
			'getFingers' : function(evt){
				_state.fingers = $.fixTouchEvent(evt).length;
			}
			/**
			 * 手指数量，默认0
			 */
			,'fingers' : function(){
				return _state['fingers'] ? _state.fingers : 0;
			}
			/**
			 * 开始
			 */
			,'down' : function(){
				_state.mouseDown = 1;
			}
			/**
			 * 是否已开始
			 */
			,'isDown' : function(){
				return !!_state['mouseDown'];
			}
			/**
			 * 开始移动
			 */
			,'startMoving' : function(){
				_state.mouseMove = 1;
			}
			/**
			 * 是否在移动(移动过)
			 */
			,'isMovement' : function(){
				return !!_state['mouseMove'];
			}
			/**
			 * 结束
			 */
			,'end' : function(){
				_state.mouseUp = 1;
			}
			/**
			 * 是否已结束
			 */
			,'isEnded' : function(){
				return !!_state['mouseUp'];
			}
			/**
			 * 设置当前状态识别串
			 */
			,'setGesture' : function(gesture){
				_state.gesture = gesture;
			}
			/**
			 * 获取当前状态识别串
			 */
			,'gesture' : function(){
				return _state['gesture'] || '` 3`';
			}
			/**
			 * 重置所有状态
			 */
			,'reset' : function(){
				_state = {};
			}
		};
		
		var actions = {
			'init' : function(){
				actions.parseParam();
				actions.parseDirectionConfigure(_options.direction);
				actions.CSSFixed();
				
				actions.bindDOM();
			}
			,'parseParam' : function(){
				_options = $.extend(defaultConfig, opt || {});
			}
			,'bindDOM' : function(){
				if('ontouchstart' in window){
					node.bind("touchstart touchmove touchend touchcancel MozTouchDown MozTouchMove MozTouchRelease", actions.handleEvents);
				} else {
			        $(document).bind("mouseup", actions.handleEvents);
			        node.bind("mousedown mousemove", actions.handleEvents);
			    }
			}
			,'CSSFixed' : function(){
				// some css hacks
				$(['-webkit-','-moz-','-ms-','-o-','']).each(function(i, vendor) {
					var css = {};
					var props = {
						"user-select": "none",
						"touch-callout": "none",
						"user-drag": "none",
						"tap-highlight-color": "rgba(0,0,0,0)"
					};
					
					for(var prop in props) {
					    css[vendor + prop] = props[prop];
					}
					
					node.css(css);
				});
			}
			/**
			 * 动作捕获及对应的响应事件
			 */
			,'handleEvents' : function(evt){
				state.getFingers(evt);
				tachometer.point();
				//区分事件类型
				switch(evt.type){
					case 'mousedown':
					case 'touchstart':
					case 'MozTouchDown':
						//状态
						if(state.isMovement() && state.fingers() === 1){ return; } //防止中断
						state.down();
						
						//数据
						//_pos.start = $.merge(_pos['start'] || [], actions.getPositions(evt));
						_pos.start = actions.getPositions(evt);
						
						//行为
						gestures.hold(evt);
						
						evt.preventDefault();
						break;
					case 'mousemove':
					case 'touchmove':
					case 'MozTouchMove':
						//状态
						if(!state.isDown()){ return; }
						state.startMoving();
						
						//数据
						_pos.move = actions.getPositions(evt);
						_pos.angle = actions.getAngles();
						_pos.distance = actions.getDistances();
						_pos.direction = actions.getDirections();
						
						//行为
						!gestures.transform(evt) && gestures.drag(evt);
						
						_options.onMove.call(this, _pos, evt);
						break;
					case 'mouseup':
					case 'touchend':
					case 'touchcancel':
					case 'MozTouchRelease':
						//状态
						if(!state.isDown()){ return; }
						state.end();
						//数据
						_pos.end = actions.getPositions(evt);
						
						if(state.isMovement()){
							_pos.speed = tachometer.getSpeed();
						}
						
						//行为
						// if(_pos.start.length - _pos.end.length > 0){
// 							
							// var keepIndex = [];
							// for(var i in _pos.move){
								// if($.inArray(_pos.move[i], _pos.end) < 0){
									// keepIndex.push(i);
									// break;
								// };
							// }
// 							
							// var newPos = {};
// 							
							// for(var type in _pos){
								// newPos[type] = [];
								// for(var i in lostIndex){
									// newPos[type].push(_pos[type][keepIndex[i]]);
								// }
							// }
// 							
							// _pos = newPos;
							// //_pos.move = _pos.start = actions.getPositions(evt);
// 							
							// _options.onLeave.call(this, _pos, evt);
							// gestures.end();
						// } else {
							_options.onEnd.call(this, _pos, evt);
							actions.reset();
						//}
						break;
				}
				_options.onHandle.call(this, _pos, evt);
				return evt.preventDefault();
			}
			,'getHash' : function(pos){
				return '' + pos.x + pos.y + new Date().getTime();
			}
			,'getHashs' : function(){
				var hashs = [];
				if(_pos['start'] && _pos.start.length > 0){
					for(var i in _pos.start){
						hashs.push(actions.getHash(_pos.start[i]));
					}
				}
				return hashs;
			}
			/**
			 * 获取手指(触点)数量
			 */
			,'getFingers' : state.getFingers
			/**
			 * 获取当前点坐标
			 */
			,'getPosition' : function(evt){
				return {'x':evt.pageX, 'y':evt.pageY};
			}
			/**
			 * 获取所有点坐标(遍历)
			 */
			,'getPositions' : function(evt){
				var pos = [];
				evt = $.fixTouchEvent(evt);
				for(var i = 0, len = evt.length; i < len; i ++){
					pos.push(actions.getPosition(evt[i]));
				}
				try {
					return pos;
				} finally {
					pos = evt = undefined;
				}
			}
			/**
			 * 获取两点间距离
			 */
			,'getDistance' : function(pos1, pos2){
				return Math.pow(Math.pow(pos2.x - pos1.x, 2) + Math.pow(pos2.y - pos1.y, 2), 0.5);
			}
			/**
			 * 获取所有滑动距离(遍历)
			 */
			,'getDistances' : function(){
				var dis = [];
				if(_pos['move'] && _pos.move.length > 0){
					for(var i in _pos.move){
						dis.push(actions.getDistance(_pos.start[i], _pos.move[i]));
					}
				}
				return dis;
			}
			/**
			 * 获取角度
			 */
			,'getAngle' : function(pos1, pos2){
				return Math.atan2(pos2.y - pos1.y, pos2.x - pos1.x) * 180 / Math.PI;
			}
			/**
			 * 获取所有角度(遍历)
			 */
			,'getAngles' : function(){
				var angle = [];
				if(_pos['move'] && _pos.move.length > 0){
					for(var i in _pos.move){
						angle.push(actions.getAngle(_pos.start[i], _pos.move[i]));
					}
				}
				return angle;
			}
			/**
			 * 获取绝对角度(±180 => 360)
			 */
			,'getAbsoluteAngle' : function(angle){
				angle < 0 && (angle = 360 - Math.abs(angle));
				return angle;
			}
			/**
			 * 获取方位配置(可根据多种配置生成不同的分度信息)
			 */
			,'parseDirectionConfigure' : function(conf){
				_directionConfig.points = [];
				_directionConfig.alias = [];
				_directionConfig.offset = conf['offset'] || 0;
				if(conf['eqally'] && conf.eqally > 0){
					for(var i=0; i<=conf.eqally; i++){
						_directionConfig.points.push(i / conf.eqally * 360);
						_directionConfig.alias.push(conf['alias'] && conf['alias'][i] || i);
					}
				} else if(conf['points'] && conf.points.length > 0) {
					for(var i=0, len=conf.points.length; i<len; i++){
						_directionConfig.points.push(conf.points[i]);
						_directionConfig.alias.push(conf['alias'] && conf['alias'][i] || i);
					}
				}
			}
			/**
			 * 根据方位配置获取所属区域
			 */
			,'getDirection' : function(angle){
				var realAngle = actions.getAbsoluteAngle(angle - _directionConfig.offset);
				for(var i in _directionConfig.points){
					if(realAngle < _directionConfig.points[i]){
						return _directionConfig.alias[i-1];
					}
				}
				return realAngle;
			}
			/**
			 * 获取所属区域(遍历)
			 */
			,'getDirections' : function(){
				var direction = [];
				if(_pos['angle'] && _pos.angle.length > 0){
					for(var i in _pos.angle){
						direction.push(actions.getDirection(_pos.angle[i]));
					}
				}
				return direction;
			}
			/**
			 * 重置所有
			 */
			,'reset' : function(){
				/**
				 * 行为鉴定结束
				 */
				gestures.end();
				/**
				 * 数据链重置
				 */
				_pos = {};
				/**
				 * 状态重置
				 */
				state.reset();
				/**
				 * 测度器重置
				 */
				tachometer.reset();
			}
			/**
			 * 销毁所有
			 */
			,'destroy' : function(){
				_pos = _state = actions = undefined;
			}
		};
		
		
		/**
		 * 行为鉴定与分配
		 */
		var gestures = {
			/**
			 * 等待
			 */
			'hold' : function(evt){
				if(state.fingers() === 1){
					gestures.holdEnd(); //结束当点计时器，开始新一次的。
					_lsn.holdTimer = setTimeout(function(){
						if(!state.isMovement()){
							state.setGesture('hold');
							alert(_state.gesture);
						}
						gestures.holdEnd();
					}, _options.holdTime || 2000);
				}
			}
			/**
			 * 清除等待计时器
			 */
			,'holdEnd' : function(){
				_lsn['holdTimer'] && clearTimeout(_lsn.holdTimer);
			}
			/**
			 * 单指滑动
			 */
			,'drag' : function(evt){
				if(state.fingers() === 1){
					state.setGesture('drag');
					//_pos.gesture = [state.gesture()];
					
					gestures.hesitate(evt);
					return true;
				}
				return false;
			}
			/**
			 * 滑动时发呆...(单指)
			 */
			,'hesitate' : function(evt){
				gestures.hesitateEnd(); //结束当点计时器，开始新一次的。
				_lsn.hesitateTimer = setTimeout(function(){
					if(state.isMovement() && state.fingers() === 1){
						state.setGesture('hesitate');
						alert(_state.gesture);
					}
					gestures.hesitateEnd();
				}, _options.hesitateTime || 10000);
			}
			,'hesitateEnd' : function(evt){
				_lsn['hesitateTimer'] && clearTimeout(_lsn.hesitateTimer);
			}
			/**
			 * 缩放
			 */
			,'transform' : function(evt){
				if(state.fingers() > 1){
					state.setGesture('transform');
					//_pos.gesture = [state.gesture()];
					return true;
				}
				return false;
			}
			/**
			 * 结束
			 */
			,'end' : function(evt){
				gestures.holdEnd();
				gestures.hesitateEnd();
				
				switch (state.gesture()) {
					case 'transform':
					case 'drag':
						break;
				}
				
				state.setGesture('end');
			}
		};
		
		/**
		 * 速度计
		 */
		var tachometer = {
			'point' : function(){
				if(state.isMovement()){
					var now = new Date().getTime();
					if(!_tachometer['time'] || now - _tachometer.time > _options.speedSample){
						_tachometer.time = now;
						_tachometer.pos = _pos.move;
					}
					//_pos.speed = tachometer.getSpeed();
					now = undefined;
				}
			}
			,'getSpeed' : function(){
				if(state.isMovement()){
					var nowTime = new Date().getTime();
					var currentPos = state.isEnded() ? _pos.end : _pos.move;
					//var len = currentPos.length < _tachometer.pos.length ? currentPos.length : _tachometer.pos.length;
					var passTime = nowTime - _tachometer.time;
					var speeds = [];
					
					for(var i = 0; i < currentPos.length; i++){
						if(passTime > 0){
							speeds.push(actions.getDistance(_tachometer.pos[i], currentPos[i]) / passTime);
						} else {
							speeds.push(0);
						}
					}
					return speeds;
				}
			}
			,'reset' : function(){
				_tachometer = {};
			}
		};
	};
}));