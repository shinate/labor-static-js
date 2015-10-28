module.exports = function(str) {
	var h = 0, off = 0;
	var len = str.length;
	for (var i = 0; i < len; i++) {
		h = 31 * h + str.charCodeAt(off++);
	}
	var t = -2147483648 * 2;
	while (h > 2147483647) {
		h += t;
	}
	return h;
};