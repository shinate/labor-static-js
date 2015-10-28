var $ = require('/lib/jQuery');

var TEMP = {
	'FRAME' : '<div class="Co-tray-message"></div>'
	,'ITEM' : '<div node-type="item" style="display:none" class="Co-tray-message-item"></div>'
	,'CONTENT' : '' +
		'<div node-type="content" class="Co-tray-message-content"></div>' +
			'<div node-type="digital" style="display:none" class="Co-tray-message-digital"></div>' +
			'<div node-type="bar" style="display:none" class="Co-tray-message-bar">' +
				'<div node-type="strip" class="Co-tray-message-bar-percent"></div>' +
			'</div>' +
		'</div>'
};

var MSG_CONF = {
	'm'  : undefined
	,'t' : -1
	,'c' : -1
};

var options = {
	'autohide' : 3000
};

module.exports = function(opts){
	
	var nodes = {}
		,cache = {}
		,cur_conf
		,shown = false
		,lsn;
	
	var it = {
		'init' : function(){
			it.parseParam();
			it.build();
			it.bind();
		}
		,'parseParam' : function(){
			opts = $.extend({}, options, opts || {});
		}
		,'build' : function(){
			nodes.frame = $(TEMP.FRAME);
			nodes.frame.appendTo($('body'));
			nodes.item = {};
		}
		,'bind' : function(){
			//Charon.boat.sign('Co-tray-message', it.show);
			//window.co_tray_message = self;
		}
		,'frameAutohide' : function(){
			for(var i in cache){
				if(cache[i].shown) return;
			}
			nodes.frame.hide();
			shown = false;
		}
		,'show' : function(key, data, op){
			
			if(typeof cache[key] === 'undefined'){
				cache[key] = {};
			}
			
			if(cache[key]['lsn']){
				clearTimeout(cache[key].lsn);
			}
			
			cache[key].conf = $.extend({}, MSG_CONF, data || {});
			op = $.extend({}, opts, op || {});
			
			if(typeof cache[key].conf['m'] !== undefined){
				
				cache[key].shown = false;
				
				if(typeof nodes.item[key] === 'undefined'){
					var item = $(TEMP.ITEM);
					item.appendTo(nodes.frame);
					item.html(TEMP.CONTENT);
					nodes.item[key] = $.Ex.builder(item);
					nodes.item[key].item = item;
				}
				
				if(!cache[key]['shown']){
					if(!shown){
						nodes.frame.show();
						shown = true;
					}
					nodes.item[key].item.show();
					cache[key].shown = true;
				}
				
				nodes.item[key].content.html(cache[key].conf.m);
			
				if(cache[key].conf.t > -1 && cache[key].conf.c > -1){
					nodes.item[key].bar.show();
					nodes.item[key].digital.show();
					nodes.item[key].strip.css('width', cache[key].conf.c / cache[key].conf.t * 100 + '%');
					nodes.item[key].digital.html(cache[key].conf.c + '/' + cache[key].conf.t);
				}
				
				if(op.autohide > 0){
					cache[key].lsn = setTimeout(function(){
						nodes.item[key].item.hide();
						cache[key].shown = false;
						it.frameAutohide();
					}, op.autohide);
				}
			}
		}
		,'msg' : function(key, content, op){
			it.show(key, {m:content}, op || {});
		}
	};
	
	var self = {
		'show'  : it.show
		,'msg'  : it.msg
	};
	
	it.init();
	
	return self;
};
