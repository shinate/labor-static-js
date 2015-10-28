/**
 * 取最后一个非文本子节点
 * @id STK.core.dom.lastChild
 * @param {Element} el 
 * @return {Element} 
 * @author Finrila|wangzheng4@staff.sina.com.cn
 * @example 
 * STK.core.dom.lastChild(document.body);
 */

$Import('core.dom.dir');

STK.register('core.dom.lastChild',function($){
	
	var dir = $.core.dom.dir;
	
	return function(el) {
		
		if(el.lastElementChild) {
			return el.lastElementChild;
		}
		var lastChild = el.lastChild;
		if(lastChild && lastChild.nodeType != 1) {
			lastChild = dir.prev(lastChild)[0];
		}
		return lastChild;
		
	};
});