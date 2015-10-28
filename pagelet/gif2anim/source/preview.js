var Charon = require('/lib/Charon');

module.exports = function(node){
	
	var it = {
		'init' : function(){
			it.bind();
		}
		,'bind' : function(){
			Charon.chain('preview').register('create', it.handle.create);
		}
		,'handle' : {
			'create' : function(data){
				Charon.log(data);
			}
		}
	};
	
	it.init();
};