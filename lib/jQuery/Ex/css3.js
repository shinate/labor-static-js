var $ = require('../../jQuery');

var prefix = ['-webkit-', '-moz-', '-o-', '-ms-', '-khtml-', ''];

var parseOpts = function(opts){
	var p = {};

	for (var type in opts) {
		for (var i = 0; i < prefix.length; i++) {
			p[prefix[i] + type] = opts[type];
		}
	}
	
	return p;
};

module.exports = function(node, opts) {
	return node.css(parseOpts(opts));
};
