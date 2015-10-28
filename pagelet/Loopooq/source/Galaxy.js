/**
 * 星系
 */
var $ = require('/lib/jQuery');
//var $Svg = require('/lib/Svg');
var $Planet = require('Planet');
var $split = require('split');
var $channel = require('channel');
var $custEvent = require('/lib/core/evt/custEvent');
var $Hammer = require('/lib/Hammer');

var options = {
	'radius'     : 400
	,'size'      : null
	,'expratio'  : 3
	,'wind'      : null
};

var TEMP = {
	'FRAME' : [
		'<div class="Galaxy">'
			,'<div node-type="planets" class="Planets"></div>'
			,'<div node-type="relations" class="Planet-relations"></div>'
			,'<div node-type="lines" class="Planet-lines"></div>'
		,'</div>'
	].join('')
	,'RELATION' : [
		'<div class="Relation"></div>'
	].join('')
};

module.exports = function(opts, GDATA){
	
	var node, nodes;
	
	//状态记录
	var status = {};
	
	var planetStatus = [];
	
	var convertStatus = {};
	var convertCss = {};
	
	var svgContext;
	
	var STAR
		,PLANETS = [];
	
	var it = {
		'init' : function(){
			it.parseParam();
			it.build();
			it.bind();
		}
		,'parseParam' : function(){
			opts = $.extend({}, options, opts || {});
			if(opts.size == null){
				opts.size = [opts.radius * 2, opts.radius * 2];
			}
		}
		,'build' : function(){
			
			node = $(TEMP.FRAME);
			nodes = $.Ex.builder(node);
			nodes.box = node;
			
			//svg drawer
			//svgContext = $Svg(nodes.lines.get(0)).size(500, 500);
			console.log('Galaxy::Element', node, nodes);
			
			console.log('Galaxy::GDATA', GDATA);
			
			//random
			planetStatus = $split.fan(GDATA.planet.length, opts.size, {
				'pointRadius' : 40
				,'centerPaddingRadius' : 150
				,'hitRadians' : opts.wind
				,'hitSector' : Math.PI * 0.1
			});
			
			/**
			 * star (master, extend the style from expanded planet)
			 */
			STAR = $Planet(GDATA.star);
			nodes.planets.append(STAR.node);
			STAR.get.dom('land').html(GDATA.star.land);
			STAR.get.dom('land').css({
				'width': GDATA.star.size
				,'height': GDATA.star.size
			});
			
			/**
			 * Planets
			 */
			for(var i=0,len=GDATA.planet.length;i<len;i++){
			
				/**
				 * planet -> land -> content
				 */
				var planetHandle = $Planet(GDATA.planet[i]);
				nodes.planets.append(planetHandle.node);
				planetHandle.get.dom('land').html(GDATA.planet[i].land);
				planetHandle.get.dom('land').css({
					'width': GDATA.planet[i].size
					,'height': GDATA.planet[i].size
				});
				
				//planetHandle.node.css3({'transform' : 'translate3d(' + planetStatus[i][0] + 'px,' + planetStatus[i][1] + 'px,0)'});
				
				/**
				 * lines
				 */
				//SVG style
				//var planetLine = svgContext.line(0, 0, planetStatus[i][0], planetStatus[i][1]).stroke({width:5});
				//planetHandle.line = planetLine;
				//CSS3 style
				var planetLine = $('<div class="line"></div>');
				planetLine.css({
					'height' : GDATA.planet[i].line
					//,'width' : planetStatus[i][3]	//line length
					,'background-color' : GDATA.planet[i].color	//line color
				});
				//planetLine.css3({'transform' : 'translate3d(' + ((planetStatus[i][0] - planetStatus[i][3]) / 2) + 'px,' + (planetStatus[i][1] / 2) + 'px,0) rotateZ('+(planetStatus[i][2]*180/Math.PI)+'deg)'});
				nodes.lines.append(planetLine);
				planetHandle.line = planetLine;
				
				/**
				 * relations
				 */
				if(GDATA.planet[i]['relation']){
					var planetRelation = $(TEMP.RELATION);
					planetRelation.css('opacity', 0);
					planetRelation
						.append($('<span></span>')
						.css({
							'border-color' : GDATA.planet[i].color	//color
						})
						.html(GDATA.planet[i].relation)
					)
					.css3({
						'transform' : 'translate3d(' + Math.floor(planetStatus[i][0] * 0.6) + 'px,' + Math.floor(planetStatus[i][1] * 0.6) + 'px,0)'
					})
					.appendTo(nodes.relations);
					planetHandle.relation = planetRelation;
				}
				
				planetHandle.status = planetStatus[i];
				
				PLANETS[i] = planetHandle;
			}
			
			STAR.node.animate({
				'opacity' : 1
			}, {
				'duration' : 200
				,'progress' : function(spec, p){
					$(PLANETS).each(function(i, spec){
						spec.node.css3({
							'transform' : 'translate3d(' + (planetStatus[i][0] * p) + 'px,' + (planetStatus[i][1] * p) + 'px,0)'
						});
						spec.line.css3({
							'transform' : 'translate3d(' + (((planetStatus[i][0] - planetStatus[i][3] + Math.atan(planetStatus[i][2]) * spec.line.height()) / 2) * p) + 'px,' + ((planetStatus[i][1] - Math.sin(planetStatus[i][2]) * spec.line.height()) / 2 * p) + 'px,0) rotateZ('+(planetStatus[i][2]*180/Math.PI)+'deg)'
						});
						spec.line.css('width', planetStatus[i][3] * p);
					});
				}
				,'complete' : function(){
					$(PLANETS).each(function(i, spec){
						spec.node.css3({
							'transform' : 'translate3d(' + Math.floor(planetStatus[i][0]) + 'px,' + Math.floor(planetStatus[i][1]) + 'px,0)'
						});
						spec.line.css3({
							'transform' : 'translate3d(' + Math.floor((planetStatus[i][0] - planetStatus[i][3] + Math.atan(planetStatus[i][2]) * spec.line.height()) / 2) + 'px,' + Math.floor((planetStatus[i][1] - Math.sin(planetStatus[i][2]) * spec.line.height()) / 2) + 'px,0) rotateZ('+(planetStatus[i][2]*180/Math.PI)+'deg)'
						});
						spec.line.css('width', Math.floor(planetStatus[i][3]));
						
						spec.relation && spec.relation.animate({
							'opacity':1
						}, 200);
					});
				}
			});
		}
		,'bind' : function(){
			$custEvent.define(self, ['expand']);
			
			for(var i=0;i<PLANETS.length;i++){
				if(!!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
				
					$Hammer(PLANETS[i].get.dom('thumbnal').get(0)).on('tap', (function(planet){
						return function(){
							$custEvent.fire(self, 'expand', planet);	//自定义事件
						};
					})(PLANETS[i]));
					
					$Hammer(PLANETS[i].node.find('a').get(0)).on('tap', function(e){
						window.open($(e.target).attr('href'));
					});
					
				} else {
					PLANETS[i].get.dom('thumbnal').on('click', (function(planet){
						return function(){
							$custEvent.fire(self, 'expand', planet);	//自定义事件
						};
					})(PLANETS[i]));
				}
			}
		}
	};
	
	var self = {};
	
	it.init();
	
	$.extend(self, {
		'node'    : node
		,'opts'   : opts
		,'status' : status
	});
	
	return self;
};
