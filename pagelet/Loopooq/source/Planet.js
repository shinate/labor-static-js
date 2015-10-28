/**
 * 星球
 */
var $ = require('/lib/jQuery');
var $channel = require('channel');

var options = {
	'id' : null
};

var TEMP = [
	'<div class="Planet">'
		,'<div node-type="land" class="Land"></div>'
	,'</div>'
].join('');

module.exports = function(opts){
	
	var node
		,nodes;
	
	var LSN = {};
	
	var status = {};
	
	var it = {
		'init' : function(){
			it.parseParam();
			
			if(!opts['id']){
				return;
			}
			
			it.build();
			it.bind();
		}
		,'parseParam' : function(){
			opts = $.extend({}, options, opts || {});
		}
		/**
		 * 创建
		 */
		,'build' : function(){
			node = $(TEMP);
			nodes = $.Ex.builder(node);
			
			nodes.box = node;
			//console.log('Planet', node, nodes);
		}
		/**
		 * 获取参数
		 */
		,'get' : {
			'node' : function(){
				return node;
			}
			,'dom' : function(name){
				return name && nodes[name] ? nodes[name] : node.find('[node-type="'+name+'"]');
			}
			,'status' : function(){
				return status;
			}
		}
		,'bind' : function(){
			//nodes.land.on('mouseenter', it.domEvts.mouseEnter);
			//nodes.land.on('mouseleave', it.domEvts.mouseLeave);
			
			//nodes.land.on('click', it.domEvts.expan);
			//nodes.btn_add.on('click', it.domEvts.add);
		}
		,'unbind' : function(){
			
		}
		,'domEvts' : {
			'add' : function(e){
				e.preventDefault();
				$channel.fire('add');
			}
			,'expan' : function(e){
				//console.log('Expan');
				e.preventDefault();
				if(LSN['btnShow']){
					Buttons.aniShow();
				}
			}
			,'mouseEnter' : function(){
				//console.log('mouseEnter');
				Buttons.aniShow();
			}
			,'mouseLeave' : function(){
				//console.log('mouseLeave');
				Buttons.aniHide();
			}
		}
		,'getDOM' : function(selector){
			return node.find(selector);
		}
		,'handle' : {
			
		}
	};
	
	var Buttons = {
		'aniShow' : function(){
			LSN['btnShow'] && clearTimeout(LSN.btnShow);
			LSN['btnHide'] && clearTimeout(LSN.btnHide);
			LSN.btnShow = setTimeout(Buttons.show, 1200);
		}
		,'aniHide' : function(){
			LSN['btnShow'] && clearTimeout(LSN.btnShow);
			LSN['btnHide'] && clearTimeout(LSN.btnHide);
			LSN.btnHide = setTimeout(Buttons.hide, 1200);
		}
		,'show' : function(){
			/**
			 * Buttons
			 */
			nodes.btn_up.show();
			nodes.btn_down.show();
			nodes.btn_add.show();
			
			nodes.btn_up.css({
				'margin-left' : (Math.cos((2*Math.PI / 360) * -55) * ((opts.size[0] / 2) + 12)) - (nodes.btn_up.width() / 2)
				,'margin-top' : (Math.sin((2*Math.PI / 360) * -55) * ((opts.size[1] / 2) + 12)) - (nodes.btn_up.height() / 2)
			});
			
			nodes.btn_down.css({
				'margin-left' : (Math.cos((2*Math.PI / 360) * -30) * ((opts.size[0] / 2) + 12)) - (nodes.btn_down.width() / 2)
				,'margin-top' : (Math.sin((2*Math.PI / 360) * -30) * ((opts.size[1] / 2) + 12)) - (nodes.btn_down.height() / 2)
			});
			
			nodes.btn_add.css({
				'margin-left' : (Math.cos((2*Math.PI / 360) * 45) * ((opts.size[0] / 2) + 20)) - (nodes.btn_add.width() / 2)
				,'margin-top' : (Math.sin((2*Math.PI / 360) * 45) * ((opts.size[1] / 2) + 20)) - (nodes.btn_add.height() / 2)
			});
		}
		,'hide' : function(){
			nodes.btn_up.hide();
			nodes.btn_down.hide();
			nodes.btn_add.hide();
		}
	};
	
	var self = {};
	
	it.init();
	
	self.node = node;
	self.opts = opts;
	self.status = status;
	self.get = it.get;
	
	return self;
};
