var $ = require('/lib/jQuery');
var $cover = require('../cover');

var TEMP = {
	'FRAME' : '' +
		'<div class="Co-bubble-layer Co-bubble-tinyConfirm" style="display:none;width:400px">' +
			'<div class="Co-bubble-tinyConfirm-content" node-type="message"></div>' +
			'<div class="Co-bubble-tinyConfirm-btns">' +
				'<a class="Co-bubble-tinyConfirm-btn-1" href="javascript:void(0)" node-type="btn-1"><span node-type="text-1"></span></a>' +
				'<a class="Co-bubble-tinyConfirm-btn-2" href="javascript:void(0)" node-type="btn-2"><span node-type="text-2"></span></a>' +
			'</div>' +
		'</div>'
};

var options = {
	'BTN_1' : function(){}
	,'TEXT_1' : 'BTN_1'
	,'BTN_2' : function(){}
	,'TEXT_2' : 'BTN_2'
	,'delay' : 0
	,'onHide' : function(){}
};

module.exports = function(){
	
	var opts
		,node
		,inuse = 0
		,nodes = {}
		,callback
		,lsn = {}
		,target;
	
	var it = {
		'init' : function(){
			it.build();
		}
		,'build' : function(){
			if(!node){
				node = $(TEMP.FRAME);
				nodes.message = node.find('[node-type="message"]');
				nodes.btn1 = node.find('[node-type="btn-1"]');
				nodes.text1 = node.find('[node-type="text-1"]');
				nodes.btn2 = node.find('[node-type="btn-2"]');
				nodes.text2 = node.find('[node-type="text-2"]');
				
				node.appendTo($('body'));
			}
		}
		,'bind' : function(){
			
			callback = {
				'BTN_1' : function(){
					opts.BTN_1(self);
					it.hide();
				}
				,'BTN_2' : function(){
					opts.BTN_2(self);
					it.hide();
				}
			};
			
			nodes.btn1.bind('click', callback.BTN_1);
			nodes.btn2.bind('click', callback.BTN_2);
			
			if(opts.delay > 0){
				node.bind('mouseenter', it.autoCancel.stop);
				node.bind('mouseleave', it.autoCancel.start);
				target.bind('mouseenter', it.autoCancel.stop);
				target.bind('mouseleave', it.autoCancel.start);
			}
		}
		,'autoCancel' : {
			'start' : function(){
				it.autoCancel.stop();
				lsn.autoCancel = setTimeout(it.hide, opts.delay);
			}
			,'stop' : function(){
				lsn['autoCancel'] && clearTimeout(lsn.autoCancel);
			}
		}
		,'unbind' : function(){
			nodes.btn1.unbind('click', callback.BTN_1);
			nodes.btn2.unbind('click', callback.BTN_2);
			if(opts.delay > 0){
				it.autoCancel.stop();
				node.unbind('mouseenter', it.autoCancel.stop);
				node.unbind('mouseleave', it.autoCancel.start);
				target.unbind('mouseenter', it.autoCancel.stop);
				target.unbind('mouseleave', it.autoCancel.start);
			}
			callback = null;
		}
		,'setPosition' : function(){
			var tp = target.offset();
			tp.height = target.outerHeight();
			tp.width = target.outerWidth();
			
			/*
			if(node.outerWidth() > 200){
				node.css('width', 200);
			}
			*/
			
			var ns = {
				'width' : node.outerWidth()
				,'height' : node.outerHeight()
			};
			
			console.log(tp, ns);
			
			var pos = {
				'left' : (tp.width - ns.width) * 0.5 + tp.left
				,'top' : tp.top - ns.height
			};
			
			node.css(pos);
		}
		,'show' : function(el, msg, p){
			inuse = 1;
			msg = msg || '';
			opts = $.extend({}, options, p || {});
			target = el;
			
			nodes.message.html(msg);
			nodes.text1.html(opts.TEXT_1);
			nodes.text2.html(opts.TEXT_2);
			
			$cover.set(node.get(0));
			
			node.show();
			it.setPosition();
			
			it.bind();
			
			return self;
		}
		,'hide' : function(){
			it.unbind();
			opts.onHide();
			node.hide();
			inuse = 0;
			
			opts = callback = target = null;
		}
		,'inuse' : function(){
			return !!inuse;
		}
	};
	
	var self = {
		'show'   : it.show
		,'hide'  : it.hide
		,'inuse' : it.inuse
		,'showed': it.inuse
	};
	
	it.init();
	
	return self;
	
};