/**
 * Add event for a node
 * @id STK.core.evt.addEvent
 * @alias STK.core.evt.addEvent
 * @param {Node} sNode
 * @param {String} sEventType
 * @param {Function} oFunc
 * @return {Boolean} TRUE/FALSE
 * @author Robin Young | yonglin@staff.sina.com.cn
 *         FlashSoft | fangchao@staff.sina.com.cn
 * @example
 * STK.core.evt.addEvent($.E('id'),'click',function(e){
 * 	console.log(e);
 * });
 */
STK.register('core.evt.addEvent', function($) {
    return function(el, type, fn) {
        el = $.E(el);
	    if (el == null) {
	        return false;
	    }
	    if (typeof fn !== "function") {
	        return false;
	    }
        if (el.addEventListener) {
            el.addEventListener(type, fn, false);
        } else if (el.attachEvent) {
            el.attachEvent('on' + type, fn);
        } else {
            el['on' + type] = fn;
        }
        return true;
    };
});
