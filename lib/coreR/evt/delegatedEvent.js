/**
 * 通过冒泡的方式做的事件代理对象
 * 
 * @id STK.core.evt.delegatedEvent
 * @param {Element} actEl 要被代理的最外节点对象
 * @param {Array} expEls 事件代理要被忽略的节点列表
 * @return {object}
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @version 1.0
 * @example
 * var a = STK.core.evt.delegatedEvent($.E('outer'),$.E('inner'));
 * 
 * @import STK.core.dom.isNode
 * @import STK.core.dom.contains
 * @import STK.evt.addEvent
 * @import STK.evt.fixEvent
 */

$Import('core.json.queryToJson');
$Import('core.dom.isNode');
$Import('core.dom.sizzle');
$Import('core.dom.contains');
$Import('core.evt.addEvent');
$Import('core.evt.removeEvent');
$Import('core.evt.fixEvent');
$Import('core.arr.isArray');
$Import('core.obj.isEmpty');
$Import('core.func.empty');

STK.register('core.evt.delegatedEvent',function($){
	
	var checkContains = function(list,el){
		for(var i = 0, len = list.length; i < len; i += 1){
			if($.core.dom.contains(list[i],el)){
				return true;
			}
		}
		return false;
	};
	
	return function(actEl,expEls){
		if(!$.core.dom.isNode(actEl)){
			throw 'core.evt.delegatedEvent need an Element as first Parameter';
		}
		if(!expEls){
			expEls = [];
		}
		if(!$.core.arr.isArray(expEls)){
			expEls = [expEls];
		}
		var evtList = {};
		var bindEvent = function(e){
			var evt = $.core.evt.fixEvent(e);
			var el = evt.target;
			var type = e.type;
			doDelegated(el, type, evt);
		};
		
		var doDelegated = function(el, type, evt){
			var actionType = null;
			var changeTarget = function(){
				var path, lis, tg;
				path = el.getAttribute('action-target');
				if(path){
					lis = $.core.dom.sizzle(path, actEl);
					if(lis.length){
						tg = evt.target = lis[0];
					}
				};
				changeTarget = $.core.func.empty;
				return tg;
			};
			var checkBuble = function(){
				var tg = changeTarget() || el;
				if(evtList[type] && evtList[type][actionType]){
					return evtList[type][actionType]({
						'evt' : evt,
						'el' : tg,
						'box' : actEl,
						'data' : $.core.json.queryToJson(tg.getAttribute('action-data') || '')
					});
				}else{
					return true;
				}
			};
			if(checkContains(expEls,el)){
				return false;
			}else if(!$.core.dom.contains(actEl, el)){
				return false;
			}else{
				while(el && el !== actEl){
					if(el.nodeType === 1){
						actionType = el.getAttribute('action-type');
						if(actionType && checkBuble() === false){
							break;
						}
					}
					el = el.parentNode;
				}
				
			}
		};
		
		var that = {};
		/**
		 * 添加代理事件
		 * @method add
		 * @param {String} funcName
		 * @param {String} evtType
		 * @param {Function} process
		 * @return {void}
		 * @example
		 * 		document.body.innerHTML = '<div id="outer"><a href="###" action_type="alert" action_data="test=123">test</a><div id="inner"></div></div>'
		 * 		var a = STK.core.evt.delegatedEvent($.E('outer'),$.E('inner'));
		 * 		a.add('alert','click',function(spec){window.alert(spec.data.test)});
		 *
		 */
		that.add = function(funcName, evtType, process){
			if(!evtList[evtType]){
				evtList[evtType] = {};
				$.core.evt.addEvent(actEl, evtType, bindEvent);
			}
			var ns = evtList[evtType];
			ns[funcName] = process;
		};
		/**
		 * 移出代理事件
		 * @method remove
		 * @param {String} funcName
		 * @param {String} evtType
		 * @return {void}
		 * @example
		 * 		document.body.innerHTML = '<div id="outer"><a href="###" action_type="alert" action_data="test=123">test</a><div id="inner"></div></div>'
		 * 		var a = STK.core.evt.delegatedEvent($.E('outer'),$.E('inner'));
		 * 		a.add('alert','click',function(spec){window.alert(spec.data.test)});
		 * 		a.remove('alert','click');
		 */
		that.remove = function(funcName, evtType){
			if(evtList[evtType]){
				delete evtList[evtType][funcName];
				if($.core.obj.isEmpty(evtList[evtType])){
					delete evtList[evtType];
					$.core.evt.removeEvent(actEl, evtType, bindEvent);
				}
			}
		};
		
		/**
		 * 添加略过节点
		 * @method pushExcept
		 * @param {Node} el
		 * @example
		 * 		document.body.innerHTML = '<div id="outer"><a href="###" action_type="alert" action_data="test=123">test</a><div id="inner"></div></div>'
		 * 		var a = STK.core.evt.delegatedEvent($.E('outer'));
		 * 		a.add('alert','click',function(spec){window.alert(spec.data.test)});
		 * 		a.pushExcept($.E('inner'));
		 */
		that.pushExcept = function(el){
			expEls.push(el);
		};
		
		/**
		 * 移出略过节点
		 * @method removeExcept
		 * @param {Node} el
		 * @example
		 * 		document.body.innerHTML = '<div id="outer"><a href="###" action_type="alert" action_data="test=123">test</a><div id="inner"></div></div>'
		 * 		var a = STK.core.evt.delegatedEvent($.E('outer'));
		 * 		a.add('alert','click',function(spec){window.alert(spec.data.test)});
		 * 		a.pushExcept($.E('inner'));
		 * 		a.removeExcept($.E('inner'));
		 */
		that.removeExcept = function(el){
			if(!el){
				expEls = [];
			}else{
				for(var i = 0, len = expEls.length; i < len; i += 1){
					if(expEls[i] === el){
						expEls.splice(i,1);
					}
				}
			}
			
		};
		/**
		 * 晴空略过节点
		 * @method clearExcept
		 * @example
		 * 		document.body.innerHTML = '<div id="outer"><a href="###" action_type="alert" action_data="test=123">test</a><div id="inner"></div></div>'
		 * 		var a = STK.core.evt.delegatedEvent($.E('outer'));
		 * 		a.add('alert','click',function(spec){window.alert(spec.data.test)});
		 * 		a.pushExcept($.E('inner'));
		 * 		a.clearExcept();
		 */
		that.clearExcept = function(el){
			expEls = [];
		};
		/**
		 * 支持外调action 非基于节点的代理事件触发
		 * @method fireAction
		 * @param {string} actionType
		 * @param {string} evtType
		 * @param {Event} [evt]
		 * @param {hash} [params]
		 * @example
		 * 		document.body.innerHTML = '<div id="outer"><a href="###" action_type="alert" action_data="test=123">test</a><div id="inner"></div></div>'
		 * 		var a = STK.core.evt.delegatedEvent($.E('outer'));
		 * 		a.add('alert','click',function(spec){window.alert(spec.data.test)});
		 * 		a.fireAction('alert', 'click', null, {
		 * 			actionData : 'test1=1&test2=2'
		 * 		});
		 * 
		 */
		that.fireAction = function(actionType, evtType, evt, params){
			var actionData = '';
			if(params && params['actionData']){
				actionData = params['actionData'];
			}
			if(evtList[evtType] && evtList[evtType][actionType]){
				evtList[evtType][actionType]({
					'evt' : evt,
					'el' : null,
					'box' : actEl,
					'data' : $.core.json.queryToJson(actionData),
					'fireFrom' : 'fireAction'
				});
			}
		};
		/**
		 * 支持外调节点 可以将某代理事件代理区域外节点的事件转嫁到该代理事件上
		 * @method fireInject
		 * @param {Element} dom
		 * @param {string} evtType
		 * @param {Event} [evt]
		 * @example
		 * 		document.body.innerHTML = '<div id="outer"><a href="###" action_type="alert" action_data="test=123">test</a><div id="inner"></div></div><button id='inject'>click me!</button>'
		 * 		var a = STK.core.evt.delegatedEvent($.E('outer'));
		 * 		a.add('alert','click',function(spec){window.alert(spec.data.test)});
		 * 		var button = STK.E('inject');
		 * 		STK.addEvent(button, 'click', function(evt) {
		 * 			a.fireInject(button, 'click', evt);
		 * 		});
		 */
		that.fireInject = function(dom, evtType, evt){
			var actionType = dom.getAttribute('action-type');
			var actionData = dom.getAttribute('action-data');
			if(actionType && evtList[evtType] && evtList[evtType][actionType]){
				evtList[evtType][actionType]({
					'evt' : evt,
					'el' : dom,
					'box' : actEl,
					'data' : $.core.json.queryToJson(actionData || ''),
					'fireFrom' : 'fireInject'
				});
			}
		};
		
		/**
		 * 支持节点触发 解决直接fire节点的某事件不冒泡引起代理事件不生效而添加的方法
		 * @method fireDom
		 * @param {Element} dom
		 * @param {string} evtType
		 * @param {Event} [evt]
		 * @example
		 * 		document.body.innerHTML = '<div id="outer"><a href="###" action_type="alert" action_data="test=123">test</a><div id="inner"></div></div>'
		 * 		var a = STK.core.evt.delegatedEvent($.E('outer'));
		 * 		a.add('alert','click',function(spec){window.alert(spec.data.test)});
		 * 		a.fireDom(a, 'click', null);
		 */
		that.fireDom = function(dom, evtType, evt){
			doDelegated(dom, evtType, evt || {});
		};
		/**
		 * 销毁
		 * @method destroy
		 */
		that.destroy = function(){
			for(var k in evtList){
				for(var l in evtList[k]){
					delete evtList[k][l];
				}
				delete evtList[k];
				$.core.evt.removeEvent(actEl, k, bindEvent);
			}
		};
		return that;
	};
});