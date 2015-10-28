var $ = require('/lib/jQuery');
var GIFParser = require('/lib/image/GIFParser');

var upload = require('upload');
var parser = require('parser');
var workbench = require('workbench');
var preview = require('preview');
	
var options = {
	'acceptedFileTypes' : {
		'image/png'   : true
		,'image/jpeg' : true
		,'image/gif'  : true
    }
};

var IS = {
  'FILEREADER' : typeof FileReader !== 'undefined',
  'DND'        : 'draggable' in document.createElement('span'),
  'FORMATDATA' : !!window.FormData,
  'PROGRESS'   : "upload" in new XMLHttpRequest
};

var uniqueID = 	(function(){
	var _loadTime = +new Date(), _i = 1;
	return function() {
		return '' + _loadTime + _i++;
	};
})();

var getOriginalEvent = function(e){
	return e.originalEvent;
};

module.exports = function(node){
	
	var state = {
		'uploading' : 0
	};
	
	var G2A_UTILS = {};
	
	var PIC_LIB = {
		'GIF' : GIFParser
	};
	
	var PIC_LIST = {};
	
	var nodes;
	
	var it = {
		'init' : function(){
			it.parseDOM();
			it.bind();
			
			it.initPlugins();
		}
		,'parseDOM' : function(){
			nodes = $.Ex.builder(node);
		}
		,'initPlugins' : function(){
			G2A_UTILS.workbench = workbench(nodes.workbench);
			G2A_UTILS.preview = preview(nodes.preview);
		}
		,'bind' : function(){
			var t;
			for(var e in it.domEvt){
				t = e.split('_');
				nodes[t[0]].on(t[1], it.domEvt[e]);
			}
		}
		,'domEvt' : {
			'tiggerUpload_dragover' : function(e){
			    e.preventDefault();
			    $(this).addClass('hover');
			}
			,'tiggerUpload_dragend' : function(e){
			    e.preventDefault();
				$(this).removeClass('hover');
			}
			,'tiggerUpload_dragleave' : function(e){
			    e.preventDefault();
			    $(this).removeClass('hover');
			}
			,'tiggerUpload_drop' : function(e){
			    e.preventDefault();
			    e = getOriginalEvent(e);
			    $(this).removeClass('hover');
			    it.handle.readfiles(e.dataTransfer.files);
			}
			,'inputUpload_change' : function(e){
			    e = getOriginalEvent(e);
			    it.handle.readfiles(e.target.files);
			}
		}
		,'handle' : {
			'readfiles' : function(files){
				state.uploading = files.length;
				for (var i = 0; i < files.length; i++) {
					it.handle.readfile(files[i]);
				}
			}
			,'readfile' : function(file) {
				if(options.acceptedFileTypes[file.type] === true) {
					var reader = new FileReader();
					reader.onload = function(e) {
						state.uploading --;
						it.picWork.analyze(e.target.result);
						if(state.uploading <= 0){
							it.picWork.create();
						}
					};
					reader.readAsDataURL(file);
				}
			}
		}
		,'picWork' : {
			'analyze' : function(fileResult){
				var type = it.picWork.type(fileResult);
				var id = uniqueID();
				PIC_LIST[id] = PIC_LIB[type](fileResult).data();
				console.log(PIC_LIST[id]);
			}
			,'type' : function(fileResult){
				return fileResult.match(/:image\/(\w+);/)[1].toUpperCase();
			}
			,'create' : function(){
				G2A_UTILS.workbench.draw(PIC_LIST);
			}
		}
	};
	
	it.init();
};
