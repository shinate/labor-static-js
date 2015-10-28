var $ = require('core');

/**
 * ===================================================================
 * = 静态扩展
 * ===================================================================
 */
var __method__ = {
	'browser'       : require('Ex/browser')
	,'clone'        : require('Ex/clone')
	,'builder'      : require('Ex/builder')
	,'queryToJson'  : require('Ex/queryToJson')
};

/**
 * ===================================================================
 * = 动态扩展
 * ===================================================================
 */
var __prototype__ = {
	'isNode'        : require('Ex/isNode')
	,'css3'         : require('Ex/css3')
	,'CatDD'        : require('Ex/cat/dragdrop')
};

$.Ex = $.extend({}, __method__, __prototype__);

for(var item in __prototype__){
	$.fn[item] = (function(i){
		return function(){
			return __prototype__[i].apply(null, [].concat($(this), Array.prototype.slice.call(arguments)));
		};
	})(item);
}


