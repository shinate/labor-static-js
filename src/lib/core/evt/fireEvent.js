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
module.exports = function(el, sEvent) {
	if (el.addEventListener) {//由于IE9下有两种事件模型，所以addEvent,removeEvent,fireEvent的判定方式要相同
		var evt = document.createEvent('HTMLEvents');
		evt.initEvent(sEvent, true, true);
		el.dispatchEvent(evt);
	} else {
		el.fireEvent('on' + sEvent);
	}
};
