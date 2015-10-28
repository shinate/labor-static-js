module.exports = window.hasOwnProperty('Charon') ?
	window.Charon :
	(function(){
		window.Charon = require('/lib/Charon/core');
		return window.Charon;
	})();