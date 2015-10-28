module.exports = function(oElement, aSource){
	if (aSource.indexOf) {
		return aSource.indexOf(oElement);
	}
	for (var i = 0, len = aSource.length; i < len; i++) {
		if (aSource[i] === oElement) {
			return i;
		}
	}
	return -1;
};