module.exports = window['jQuery'] ? 
	window.jQuery : 
	(function(){
		var $ = window.jQuery = require('jQuery/core');
		require('jQuery/extra');
		require('jQuery/Plugins/mouseWheel')($);
		require('jQuery/Plugins/transit')($);
		return $;
	})();