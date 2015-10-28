var $ = require('/lib/jQuery');

var options = {
	'type'      : 'static'
	,'convert'  : 3000
	,'delay'    : 10000
};

module.exports = function(node, imageList, opts){
	
	var MEDIA;
	var STATE = {
		'current'  : -1
		,'changing': -1
		,'loading' : -1
		,'num'     : 0
		,'zIndex'  : 0
	};
	
	var it = {
		'init' : function(){
		
			if(imageList.length == 0){
				throw 'No Media!';
			}
			it.parseParam();
			it.loadMedia();
			it.bind();
		}
		,'parseParam' : function(){
			//过滤
			//imageList = it.unique(imageList);
			MEDIA = [];
			STATE.loading = 0;
			STATE.num = imageList.length;
			opts = $.extend({}, opts, options || {});
		}
		,'bind' : function(){
			$(window).resize(it.autoSizeAtPlay);
		}
		,'autoSizeAtPlay' : function(){
			if(STATE.current > -1){
				it.autoSize(STATE.current);
			}
			if(STATE.changing > -1){
				it.autoSize(STATE.changing);
			}
		}
		,'autoSize' : function(n){
			var c = MEDIA[n], el = MEDIA[n].el, conf = MEDIA[n].conf;
			var nodes = {
				'width' : node.width()
				,'height' : node.height()
			};
			c.scaleX = c.width / nodes.width;
			c.scaleY = c.height / nodes.height;
			c.ratioXY = c.width / c.height;
			
			var scale = c.scaleX < c.scaleY ? c.scaleX : c.scaleY;
			
			var css = {};
			css['height'] = Math.ceil(c.height / scale);
			css['width'] = Math.ceil(c.width / scale);
			
			css['left'] = '50%';
			css['top'] = '50%';			
			css["margin-left"] = 0 - css.width / 2;
			css["margin-top"]  = 0 - css.height / 2;
			
			if(conf.hasOwnProperty(1) && conf[1] !== 0){
				css["margin-left"] -= conf[1] * (css['width'] - nodes.width) * 0.5;
			}
			
			if(conf.hasOwnProperty(2) && conf[2] !== 0){
				css["margin-top"] -= conf[2] * (css['height'] - nodes.height) * 0.5;
			}
			
			el.css(css);
		}
		,'createExt' : function(){
			
		}
		,'loadMedia' : function(){
			MEDIA[STATE.loading] = {};
			MEDIA[STATE.loading].el = $('<img />');
			MEDIA[STATE.loading].conf = imageList[STATE.loading];
			MEDIA[STATE.loading].el.on('load', function(){
				//this
				var self = $(this);
				node.append(self);
				
				MEDIA[STATE.loading].width = self.width();
				MEDIA[STATE.loading].height = self.height();
				
				self.css('position', 'absolute');
				self.css('opacity', 0);
				self.css('z-index', (STATE.num + STATE.loading - 1) % STATE.num);
				STATE.zIndex ++;
												
				//if(STATE.current < 0){
				//	STATE.current = STATE.loading;
				//	it.autoSize(STATE.current);
				//	self.css('opacity', '1');
				//}
				
				//next
				STATE.loading ++;
				if(STATE.loading < STATE.num){
					it.loadMedia();
				} else {
					it.handle.play();
				}
			});
			MEDIA[STATE.loading].el.attr('src', MEDIA[STATE.loading].conf[0]);
		}
		,'next' : function(){
			var current = STATE.current;
			var next = STATE.changing = (STATE.current + 1) % STATE.num;
			if(current !== next && MEDIA[next]){
				it.autoSize(next);
				MEDIA[next].el.css('z-index', ++ STATE.zIndex);
				MEDIA[next].el.animate({
					'opacity' : 1
				}, opts.convert, 'linear', function(){
					MEDIA[current] && MEDIA[current].el.css('opacity', 0);
					STATE.current = 1 * next;
					STATE.changing = -1;
				});
			}
		}
		,'handle' : {
			'play' : function(){
				setInterval(it.next, opts.delay);
			}
			,'pause' : function(){}
			,'stop' : function(){}
		}
		,'unique' : function(o) {
			if (!$.isArray(o)) {
				throw 'the unique function needs an array as first parameter';
			}
			var result = [];
			for (var i = 0, len = o.length; i < len; i += 1) {
				if ($.inArray(o[i], result) === -1) {
					result.push(o[i]);
				}
			}
			return result;
		}
	};
	
	var self = {};
	
	it.init();
	
	return self;
};