/**
 * css3动画方法
 * @id STK.core.ani.transition
 * @param {string} node 动画节点
 * @param {object} spec 
 * {
 *   target : '',//要变化的目标样式
 *   duration : 500,//动画时长 毫秒
 *   timingFn : [0, 0, 1, 1],//通过贝赛尔曲线来计算“转换”过程中的属性值 http://en.wikipedia.org/wiki/B%C3%A9zier_curve
 *   callback : function(node){}//动画完成时的回调，参数node为动画节点
 * }
 * @author Robin Young | yonglin@staff.sina.com.cn zythum | zhuyi@staff.sina.com.cn 
 * @example
 * STK.core.ani.transition($.E('test'), {
 *    target : 'width: 100px;height:20px;',
 *    duration: 800, 
 *    timingFn:[0, 5, 1, 1], 
 *    callback:function(node) {console.log('end', node)}
 * });
 */

$Import('core.obj.parseParam');
$Import('core.dom.cssText');
$Import('core.dom.addClassName');
$Import('core.dom.removeClassName');
$Import('core.evt.addEvent');
$Import('core.evt.removeEvent');
$Import('core.evt.eventName');

STK.register('core.ani.transition', function($){
	
	var head = document.head || document.getElementsByTagName('head')[0];
	
	var transitionSheet = function(){
		var cssDom = document.createElement('style');
		var cssId = 'STK_transition_' + (+new Date());
		var cssSheet = null;
		var that = {};
		cssDom.setAttribute('type','text/css');
		cssDom.setAttribute('id', cssId);
		head.appendChild(cssDom);
		for(var i = 0,len = document.styleSheets.length; i < len; i += 1){
			if(document.styleSheets[i].ownerNode.id === cssId){
				cssSheet = document.styleSheets[i];
				break;
			}
		}
		
		that.getCssSheet = function(){
			return cssSheet;
		};
		
		that.addRule = function(selector, cssText){
			var rules = cssSheet.rules || cssSheet.cssRules;
			if(cssSheet.addRule){
				cssSheet.addRule(selector, cssText, rules.length);
			}else if(cssSheet.insertRule){
				cssSheet.insertRule(selector + ' {' + cssText + '}', rules.length);
			}
			
		};
		
		that.destory = function(){
			head.removeChild(cssDom);
			cssDom = null;
			cssSheet = null;
			cssId = null;
		};
		
		return that;
	};
	
	var transitionendEventName = $.core.evt.eventName('transitionend');
	
	return function(node, spec){
		var conf = $.core.obj.parseParam({
			'target' : '',
			'duration' : 500,
			'timingFn' : [0, 0, 1, 1],
			'callback' : function(){}
		}, spec);
		var aniText		= 'all ' + conf.duration + 'ms cubic-bezier(' + conf.timingFn.join(',') + ')';
		var css			= $.core.dom.cssText(node.style.cssText);
		var selector	= 'test';
		var sheet		= transitionSheet();
		css.merge(conf.target);
		css.push('transition', aniText);
		sheet.addRule('.' + selector, css.getCss());
		
		$.core.evt.addEvent(node, transitionendEventName, function(){
			$.core.evt.removeEvent(node, transitionendEventName, arguments.callee);
			node.style.cssText = css.remove('transition').getCss();
			$.core.dom.removeClassName(node, selector);
			sheet.destory();
			aniText = null;
			css = null;
			selector = null;
			sheet = null;
			conf.callback(node);
			conf = null;
		});
		$.core.dom.addClassName(node, selector);
		node.style.cssText = '';
	};
});