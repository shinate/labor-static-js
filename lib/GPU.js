module.exports = window.hasOwnProperty('GPU') ? 
	window.GPU : 
	(function(){
		window.GPU = require('/lib/Gpu/core');
		return window.GPU;
	})();