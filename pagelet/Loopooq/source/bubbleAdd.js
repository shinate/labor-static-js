var $ = require('/lib/jQuery');
var $channel = require('channel');

var TEMP = {
	'FRAME' : '' +
		'<div node-type="box" class="bubble_add">' +
			'<div class="bubble_add-util bubble_add-title">' +
				'<span>TITLE</span>' +
				'<input node-type="item_title" name="title" type="text" />' +
			'</div>' +
			'<div class="bubble_add-util bubble_add-url">' +
				'<span>URL</span>' +
				'<input node-type="item_url" name="url" type="text" />' +
			'</div>' +
			'<div class="bubble_add-util bubble_add-relation">' +
				'<span>REL</span>' +
				'<input node-type="item_relation" name="rel" type="text" />' +
			'</div>' +
			'<div class="bubble_add-util bubble_add-description">' +
				'<span>DESC</span>' +
				'<textarea node-type="item_description" name="desc"></textarea>' +
			'</div>' +
			'<div class="bubble_add-util">' +
				'<a node-type="btn_add" href="javascript:void(0)" class="bubble_add-btn_add">ADD +</a>' +
				'<a node-type="btn_cancel" href="javascript:void(0)" class="bubble_add-btn_cancel">CANCEL</a>' +
			'</div>' +
		'</div>'
};

module.exports = function(){
	
	var node, nodes;
	
	var isShown = false;
	
	var it = {
		'init' : function(){
			it.build();
			it.bind();
		}
		,'build' : function(){
			node = $(TEMP.FRAME);
			nodes = $.Ex.builder(node);
			
			node.css({
				'display'  : 'none'
				,'opacity' : 0
			});
			
			//console.log(node, nodes);
			$('body').append(node);
		}
		,'bind' : function(){
			nodes.btn_cancel.on('click', it.domEvts.hide);
			
			$channel.register('add', it.show);
		}
		,'show' : function(){
			if(isShown){
				return;
			}
			isShown = true;
			node.css({
				'display' : ''
			});
			it.setMiddle();
			node.animate({
				'opacity' : 1
			}, 300);
		}
		,'hide' : function(){
			node.animate({
				'opacity' : 0
			}, 300, function(){
				node.css({
					'display' : 'none'
				});
				isShown = false;
			});
		}
		,'clean' : function(){
		
		}
		,'setMiddle' : function(){
			node.css({
				'left' : '50%'
				,'top' : '50%'
				,'margin-left' : node.outerWidth() * -0.5
				,'margin-top' : node.outerHeight() * -0.5
			});
		}
		,'domEvts' : {
			'hide' : function(e){
				e.preventDefault();
				it.hide();
			}
		}
	};
	
	var self = it;
	
	it.init();
	
	return self;
	
};