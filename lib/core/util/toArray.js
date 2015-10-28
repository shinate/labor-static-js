module.exports = function(o) {
	try {
		return Array.prototype.slice.call(o);
	} catch(e) {
		var arr = [];
		for (var i = 0, len = o.length; i < len; i++) {
			arr[i] = o[i];
		}
		return arr;
	}
};
