/**
 * Fire a node's event
 * @id STK.core.evt.fireEvent
 * @alias STK.core.evt.fireEvent
 * @param {Node} el
 * @param {String} sEvent
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * STK.core.evt.fireEvent($.E('id'),'click');
 */
STK.register('core.evt.fireEvent', function($){
	return function(el, sEvent){
		var _el = $.E(el);
		if(_el.addEventListener){//由于IE9下有两种事件模型，所以addEvent,removeEvent,fireEvent的判定方式要相同
			var evt = document.createEvent('HTMLEvents');
			evt.initEvent(sEvent, true, true);
			_el.dispatchEvent(evt);
		}else{
			_el.fireEvent('on' + sEvent);
		}
	};
});
