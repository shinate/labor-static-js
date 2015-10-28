/**
 * @param {String} str
 * @return {Boolean}
 */
function hasHtmlCode(str) {
	return /&amp;|&quot;|&[lg]t;/.test(str);
}

/**
 * @param {String} str
 * @return {String}
 */
function encode(str) {
	return str.replace(/&/g, '&amp;').replace(/\"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * @param {String} str
 * @return {String}
 */
function decode(str) {
	return str.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
}

module.exports = {

	/**
	 * @param {String} str
	 * @return {String}
	 */
	'encode' : function(str) {
		if ( typeof str !== 'string') {
			throw 'htmlCode.encode parameter must be a string!';
		}
		return encode(str);
	},

	/**
	 * @param {String} str
	 * @param {Boolean} depth
	 * @return {String}
	 */
	'decode' : function(str, depth) {
		if ( typeof str !== 'string') {
			throw 'htmlCode.decode parameter must be a string!';
		}

		if (!!(depth || 0)) {
			do {
				str = decode(str);
			} while ( hasHtmlCode(str) );

			return str;
		} else {
			return decode(str);
		}
	}
};