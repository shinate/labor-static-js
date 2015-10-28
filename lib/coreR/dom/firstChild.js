/**
 * 取第一个非文本子节点
 * @id STK.core.dom.firstChild
 * @param {Element} el 
 * @return {Node} 
 * @author Finrila|wangzheng4@staff.sina.com.cn
 * @example 
 * STK.core.dom.firstChild(document.body);
 */
$Import('core.dom.dir');

STK.register('core.dom.firstChild',function($){
	
	var dir = $.core.dom.dir;
	
	return function(el) {
		
		if(el.firstElementChild) {
			return el.firstElementChild;
		}
		var firstChild = el.firstChild;
		if(firstChild && firstChild.nodeType != 1) {
			firstChild = dir.next(firstChild)[0];
		}
		return firstChild;
		
	};
});