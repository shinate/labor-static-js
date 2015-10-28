var $ = require('/lib/jQuery');
var $channel = require('channel');

module.exports = function(node){
	
	var nodes;
	
	var it = {
		'init' : function(){
			it.parseDOM();
			it.bind();
		}
		,'parseDOM' : function(){
			nodes = $.Ex.builder(node);
			
			node.css({
				'top'      : -65
				,'opacity' : 0
				,'display' : ''
			});
		}
		,'bind' : function(){
			nodes.btn_search.on('click', function(){
				$channel.fire('search', nodes.search_word.val());
			});
			nodes.btn_add.on('click', function(){
				$channel.fire('add');
			});
			
			$channel.register('searchBar.hide', it.hide);
			$channel.register('searchBar.show', it.show);
		}
		,'hide' : function(){
			node.animate({
				'top'      : -65
				,'opacity' : 0
			}, 500);
		}
		,'show' : function(){
			node.animate({
				'top'      : 20
				,'opacity' : 1
			}, 500);
		}
	};
	
	var self = it;
	
	it.init();
	
	return self;
	
};
