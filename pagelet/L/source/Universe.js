/**
 * 宇宙
 */
var $ = require('/lib/jQuery');
var $Planet = require('Planet');
var $Galaxy = require('Galaxy');
var $Stars = require('Stars');
var $channel = require('channel');
var $bubbleAdd = require('bubbleAdd');
var $dragdrop = require('/model/unit/dragdrop');

var $custEvent = require('/lib/core/evt/custEvent'); 

var IOSettings = {
	//'star'    : 'io/star/'
	'star'    : 'http://labor.codante.org/dev/demo/Loopooq/io/proxy.php?p=search'
	,'galaxy' : 'http://labor.codante.org/dev/demo/Loopooq/io/proxy.php?p=nodes'
};

var tranSet = function(handle){
	return $.extend({}, handle || {}, {
		'dataType' : 'json'
		//,'jsonp'   : 'cb'
	});
};

var TEMP = {
	'FRAME'  : '<div class="stage"></div>'
	,'SHIFT' : '<div class="IBB-shift" style="width:0px;height:0px;left:0;top:0;position:absolute;"></div>'
	,'REL'   : '<canvas style="position:absolute;z-index:0;"></canvas>'
};

module.exports = function(node, opts){
	
	
	var STARS;
	
	// "添加" 弹出层
	var bubbleADD;
	
	// "系" 管理列表
	var GALAXYS = [];
	
	//DOM管理
	var nodes = {};
	
	var RELS = [];
	
	var DDController;
	
	//当前点击的节点缓存
	var expansionResPlanet
		,expansionResGalaxy;
	
	var it = {
		'init' : function(){
			it.build();
			it.initPlugin();
			it.bind();
			
			setTimeout(function(){
				$channel.fire('searchBar.show');
			}, 2000);
			//trans.expand(1);
		}
		,'build' : function(){
			nodes.shift = $(TEMP.SHIFT);
			node.append(nodes.shift);
			
			//console.log(nodes.shift);
		}
		,'initPlugin' : function(){
			bubbleADD = $bubbleAdd();
			
			DDController = $dragdrop(node, nodes.shift);
		}
		,'bind' : function(){
			$channel.register('search', trans.search);
			$channel.register('expand', trans.expand);
		}
		,'set' : {
			'size' : function(width, height){
				nodes.shift.css({
					'width' : width
					,'height' : height
				});
			}
			,'pos' : function(x, y, z){
				nodes.shift.css({
					'left' : x
					,'top' : y
				});
			}
		}
		,'get' : {
			'size' : function(){
				
			}
			,'planetRelPos' : function(){
				
			}
		}
	};
	
	/**
	 * 系 之间关系连线及管理
	 */
	var rel = {
		'create' : function(from, to){
			var ps = [], wb, ws, hb, hs;
			
			var rote = Math.atan2(to[1]-from[1], to[0]-from[0]);
			
			if(from[0] < to[0]){
				wb = to[0];
				ws = from[0];
			} else {
				wb = from[0];
				ws = to[0];
			}
			
			if(from[1] < to[1]){
				hb = to[1];
				hs = from[1];
			} else {
				hb = from[1];
				hs = to[1];
			}
		
			ps[0] = [0, 0];
			ps[1] = [wb - ws, 0];
			ps[2] = [wb - ws, hb - hs];
			ps[3] = [0, hb - hs];
			ps[4] = [ws, hs];
			
			//console.log(ps);
			
			var reline = $(TEMP.REL);
			
			reline.attr({
				'width'   : ps[2][0]
				,'height' : ps[2][1]
			});
			
			reline.css({
				'left'   : ps[4][0]
				,'top'    : ps[4][1]
			});
			
			nodes.shift.append(reline);
			
			var Pi = Math.PI;
			
			if(
				(rote > 0 && rote <= Pi * 0.5)
				||
				(rote > Pi && rote <= Pi * 1.5)
				||
				(rote > -Pi && rote <= -Pi * 0.5)
			){
				ws = ps[0];
				wb = ps[2];
			} else {
				ws = ps[1];
				wb = ps[3];
			}
			
			//console.log(rote, ws, wb);
			
			var context = reline.get(0).getContext("2d");
			context.moveTo(ws[0], ws[1]);
			context.lineTo(wb[0], wb[1]);
			context.lineWidth = 5;
			context.lineCap = "round";
			context.strokeStyle = '#0066FF';
			context.stroke();
			
			RELS.push(reline);
		}
	};
	
	var custEventHandle = {
		'seed' : function(spec, planet){
			trans.expand(planet.get.id());
		}
		,'expand' : function(spec, data){
			
			expansionResGalaxy = spec.obj;
			expansionResPlanet = data;
			
			trans.expand(expansionResPlanet.get.id());
		}
	};
	
	var transOnLoading = false;
	
	var trans = {
		'star' : function(){
			$.ajax(IOSettings.star, tranSet(transHandle.star));
		}
		,'search' : function(word){
			var data = {
				'v' : word
			};
			
			if(transOnLoading)
				return;
				
			transOnLoading = true;
			$.ajax(IOSettings.star, $.extend({}, tranSet(transHandle.star), {'data':data}));
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
		'star' : {
			'success' : function(ret){
				
				if(!ret || !ret.length){
					transOnLoading = false;
					return;
				}
				
				if(STARS){
					STARS.destroy();
				}
				
				var landContent, landURL, landDescription, size;
				
				for(var i=0, len=ret.length; i<len; i++){
					ret[i].thumbnail = 'http://54.68.105.58/webImages/'+ret[i].id+'.png';
					ret[i].screen = 'rgb('+(parseInt((Math.random()*1000))%200)+', '+(parseInt((Math.random()*1000))%200)+', '+(parseInt((Math.random()*1000))%200)+')';
					
					landContent = ret[i].url;
					if(landContent.length > 25){
						landContent = landContent.substr(0, 15) + ' ... ' + landContent.substr(-10);
					}
					landURL = 'http://' + ret[i].url;
				
					ret[i].land = '';
					ret[i].land += '<div><a href="'+landURL+'" title="'+ret[i]['description']+'" target="_blank">'+landContent+'</a></div>';
					
					if(i === 0){
						ret[i].size = [100, 100];
					} else {
						size = Math.random() * 100 % 50 + 20;
						ret[i].size = [size, size];
					}
					/*
					if(ret.planet[i]['description']){
						landDescription = ret.planet[i].description;
						if(landDescription.length > 64){
							landDescription = landDescription.substr(0, 64) + ' ...';
						}
						ret.planet[i].land += '<div title="'+landDescription+'"><em>'+landDescription+'</em></div>';
					}
					*/
				}
				
				STARS = $Stars({}, ret);
				
				$custEvent.add(STARS, 'expand', custEventHandle.seed);
				
				node.append(STARS.get.node());
				
				transOnLoading = false;
			}
		}
		,'expand' : {
			'success' : function(ret){
				
				if(!ret['planet'] || !ret['planet'].length){
					transOnLoading = false;
					return;
				}
				
				if(STARS){
					STARS.destroy();
				}
				
				var landContent, landURL, landDescription;
				
				ret.star.thumbnail = 'http://12.111.88.168/CIimg/'+ret.star.id+'.png';
				ret.star.screen = 'rgb('+(parseInt((Math.random()*1000))%200)+', '+(parseInt((Math.random()*1000))%200)+', '+(parseInt((Math.random()*1000))%200)+')';
				
				landContent = ret.star.url;
				if(landContent.length > 25){
					landContent = landContent.substr(0, 15) + ' ... ' + landContent.substr(-10);
				}
				landURL = 'http://' + ret.star.url;
					
				ret.star.land = '';
				ret.star.land += '<div><a href="'+landURL+'" title="'+ret.star['description']+'" target="_blank">'+landContent+'</a></div>';
				
				/*
				if(ret.star['description']){
					landDescription = ret.star.description;
					if(landDescription.length > 64){
						landDescription = landDescription.substr(0, 64) + ' ...';
					}
					ret.star.land += '<div title="'+landDescription+'"><em>'+landDescription+'</em></div>';
				}
				*/
				
				var size = 76;
				
				for(var i=0, len=ret.planet.length; i<len; i++){
					ret.planet[i].size = [size-(i*5), size-(i*5)];
					ret.planet[i].thumbnail = 'http://12.111.88.168/CIimg/'+ret.planet[i].id+'.png';
					ret.planet[i].screen = 'rgb('+(parseInt((Math.random()*1000))%200)+', '+(parseInt((Math.random()*1000))%200)+', '+(parseInt((Math.random()*1000))%200)+')';
					ret.planet[i].stroke = ret.planet[i].screen;
					
					landContent = ret.planet[i].url;
					if(landContent.length > 25){
						landContent = landContent.substr(0, 15) + ' ... ' + landContent.substr(-10);
					}
					landURL = 'http://' + ret.planet[i].url;
				
					ret.planet[i].land = '';
					ret.planet[i].land += '<div><a href="'+landURL+'" title="'+ret.planet[i]['description']+'" target="_blank">'+landContent+'</a></div>';
					
					/*
					if(ret.planet[i]['description']){
						landDescription = ret.planet[i].description;
						if(landDescription.length > 64){
							landDescription = landDescription.substr(0, 64) + ' ...';
						}
						ret.planet[i].land += '<div title="'+landDescription+'"><em>'+landDescription+'</em></div>';
					}
					*/
				}
				
				//关闭搜索条
				$channel.fire('searchBar.hide');
				
				ret.planet.sort(function(){return 0.5 - Math.random();});
				
				var G = $Galaxy({}, ret);
				
				var expansionGalaxySize = [G.get.width(), G.get.height()];
				var expansionGalaxyPosLT;
				
				if(expansionResPlanet && expansionResGalaxy){
				
					var rote = Math.atan2(expansionResPlanet.get.y(), expansionResPlanet.get.x());
					
					var gSize = expansionResGalaxy.get.size();
					var gPos = expansionResGalaxy.get.pos();
					
					//起始系重心坐标
					var expansionGalaxyResPos = [
						gPos.x + (gSize.width / 2)
						,gPos.y + (gSize.height / 2)
					];
					
					//目标系重心坐标
					var expansionGalaxyPos = [
						expansionGalaxyResPos[0] + (gSize.width * 1 * Math.cos(rote))
						,expansionGalaxyResPos[1] + (gSize.height * 1 * Math.sin(rote))
					];
					
					//目标系LT坐标
					expansionGalaxyPosLT = [
						expansionGalaxyPos[0] - (expansionGalaxySize[0] / 2)
						,expansionGalaxyPos[1] - (expansionGalaxySize[1] / 2)
					];
					
					rel.create(expansionGalaxyResPos, expansionGalaxyPos);
				} else {
					expansionGalaxyPosLT = [0, 0];
				}
				
				G.set.pos.apply(null, expansionGalaxyPosLT);
				nodes.shift.append(G.get.node());
				GALAXYS.push(G);
				$custEvent.add(G, 'expand', custEventHandle.expand);
				
				//扩展场景
				shift.expand(expansionGalaxyPosLT, expansionGalaxySize);
				//置于屏幕中心
				shift.focusTo(G);
				
				transOnLoading = false;
			}
		}
	};
	
	var shift = {
		'expand' : function(galaxyPos, galaxySize){
			var shiftSize = [nodes.shift.width(), nodes.shift.height()];
			var sl = nodes.shift.position();
			var shiftPos = [sl.left, sl.top];
			
			//console.log(shiftPos, shiftSize, galaxyPos, galaxySize);
			
			var scSize = [0, 0]
				,scPos = [0, 0];
			
			//左
			if(galaxyPos[0] < 0){
				scSize[0] += Math.abs(galaxyPos[0] - shiftPos[0]);
				scPos[0] += galaxyPos[0];
			}
			
			//右
			if(galaxyPos[0] + galaxySize[0] > shiftSize[0]){
				scSize[0] += galaxyPos[0] + galaxySize[0] - shiftSize[0];
			}
			
			//上
			if(galaxyPos[1] < 0){
				scSize[1] += Math.abs(galaxyPos[1] - shiftPos[0]);
				scPos[1] += galaxyPos[1];
			}
			
			//下
			if(galaxyPos[1] + galaxySize[1] > shiftSize[1]){
				scSize[1] += galaxyPos[1] + galaxySize[1] - shiftSize[1];
			}
			
			nodes.shift.css({
				'width'   : shiftSize[0] + scSize[0]
				,'height' : shiftSize[1] + scSize[1]
				,'left'   : shiftPos[0] + scPos[0]
				,'top'    : shiftPos[1] + scPos[1]
			});
			
			// 如果左侧超出，则进行偏移设置。
			if(scPos[0] !== 0 || scPos[1] !== 0){
				for (var i=0, len=GALAXYS.lenght; i<len; i++) {
					GALAXYS[i].set.pos(GALAXYS[i].get.x() + Math.abs(scPos[0]), GALAXYS[i].get.y() + Math.abs(scPos[1]));
				}
				for (var i=0, len=RELS.lenght, pos; i<len; i++) {
					pos = RELS[i].position();
					//console.log(pos);
				}
			}
		}
		,'focusTo' : function(Galaxy){
		
			var stageSize = [node.width(), node.height()]
				,galaxyPos = [Galaxy.get.x(), Galaxy.get.y()]
				,galaxySize = [Galaxy.get.width(), Galaxy.get.height()];
		
			nodes.shift.css({
				'left' : (stageSize[0] / 2) - (galaxyPos[0] + (galaxySize[0] / 2))
				,'top' : (stageSize[1] / 2) - (galaxyPos[1] + (galaxySize[1] / 2))
			});
		}
	};
	
	var self = it;
	
	it.init();
	
	return self;
	
};