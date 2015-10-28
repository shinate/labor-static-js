if(!window['__CODATA__']){
	window['__CODATA__'] = {};
};

module.exports = {
	'set' : function(k, v){
		window['__CODATA__'][k] = v;
		return true;
	}
	,'get' : function(k){
		return typeof window['__CODATA__'][k] === 'undefined' ? null : window['__CODATA__'][k];
	}
};