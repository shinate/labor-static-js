/**
 * clear Element's children which is textNode
 * @id STK.core.dom.trimNode
 * @alias STK.core.dom.trimNode
 * @param {Element} node
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * STK.core.dom.trimNode($.E('test'));
 */
STK.register('core.dom.trimNode', function($){
	return function(node){
		var cn = node.childNodes;
		for (var i = cn.length - 1; i >= 0; i -= 1) {
			if (cn[i] && (cn[i].nodeType == 3 || cn[i].nodeType == 8)){
				node.removeChild(cn[i]);
			}
		}
	};
});
