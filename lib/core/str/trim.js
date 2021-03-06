/**
 * delete the space at the beginning and end of the string
 * @param {String} str
 * @return {String} str
 */
(function(global, factory){
	if(typeof define === 'function' && define.amd){
		define(factory(global));
	} else if ( typeof module === "object" && typeof module.exports === "object" ) {
		module.exports = factory(global);
	} else {
		global.trim = factory(global);
	}
})(typeof window !== "undefined" ? window : this, function(window){
	
	return function(str) {
		if ( typeof str !== 'string') {
			throw 'trim parameter must be a string!';
		}
		var len = str.length;
		var s = 0;
		var reg = /(\u3000|\s|\t|\u00A0)/;
	
		while (s < len) {
			if (!reg.test(str.charAt(s))) {
				break;
			}
			s += 1;
		}
		while (len > s) {
			if (!reg.test(str.charAt(len - 1))) {
				break;
			}
			len -= 1;
		}
		return str.slice(s, len);
	};
	
});
