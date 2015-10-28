var $ = require('/lib/jQuery');
var $Planet = require('Planet');
var $split = require('split');
var $channel = require('channel');
var $custEvent = require('/lib/core/evt/custEvent'); 

var TEMP = {
	'FRAME' : '<div class="IBB-Stars"></div>'
};

module.exports = function(opts, SData){
	
	var node;
	var nodes = [];
	
	var it = {
		'init' : function(){
			it.build();
			it.bind();
		}
		,'build' : function(){
			node = $(TEMP.FRAME);
			
			var size = {
				'width' : $(window).width()
				,'height' : $(document).height() - 100
			};
			
			node.css({
				'width' : size.width
				,'height' : size.height
				,'top' : 100
			});
			
			var centerPoint = SData.shift();
			
			nodes[0] = $Planet(centerPoint);
			node.append(nodes[0].get.node());
			//nodes[0].set.pos(0, 0);
			
			var num = SData.length;
			
			var points = $split.fan(num, size.width, size.height, 50, 100);
			
			for(var i=0, index; i<num; i++){
				index = i + 1;
				nodes[index] = $Planet(SData[i]);
				node.append(nodes[index].get.node());
				nodes[index].set.pos(points[i][0], points[i][1]);
			}
		}
		,'bind' : function(){
			$custEvent.define(self, ['expand']);
			
			for(var i=0;i<nodes.length;i++){
				nodes[i].get.screen().on('click', (function(planet){
					return function(){
						$custEvent.fire(self, 'expand', planet);	//自定义事件
						//$channel.fire('expand', [newPlanetPosByGlaxy]);	//频道
					};
				})(nodes[i]));
			}
		}
		,'get' : {
			'node' : function(){
				return node;
			}
			,'nodes' : function(){
				return nodes;
			}
		}
		,'destroy' : function(){
			node.remove();
		}
	};
	
	var self = it;
	
	it.init();
	
	return self;
	
};