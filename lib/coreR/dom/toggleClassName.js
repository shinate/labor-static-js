/**
 * to toggle Element's classname 样式名称切换
 * @id STK.core.dom.toggleClassName
 * @alias STK.core.dom.toggleClassName
 * @param {Element} node
 * @param {String} className
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * STK.core.dom.toggleClassName($.E('test'),'classname1');
 */
$Import('core.dom.hasClassName');
$Import('core.dom.addClassName');
$Import('core.dom.removeClassName');

STK.register('core.dom.toggleClassName', function($){
	return function(node, className){
		if($.core.dom.hasClassName(node, className)){
			$.core.dom.removeClassName(node, className);
		}else{
			$.core.dom.addClassName(node, className);
		}
	};
});

