/**
 * Universe
 */
var $ = require('/lib/jQuery');
var $Planet = require('Planet');
var $Galaxy = require('Galaxy');
var $Stars = require('Stars');
var $channel = require('channel');
var $bubbleAdd = require('bubbleAdd');
var $custEvent = require('/lib/core/evt/custEvent');
var $randomColor = require('/lib/core/util/randomColor');
var $Hammer = require('/lib/Hammer');


var $coData = require('/model/common/coData'); 

var IOSettings = {
	//'star'  : 'io/star/'
	'search'  : 'http://labor.codante.org/dev/demo/Loopooq/io/proxy.php?p=search'
	,'galaxy' : 'http://labor.codante.org/dev/demo/Loopooq/io/proxy.php?p=nodes'
};

var tranSet = function(handle){
	return $.extend({}, handle || {}, {
		'dataType' : 'json'
		//,'jsonp'   : 'cb'
	});
};

var TEMP = [
	'<div class="Universe"></div>'
].join('');

module.exports = function(node, opts){
	
	var STARS;
	
	// "添加" 弹出层
	var bubbleADD;
	
	// "系" 管理列表
	var GALAXYS = [];
	
	//DOM管理
	var nodes = {};
	
	var isBinded = false;
	
	//扩展节点信息
	var expandPlanet
		,expandGalaxy
		,expandDetail
		,newGalaxyDetail;
	
	var it = {
		'init' : function(){
			it.parseParam();
			it.build();
			it.initPlugin();
			it.bind();

			setTimeout(function(){
				$channel.fire('searchBar.show');
			}, 2000);
			//trans.expand(1);
		}
		,'parseParam' : function(){
			$coData.set('scale', 1);
		}
		,'build' : function(){
		
			nodes.Universe = $(TEMP);
			/*
			//!!!!sign
			nodes.Universe.append($('<div></div>').css({
				'background':'#009933'
				,'height':'100px'
				,'width':'100px'
				,'position':'absolute'
				,'top':0
				,'left':0
			}).css3({
				'transform':'translate3d(-50%,-50%,0)'
			}));
			*/
			
			console.log('Universe', node, nodes);
			
			node.append(nodes.Universe);
			
			//console.log(nodes.shift);
		}
		,'initPlugin' : function(){
			bubbleADD = $bubbleAdd();
		}
		,'bind' : function(){
			$channel.register('search', trans.search);
			$channel.register('expand', trans.expand);
		}
		,'bindDomEvent' : function(){
		
			if(isBinded)
				return;
		
			/**
			 * desktop
			 */
			node.CatDD(nodes.Universe, {
				'onDrop' : function(){
					focusCenter();
				}
			});
			node.mousewheel(function(e, delta){
				var s = $coData.get('scale') || 1;
				var ns = s + delta / 20;
				ns > 0 && (s = ns);
				nodes.Universe.css3({
					'transform' : 'scale(' + s + ', ' + s + ')'
				});
				$coData.set('scale', s);
				return false;
			});
			
			/**
			 * mobile
			 */
			var mc = $Hammer(node.get(0), {'prevent_default': false});
			mc.add(new $Hammer.Pinch());
			
			var lastScale = 1;
			
			mc.on('pinch', function(e){
				var s = $coData.get('scale') || 1;
				var delta = e.scale - lastScale;
				var ns = s + (delta > 0 ? delta / Math.pow(s, 0.25) : delta * s);
				lastScale = e.scale;
				ns > 0 && (s = ns);
				nodes.Universe.css3({
					'transform' : 'scale(' + s + ', ' + s + ')'
				});
				$coData.set('scale', s);
			});
			
			var pos;
			mc.on('pan', function(e){
				if(e.isFinal){
					lastScale = 1;
					pos = null;
					focusCenter();
					return;
				}
				
				if(pos == null){
					pos = nodes.Universe.position();
				}
				
				nodes.Universe.css({
					'left' : pos.left + e.deltaX
					,'top' : pos.top + e.deltaY
				});
			});
			
			isBinded = true;
		}
	};
	
	var focusCenter = function(){
	
		var p = nodes.Universe.position();
		var center = [node.width() / 2, node.height() / 2];
		var moved = [p.left - center[0], p.top - center[1]];
		var scale = $coData.get('scale');
		
		nodes.Universe.css({
			'left' : center[0]
			,'top' : center[1]
		});
		
		for(var i=0,len=GALAXYS.length;i<len;i++){
			var pos = [
				GALAXYS[i].status[0] + moved[0] / scale
				,GALAXYS[i].status[1] + moved[1] / scale
			];
			GALAXYS[i].node.css3({'transform' : 'translate3d(' + pos[0] + 'px,' + pos[1] + 'px,0)'});
			GALAXYS[i].status = pos;
		}
	};
		
	//new galaxy
	var createGalaxy = function(data){
		
		data.star.pr = 12;
		
		//拼装数据
		filterData(data.star);
		filterData(data.planet);
		
		//数据处理
		data.planet.sort(function(){return 0.5 - Math.random();});
		
		var param = {
			'radius' : 320
		};
		if(newGalaxyDetail[2] != null){
			param.wind = newGalaxyDetail[2];
		}
		var newGalaxy = $Galaxy(param, data);
		nodes.Universe.append(newGalaxy.node);
		
		//newGalaxy.node.css3({'transform' : 'translate3d('+newGalaxyDetail[0]+'px,'+newGalaxyDetail[1]+'px,0)'});
		newGalaxy.status = newGalaxyDetail;
		GALAXYS.push(newGalaxy);
		$custEvent.add(newGalaxy, 'expand', custEventHandle.expand);
	};
	
	var filterData = (function(data){
		
		var padding = 0
			,index;
		
		var filter = function(data){
			var pr = parseInt(data.pr);
			data.line = Math.floor(1 + index * 1.4);
			data.size = Math.floor(30 + pr * 5);
			if(data['color'] == null) {
				data.color = $randomColor(10, 200);
			}
			var radius = data.size / 2 + padding;
			data.land = [
		
				'<div class="Thumbnal" node-type="thumbnal" style="'
					,[
						'width:'+data.size+'px'
						,'height:'+data.size+'px'
						,'background-color:'+data.color
						,'padding:'+padding+'px'
						//,'margin:-'+padding+'px 0 0 -'+padding+'px'
						,'border-radius:'+radius+'px'
						,'-moz-border-radius:'+radius+'px'
						,'-webkit-border-radius:'+radius+'px'
					].join(';')
				,'">'
					,'<img style="'
						,[
							'border-radius:'+radius+'px'
							,'-moz-border-radius:'+radius+'px'
							,'-webkit-border-radius:'+radius+'px'
						].join(';')
					,'" src="'+data.thumbnal+'"'
					,' onerror="this.src=\'http://img.static.codante.org/Loopooq/images/transparent.png\'" />'
				,'</div>'
				
				,'<div class="Land-link">'
					,'<a target="_blank" title="'+data.title+'" href="'+data.url+'">'
						,data.title.length > 20 ? data.title.substr(0, 17) + '..' : data.title
					,'</a>'
				,'</div>'
				
			].join('');
			
			data.size += padding * 2;
		};
		
		return function(data){
			if($.isArray(data)){
				index = data.length;
				for(var i=0,len=data.length;i<len;i++){
					index--;
					filter(data[i]);
				}
			} else {
				index = 0;
				filter(data);
			}
			
			return data;
		};
	})();
	
	var custEventHandle = {
		'seed' : function(spec, planet){
			
			if(transOnLoading)
				return;
				
			spec.obj.seed = planet;
			
			trans.expand(planet.opts.id);
		}
		,'expand' : function(spec, planet){
		
			if(transOnLoading)
				return;
				
			//扩展的节点
			expandPlanet = planet;
			
			//扩展的系
			expandGalaxy = spec.obj;
			
			var r = 3 * (expandGalaxy.opts.size[0] > expandGalaxy.opts.size[1] ? expandGalaxy.opts.size[0] : expandGalaxy.opts.size[1]);
			
			//被扩展的点运动目标坐标
			expandDetail = [r * Math.cos(expandPlanet.status[2]), r * Math.sin(expandPlanet.status[2]), expandPlanet.status[2], r];
			
			//新galaxy坐标
			newGalaxyDetail = [
				expandDetail[0] + expandGalaxy.status[0]
				,expandDetail[1] + expandGalaxy.status[1]
				,2 * Math.PI - expandDetail[2]	//扩展来源的方向，用来计算力学影响。likes wind blow
				,r
			];

			trans.expand(expandPlanet.opts.id);
		}
	};
	
	var transOnLoading = false;
	
	var trans = {
		'star' : function(){
			$.ajax(IOSettings.search, tranSet(transHandle.search));
		}
		,'search' : function(word){
			var data = {
				'v' : word
			};
			
			if(transOnLoading)
				return;
				
			transOnLoading = true;
			$.ajax(IOSettings.search, $.extend({}, tranSet(transHandle.search), {'data':data}));
		}
		,'expand' : function(id){
			var data = {
				'v' : id
			};
			
			if(transOnLoading)
				return;
				
			transOnLoading = true;
			$.ajax(IOSettings.galaxy, $.extend({}, tranSet(transHandle.expand), {'data':data}));
		}
	};
	
	var transHandle = {
		'search' : {
			'success' : function(ret){
				
				if(!ret || !ret.length){
					transOnLoading = false;
					return;
				}
				
				if(STARS){
					STARS.node.remove();
					STARS = null;
				}
				
				filterData(ret);
				
				STARS = $Stars({}, ret);
				
				$custEvent.add(STARS, 'seed', custEventHandle.seed);
				//$custEvent.add(STARS, 'expand', custEventHandle.expand);
				
				nodes.Universe.append(STARS.node);
				
				transOnLoading = false;
			}
		}
		,'expand' : {
			'success' : function(ret){
				
				if(!ret['planet'] || !ret['planet'].length){
					transOnLoading = false;
					return;
				}
				
				(function(nextAct){
					if(STARS){
					
						var pl = STARS.seed.node.clone();
						var pos = STARS.seed.status;
						
						STARS.node.append(pl);
						STARS.hideAll();
						
						STARS.node.animate({
							'opacity' : 1
						}, {
							'duration' : 500
							,'progress' : function(spec, p){
								pl.css3({
									'transform' : 'translate3d(' + (pos[0] * (1-p)) + 'px,' + (pos[1] * (1-p)) + 'px,0)'
								});
							}
							,'complete' : function(){
					
								//关闭搜索条
								$channel.fire('searchBar.hide');
								
								pl.remove();
								pl = STARS = null;
								nextAct(ret);
							}
						});
					} else {
						nextAct(ret);
					}
				})(function(data){
					
					//展开的节点
					if(expandPlanet){
						
						data.star.color = expandPlanet.opts.color;
						
						// center move to new expand galaxy
						var scale = $coData.get('scale');
						var npos = nodes.Universe.position();
						
						nodes.Universe.css({
							'left' : npos.left + newGalaxyDetail[0] * scale
							,'top' : npos.top + newGalaxyDetail[1] * scale
						});
						
						for(var i=0,len=GALAXYS.length;i<len;i++){
							var pos = [
								GALAXYS[i].status[0] - newGalaxyDetail[0]
								,GALAXYS[i].status[1] - newGalaxyDetail[1]
							];
							GALAXYS[i].node.css3({'transform' : 'translate3d(' + pos[0] + 'px,' + pos[1] + 'px,0)'});
							GALAXYS[i].status = pos;
						}
						newGalaxyDetail[0] = 0;
						newGalaxyDetail[1] = 0;
						
						//Expanded planet
						//expandPlanet.node.css3({'transform' : 'translate3d(' + expandDetail[0] + 'px,' + expandDetail[1] + 'px,0)'});
						//expandPlanet.line.css('width', expandDetail[3]);
						//expandPlanet.line.css3({'transform' : 'translate3d(' + ((expandDetail[0] - expandDetail[3]) / 2) + 'px,' + (expandDetail[1] / 2) + 'px,0) rotateZ('+(expandDetail[2]*180/Math.PI)+'deg)'});
	
						//Universe move to center
						nodes.Universe.animate({
							'left' : node.width() / 2
							,'top' : node.height() / 2
						}, {
							'duration' : 500
							,'progress' : function(spec, p){
								//Expanded planet
								expandPlanet.line.css('width', expandDetail[3] * p);
								expandPlanet.node.css3({
									'transform' : 'translate3d(' + (expandDetail[0] * p) + 'px,' + (expandDetail[1] * p) + 'px,0)'
								});
								expandPlanet.line.css3({
									'transform' : 'translate3d(' + ((expandDetail[0] - expandDetail[3]) / 2 * p) + 'px,' + (expandDetail[1] / 2 * p) + 'px,0) rotateZ('+(expandDetail[2] * 180 / Math.PI)+'deg)'
								});
							}
							,'complete' : function(){
								expandPlanet.node.hide();
								createGalaxy(data);
								transOnLoading = false;
							}
						});
						
					} else {
						newGalaxyDetail = [0, 0];
						createGalaxy(data);
						transOnLoading = false;
					}
					
					it.bindDomEvent();
				
				});
			}
		}
	};
	
	var self = it;
	
	it.init();
	
	return self;
	
};