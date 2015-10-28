module.exports = window.hasOwnProperty('Catlike') ?
	window.Catlike :
	(function(){
		window.Catlike = require('/lib/Catlike/core');
		return window.Catlike;
	})();