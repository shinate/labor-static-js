/**
 * Get keys of Object
 * 
 * keys({a:1,b:2}) ==> ['a', 'b']
 */
var $isObject = require('./isObject');

return function(o) {
	if (!$isObject(o)) {
		throw 'Argument must be an object!';
	}
	var a = [];
	for (var i in o) {
		a.push(i);
	}
	return a;
};
