module.exports = window.hasOwnProperty('Svg') ?
	window.Svg :
	(function(){
		window.Svg = require('/lib/Svg/core');
		return window.Svg;
	})();