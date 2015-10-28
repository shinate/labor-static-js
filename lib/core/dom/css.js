var $setStyle = require('setStyle');
var $isNode = require('../dom/isNode');

module.exports = function(node, styles){
	if($isNode(node) && typeof styles === 'object'){
		for(var s in styles){
			$setStyle(node, s, styles[s]);
		}
	}
};