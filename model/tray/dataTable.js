( function(factory) {

	if ( typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(factory);
	} else if ( typeof exports === 'object') {
		// Node/CommonJS style for Browserify
		module.exports = factory();
	}

}(function() {

	var $isArray = require('/lib/core/arr/isArray');
	var $isObject = require('/lib/core/obj/isObject');

	function parseData(data) {

		var s = [];

		s.push('<table border="0" cellpadding="0" cellspacing="0" class="Co-tray-dataTable"><tbody>');
		
		if ($isArray(data)) {
			s.push('<tr>');
			for (var i = 0, len = data.length; i < len; i++) {
				s.push('<td>' + parseData(data[i]) + '</td>');
			}
			s.push('</tr>');
		} else if ($isObject(data)) {
			for (var i in data) {
				s.push('<tr><th>' + i + '</th><td>' + parseData(data[i]) + '</td></tr>');
			}
		} else {
			s.push('<tr><td>' + data.toString() + '</td></tr>');
		}

		s.push('</tbody></table>');

		return s.join('');
	}

	return parseData;
}));
