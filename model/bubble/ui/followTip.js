var $removeNode = require('/lib/core/dom/removeNode');

var $css = require('/lib/core/dom/css');

module.exports = function() {

	var node = document.createElement('div');

	$css(node, {
		'position'          : 'absolute'
		,'background-color' : '#FFFFFF'
		,'border'           : '1px solid #CCCCCC'
		,'padding'          : '3px'
	});
	
	document.body.appendChild(node);

	return {
		'show' : function(content, pos) {
			node.innerHTML = content;
			$css(node, {
				'display'      : ''
				,'left'        : pos[0] + 'px'
				,'top'         : pos[1] + 'px'
			});
			
			$css(node, {
				'margin-left' : - node.offsetWidth / 2
			});
		}
		,'hide' : function() {
			$css(node, {
				'display' : 'none'
			});
		}
		,'destroy' : function(){
			$removeNode(node);
		}
	};
};
