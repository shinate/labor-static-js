var $hasProp = require('/lib/core/obj/hasProp');

var $css = require('/lib/core/dom/css');

var $followTip = require('ui/followTip');

var cache = {};

module.exports = {
	'show' : function(name, content, position) {
		
		if (!$hasProp(cache, name)) {
			cache[name] = $followTip();
		}

		cache[name].show(content, position);
	},
	'hide' : function(name) {
		if ($hasProp(cache, name)) {
			cache[name].hide();
		}
	}
};

