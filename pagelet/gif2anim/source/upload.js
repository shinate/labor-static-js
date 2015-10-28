var $ = require('/lib/jQuery');
var Charon = require('/lib/Charon');

var ACCEPTED_FILE_TYPES = {
	'image/png'   : true
	,'image/jpeg' : true
	,'image/gif'  : true
};

module.exports = function(node){
	
	var nodes;
		
	var state = {
		'uploading' : 0
	};
	
	var it = {
		'init' : function(){
			it.parseDOM();
			it.bind();
		}
		,'parseDOM' : function(){
			nodes = $.Ex.builder(node);
		}
		,'bind' : function(){
			nodes.tiggerUpload
				.on('dragover', it.domEvt.dragover)
				.on('dragend', it.domEvt.dragend)
				.on('dragleave', it.domEvt.dragleave)
				.on('drop', it.domEvt.drop);
			
			nodes.inputUpload
				.on('change', it.domEvt.change);
				
			//channel
			UPChannel = Charon.chain('upload');
			UPChannel.register('lock', it.handle.lock);
			UPChannel.register('unlock', it.handle.unlock);
		}
		,'domEvt' : {
			'dragover' : function(e){
			    e.preventDefault();
			    $(this).addClass('hover');
			}
			,'dragend' : function(e){
			    e.preventDefault();
				$(this).removeClass('hover');
			}
			,'dragleave' : function(e){
			    e.preventDefault();
			    $(this).removeClass('hover');
			}
			,'drop' : function(e){
			    e.preventDefault();
			    e = e.originalEvent;
			    $(this).removeClass('hover');
			    it.handle.readFiles(e.dataTransfer.files);
			}
			,'change' : function(e){
			    e = e.originalEvent;
			    it.handle.readFiles(e.target.files);
			}
		}
		,'handle' : {
			'readFiles' : function(files){
				state.uploading = files.length;
				var file;
				for (var i=0; i<files.length; i++) {
					file = files[i];
					if(ACCEPTED_FILE_TYPES[file.type] === true) {
						var reader = new FileReader();
						reader.onload = function(e) {
							state.uploading --;
							Charon.chain('preview').fire('create', e.target.result);
							//e.target.result
						};
						reader.readAsDataURL(file);
					}
				}
			}
		}
	};
	
	it.init();
	
	return it;
};
