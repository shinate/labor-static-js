var $ = require('/lib/jQuery');
var bubble = require('ui/tinyConfirm');

var BUBBLES = [];
var handle = function(){
	var len = BUBBLES.length;
	if(len > 0){
		for(var i=0;i<len;i++){
			if(!BUBBLES[i].inuse()){
				return BUBBLES[i];
			}
		}
	}
	BUBBLES[len] = bubble();
	return BUBBLES[len];
};
	
module.exports = function(el, msg, opts){
	return handle().show(el, msg || '', opts || {});
};
