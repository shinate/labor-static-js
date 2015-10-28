var $ = require('/lib/jQuery');
var $Planet = require('Planet');
var $split = require('split');
var $channel = require('channel');
var $custEvent = require('/lib/core/evt/custEvent'); 

var TEMP = {
	'FRAME' : '<div class="Stars"></div>'
};

module.exports = function(opts, SDATA){
	
	var node;
	
	var PLANET = [];
	
	var it = {
		'init' : function(){
			it.build();
			it.bind();
		}
		,'build' : function(){
			node = $(TEMP.FRAME);
		
			var size = [
				$(window).width()
				,$(document).height() - 100
			];
			
			/*
			node.css({
				'width' : size.width
				,'height' : size.height
				,'top' : 100
			});
			*/
			
			//var centerPoint = SDATA.shift();
			
			//PLANET[0] = $Planet(centerPoint);
			//node.append(PLANET[0].node);
			
			var len = SDATA.length;
			var points = $split.fan(len, size, {
				'pointRadius' : 80
				,'centerPaddingRadius' : 0
			});
			
			for(var i=0; i<len; i++){
				PLANET[i] = $Planet(SDATA[i]);
				node.append(PLANET[i].node);
				PLANET[i].get.dom('land').html(SDATA[i].land);
				PLANET[i].get.dom('land').css({
					'width': SDATA[i].size
					,'height': SDATA[i].size
				});
				PLANET[i].node.css3({
					'transform' : 'translate3d(' + points[i][0] + 'px, ' + points[i][1] + 'px, 0)'
				});
				PLANET[i].node.css({
					'opacity' : 0
				});
				PLANET[i].status = points[i];
				
				(function(p){
					setTimeout(function(){
						p.animate({
							'opacity' : 1
						}, 500);
					}, 300 + Math.random() * 1000);
				})(PLANET[i].node);
			}
		}
		,'bind' : function(){
			$custEvent.define(self, ['seed']);
			
			for(var i=0;i<PLANET.length;i++){
				PLANET[i].get.dom('thumbnal').click((function(planet){
					return function(){
						$custEvent.fire(self, 'seed', planet);	//自定义事件
						//$channel.fire('expand', [newPlanetPosByGlaxy]);	//频道
					};
				})(PLANET[i]));
			}
		}
		,'hideAll' : function(){
			for(var i=0,len=PLANET.length;i<len;i++){
				PLANET[i].node.hide(200);
			}
		}
	};
	
	var self = {};
	
	it.init();
	
	self.node = node;
	self.hideAll = it.hideAll;
	
	return self;
	
};