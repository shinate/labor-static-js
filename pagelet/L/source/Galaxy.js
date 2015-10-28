/**
 * 星系
 */
var $ = require('/lib/jQuery');
var $Planet = require('Planet');
var $split = require('split');
var $channel = require('channel');
var $custEvent = require('/lib/core/evt/custEvent'); 

var options = {
	
};

var TEMP = {
	'MAIN' : '<div class="IBB-Galaxy"></div>'
	,'REL_LINE' : '<canvas></canvas>'
	,'REL_WORDS' : '<div class="IBB-relation-words"></div>'
};

module.exports = function(opts, GDATA){
	
	var node;
	
	//状态记录
	var status = {
		'x'  : 0
		,'y' : 0
		,'z' : 1000
	};
	
	var planetStatus = [];
	
	var convertStatus = {};
	var convertCss = {};
	
	var STAR
		,PLANETS = []
		,RELS = [];
	
	var it = {
		'init' : function(){
			it.parseParam();
			it.region();
			it.build();
			it.bind();
			//console.log(STAR, PLANETS);
		}
		,'parseParam' : function(){
			opts = $.extend({}, options, opts || {});
		}
		,'build' : function(){
			//galaxy
			var css = {};
			
			node = $(TEMP.MAIN);
			
			css['position'] = 'absolute';
			css['overflow'] = 'hidden';
			
			
			css['height'] = status.height;
			css['width'] = status.width;
			
			node.css(css);
						
			//star 主
			STAR = $Planet(GDATA.star);
			node.append(STAR.get.node());
			
			//关系
			var canvas = $(TEMP.REL_LINE);
			node.append(canvas);
			
			canvas.attr({
				'height' : status.height
				,'width' : status.width
			});
			
			var context = canvas.get(0).getContext("2d");
			
			//planet
			for(var i=0, len=GDATA.planet.length;i<len;i++){
				PLANETS[i] = $Planet(GDATA.planet[i]);
				PLANETS[i].set.pos.apply(null, [planetStatus[i][0], planetStatus[i][1]]);
				node.append(PLANETS[i].get.node());
				
				//绘制连线
				context.beginPath();
				context.moveTo(status.width / 2, status.height / 2);
				context.lineTo(status.width / 2 + planetStatus[i][0], status.height / 2 + planetStatus[i][1]);
				context.lineWidth = 2;
				context.lineCap = "round";
				context.strokeStyle = GDATA.planet[i]['stroke'] || '#000000';
				context.stroke();
				
				if(GDATA.planet[i].hasOwnProperty('relation')){
					//绘制关系描述
					RELS[i] = $(TEMP.REL_WORDS);
					RELS[i].html(GDATA.planet[i].relation);
					node.append(RELS[i]);
					
					RELS[i].css({
						'margin-left' : (planetStatus[i][0] - RELS[i].width()) / 2
						,'margin-top' : (planetStatus[i][1] - RELS[i].height()) / 2
					});
				} else {
					RELS[i] = null;
				}
			}
			
		}
		/**
		 * 确认区域
		 */
		,'region' : function(){
		
			/*
			var w = $(window).width();
			var h = $(document).height();
			
			var s = w < h ? w : h;
			
			s *= 0.8;
			
			s < 600 && (s = 600);
			*/
			
			s = 600;
		
			//planetStatus = $split.fan(GDATA.planet.length, $(window).width(), $(document).height(), 50, 75);
			
			planetStatus = $split.fan(GDATA.planet.length, s, s, 40, 150);
			
			var widthHalf = 0
				,heightHalf = 0
				,pw
				,ph;
			
			for(var i=0, len=planetStatus.length; i<len; i++){
				
				pw = Math.abs(planetStatus[i][0]);
				ph = Math.abs(planetStatus[i][1]);
				
				if(widthHalf < pw){
					widthHalf = pw;
				}
				if(heightHalf < ph){
					heightHalf = ph;
				}
			}
			
			//galaxy
			status.width = widthHalf * 3;
			status.height = heightHalf * 3;
			
			//console.log(status, planetStatus);
			
		}
		,'bind' : function(){
			
			$custEvent.define(self, 'expand');
			
			for(var i=0;i<PLANETS.length;i++){
				PLANETS[i].get.screen().on('click', (function(planet){
					return function(){
						$custEvent.fire(self, 'expand', planet);	//自定义事件
						//$channel.fire('expand', [newPlanetPosByGlaxy]);	//频道
					};
				})(PLANETS[i]));
			}
		}
		,'render' : function(){
			if(convertStatus.hasOwnProperty('x')){
				convertCss['left'] = convertStatus.x;
			}
			
			if(convertStatus.hasOwnProperty('y')){
				convertCss['top'] = convertStatus.y;
			}
			
			node.css(convertCss);
			
			$.extend(status, convertStatus);
			
			convertStatus = {};
			convertCss = {};
		}
		,'set' : {
			'pos' : function(x, y, z){
				typeof x === 'number' && (convertStatus.x = x);
				typeof y === 'number' && (convertStatus.y = y);
				typeof z === 'number' && (convertStatus.z = z);
				it.render();
			}
			,'focPos' : function(focX, focY, z){
				typeof x === 'number' && (convertStatus.x = x - (status.width / 2));
				typeof y === 'number' && (convertStatus.y = y - (status.height / 2));
				typeof z === 'number' && (convertStatus.z = z);
				it.render();
			}
		}
		,'get' : {
			'node' : function(){
				return node;
			}
			,'size' : function(){
				return {
					'width' : status.width
					,'height' : status.height
				};
			}
			,'width' : function(){
				return status.width;
			}
			,'height' : function(){
				return status.height;
			}
			,'x' : function(){
				return status.x;
			}
			,'y' : function(){
				return status.y;
			}
			,'z' : function(){
				return status.z;
			}
			,'pos' : function(){
				return {
					'x'  : status.x
					,'y' : status.y
					,'z' : status.z
				};
			}
			,'focPos' : function(){
				return {
					'x'  : it.get.focX()
					,'y' : it.get.focY()
					,'z' : status.z
				};
			}
			,'focX' : function(){
				return status.x + (status.width / 2);
			}
			,'focY' : function(){
				return status.y + (status.height / 2);
			}
		}
	};
	
	var self = {
		'get'  : it.get
		,'set' : it.set
	};
	
	it.init();
	
	return self;
};
