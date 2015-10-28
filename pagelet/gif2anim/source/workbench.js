var $ = require('/lib/jQuery');
var Charon = require('/lib/Charon');

var options = {
	'width'   : 1024
	,'height' : -1
};

module.exports = function(node, opts){
	var canvas;
	var ctx;
	var msgTip;
	
	var it = {
		'init' : function(){
			it.parseParam();
			it.parseDOM();
			it.initPlugins();
			it.bind();
		}
		,'parseDOM' : function(){
			node = $(node);
			canvas = $('<canvas></canvas>');
			node.append(canvas);
			ctx = canvas.get(0).getContext('2d');
		}
		,'parseParam' : function(){
			opts = $.extend({}, options, opts || {});
		}
		,'bind' : function(){
			
		}
		,'initPlugins' : function(){
			
		}
		,'set' : {
			'options' : function(o){
				opts = $.extend({}, opts, o || {});
			}
		}
		,'create' : function(picData){
			
		}
		,'handle' : {
			
		}
		,'draw' : {
			'point' : function(x, y, color){
				ctx.fillStyle = '#' +
					(color[0] <= 0xf ? "0" : "") + color[0].toString(16) +
					(color[1] <= 0xf ? "0" : "") + color[1].toString(16) +
					(color[2] <= 0xf ? "0" : "") + color[2].toString(16);
				ctx.fillRect(x, y, 1, 1);
			}
			,'clip' : function(x, y, w, h, data){
				var cx = 0, cy = 0;
				for(var i in data){
					it.draw.point(x + cx, y + cy, data[i]);
					cx += 1;
					if(cx >= w){
						cx = cx - w;
						cy += 1;
					}
				}
			}
			,'pics' : function(fs){
				var x, y, i, j, f, fr, cx = 0, cy = 0;
				opts.height = 0;
				for(i in fs){
					x = Math.floor(opts.width / fs[i].width);
					y = Math.ceil(fs[i].frames.length / x);
					opts.height += y * fs[i].height;
					opts.originalWidth = x * fs[i].width;
					opts.originalHeight = opts.height * 1;
				}
				canvas.attr('width', opts.originalWidth + 'px');
				canvas.attr('height', opts.originalHeight + 'px');
				
				for(i in fs){
					f = fs[i];
					x = Math.floor(opts.width / f.width);
					y = Math.ceil(f.frames.length / x);
					for(j in f.frames){
						fr = f.frames[j];
						it.draw.clip(cx * f.width, cy * f.height, f.width, f.height, fr.exactData);
						cx += 1;
						if(cx >= x){
							cx = cx - x;
							cy += 1;
						}
					}
				}
			}
		}
	};
	
	var self = {
		'draw' : it.draw.pics
	};
	
	it.init();
	
	return self;
};