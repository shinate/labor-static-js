var $ = require('../../jQuery');

module.exports = function(node){
	node = $(node).get(0);
	return (node != undefined) && Boolean(node.nodeName) && Boolean(node.nodeType);
};