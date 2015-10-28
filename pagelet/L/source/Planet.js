/**
 * 星球
 */
var $ = require('/lib/jQuery');
var $channel = require('channel');

var options = {
	'id'         : null
	,'size'      : [48,48]
	,'scale'     : 1
	,'shape'     : 'round'	// round | none
	,'screen'    : ''
	,'thumbnail' : ''
	,'focus'     : ['center', 'center']
	,'align'     : ['center', 'center']
	,'alpha'     : 100
	,'land'      : ''
	,'stroke'    : ''
};

var TEMP = {
	'MAIN' : '' +
		'<div class="IBB-Planet">' +
			'<div node-type="land" class="IBB-Planet-Land"></div>' +
			'<div node-type="screen" class="IBB-Planet-Screen"></div>' +
			'<a node-type="btn_add" class="IBB-Planet-Btn_add"></a>' +
			'<a node-type="btn_up" class="IBB-Planet-Btn_up"></a>' +
			'<a node-type="btn_down" class="IBB-Planet-Btn_down"></a>' +
		'</div>'
};

module.exports = function(opts){
	
	//状态记录
	var status = {
		'x'  : 0
		,'y' : 0
		,'z' : 1000
	};
	
	var convertStatus = {};
	var convertCss = {};
	
	//重心配置
	var focConf = ['left', 'top'];
	//尺寸配置
	var sizConf = ['width', 'height'];
	//坐标配置
	var posConf = ['x', 'y'];
	
	var node;
	
	var nodes = {};
	
	var LSN = {};
	
	var it = {
		'init' : function(){
			it.parseParam();
			
			if(!opts['id']){
				return;
			}
			
			it.build();
			it.bind();
		}
		,'parseParam' : function(){
			opts = $.extend({}, options, opts || {});
		}
		/**
		 * 创建
		 */
		,'build' : function(){
						
			var css = {};
			
			node = $(TEMP.MAIN);
			
			nodes = $.Ex.builder(node);
			
			nodes.box = node;
			
			convertCss['position'] = 'absolute';
			
			var i;
			for(i=0;i<2;i++){
				switch(opts.focus[i]){
					case 'center':
					case '50%':
						convertCss['margin-' + focConf[i]] = 0 - (opts.size[i] / 2);
						break;
					case 'left':
					case 'top':
					case '0%':
						break;
					case 'right':
					case 'bottom':
					case '100%':
						convertCss['margin-' + focConf[i]] = 0 - opts.size[i];
						break;
					default:
						break;
				}
			}
			
			for(i=0;i<2;i++){
				switch(opts.align[i]){
					case 'center':
					case '50%':
						convertCss[focConf[i]] = '50%';
						break;
					case 'left':
					case 'top':
					case '0%':
						convertCss[focConf[i]] = '0%';
						break;
					case 'right':
					case 'bottom':
					case '100%':
						convertCss[focConf[i]] = '100%';
						break;
					default:
						break;
				}
			}
						
			convertStatus.alpha = opts.alpha;
			convertStatus.scale = opts.scale;
			convertStatus.width = opts.size[0];
			convertStatus.height = opts.size[1];
			
			/**
			 * Others
			 */
			
			if(opts['screen']){
				if(opts['screen'].search(/^#/) > -1 || opts['screen'].search(/^rgb/) > -1){
					nodes.screen.css('background-color', opts['screen']);
				}
			}
			
			if(opts['thumbnail']){
				nodes.thumbnail = $('<img onerror="this.src=\'http://img.static.codante.org/Loopooq/images/transparent.png\'" class="IBB-Planet-Thumbnail" src="' + opts.thumbnail + '" />');
				nodes.screen.append(nodes.thumbnail);
			}
			
			if(opts['land']){
				nodes.land.html(opts.land);
			}
			
			if(opts['stroke']){
				if(opts['stroke'].search(/^#/) > -1 || opts['stroke'].search(/^rgb/) > -1){
					nodes.thumbnail.css('border-color', opts['stroke']);
				}
			}
			
			/**
			 * Buttons
			 */
			nodes.btn_up.css({
				'margin-left' : (Math.cos((2*Math.PI / 360) * -45) * ((opts.size[0] / 2) + 12)) - (nodes.btn_up.width() / 2)
				,'margin-top' : (Math.sin((2*Math.PI / 360) * -45) * ((opts.size[1] / 2) + 12)) - (nodes.btn_up.height() / 2)
			});
			
			nodes.btn_down.css({
				'margin-left' : (Math.cos((2*Math.PI / 360) * -15) * ((opts.size[0] / 2) + 12)) - (nodes.btn_down.width() / 2)
				,'margin-top' : (Math.sin((2*Math.PI / 360) * -15) * ((opts.size[1] / 2) + 12)) - (nodes.btn_down.height() / 2)
			});
			
			nodes.btn_add.css({
				'margin-left' : (Math.cos((2*Math.PI / 360) * 45) * ((opts.size[0] / 2) + 20)) - (nodes.btn_add.width() / 2)
				,'margin-top' : (Math.sin((2*Math.PI / 360) * 45) * ((opts.size[1] / 2) + 20)) - (nodes.btn_add.height() / 2)
			});
			
			it.render();
			
		}
		/**
		 * 渲染
		 */
		,'render' : function(){
			
			/**
			 * size change
			 */
			if(
				convertStatus.hasOwnProperty('width')
				|| convertStatus.hasOwnProperty('height')
				|| convertStatus.hasOwnProperty('scale')
				|| convertStatus.hasOwnProperty('x')
				|| convertStatus.hasOwnProperty('y')
			){
			
				if(!convertStatus.hasOwnProperty('width')){
					convertStatus.width = status.width;
				}
				
				if(!convertStatus.hasOwnProperty('height')){
					convertStatus.height = status.height;
				}
				
				if(!convertStatus.hasOwnProperty('scale')){
					convertStatus.scale = status.scale;
				}
				
				if(!convertStatus.hasOwnProperty('x')){
					convertStatus.x = status.x;
				}
				
				if(!convertStatus.hasOwnProperty('y')){
					convertStatus.y = status.y;
				}
				
				for(var i=0;i<2;i++){
					convertCss[sizConf[i]] = convertStatus[sizConf[i]] * convertStatus.scale;
					switch(opts.focus[i]){
						case 'center':
						case '50%':
							convertCss['margin-' + focConf[i]] = convertStatus[posConf[i]] - (convertCss[sizConf[i]] * 0.5);
							break;
						case 'left':
						case 'top':
						case '0%':
							break;
						case 'right':
						case 'bottom':
						case '100%':
							convertCss['margin-' + focConf[i]] = convertStatus[posConf[i]] - convertCss[sizConf[i]];
							break;
						default:
							break;
					}
				}
			
			}
			
			if(convertStatus.hasOwnProperty('alpha')){
				convertCss.opacity = convertStatus.alpha / 100;
			}
			
			//if(convertStatus.hasOwnProperty('shape')){
			//	
			//}
			
			switch(opts['shape']){
				case 'round':
					nodes.screen.css({
						'-moz-border-radius' : opts.size[0] / 2
						,'border-radius' : opts.size[0] / 2
					});
					nodes['thumbnail'] && nodes.thumbnail.css({
						'-moz-border-radius' : opts.size[0] / 2
						,'border-radius' : opts.size[0] / 2
					});
					break;
				case 'none':
				default:
					break;
			}
			
			node.css(convertCss);
			
			$.extend(status, convertStatus);
			
			convertStatus = {};
			convertCss = {};
		}
		/**
		 * 批量设置参数并渲染
		 */
		,'convert' : function(st){
			convertStatus = st || {};
			it.render();
		}
		/**
		 * 单独设置并渲染
		 */
		,'set' : {
			'pos' : function(x, y, z){
				typeof x === 'number' && (convertStatus.x = x);
				typeof y === 'number' && (convertStatus.y = y);
				typeof z === 'number' && (convertStatus.z = z);
				it.render();
			}
			,'x' : function(value){
				convertStatus.x = value;
				it.render();
			}
			,'y' : function(value){
				convertStatus.y = value;
				it.render();
			}
			,'z' : function(value){
				convertStatus.z = value;
				it.render();
			}
			,'alpha' : function(value){
				convertStatus.alpha = value;
				it.render();
			}
			,'size' : function(w, h){
				typeof w === 'number' && (convertStatus.width = w);
				typeof h === 'number' && (convertStatus.height = h);
				it.render();
			}
			,'scale' : function(value){
				convertStatus.scale = value;
				it.render();
			}
			,'shape' : function(url){
				convertStatus.shape = url;
				it.render();
			}
		}
		/**
		 * 获取参数
		 */
		,'get' : {
			'node' : function(){
				return node;
			}
			,'screen' : function(){
				return nodes.screen;
			}
			,'status' : function(){
				return status;
			}
			,'convertStatus' : function(){
				return convertStatus;
			}
			,'size' : function(){
				return {
					'width' : status.width
					,'height' : status.height
				};
			}
			,'pos' : function(){
				return {
					'x' : status.x
					,'y' : status.y
					,'z' : status.z
				};
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
			,'id' : function(){
				return opts.id;
			}
		}
		,'bind' : function(){
			nodes.screen.on('mouseenter', it.domEvts.mouseEnter);
			nodes.screen.on('mouseleave', it.domEvts.mouseLeave);
			
			nodes.screen.on('click', it.domEvts.expan);
			nodes.btn_add.on('click', it.domEvts.add);
		}
		,'unbind' : function(){
			
		}
		,'domEvts' : {
			'add' : function(e){
				e.preventDefault();
				$channel.fire('add');
			}
			,'expan' : function(e){
				//console.log('Expan');
				e.preventDefault();
				if(LSN['btnShow']){
					Buttons.aniShow();
				}
			}
			,'mouseEnter' : function(){
				//console.log('mouseEnter');
				Buttons.aniShow();
			}
			,'mouseLeave' : function(){
				//console.log('mouseLeave');
				Buttons.aniHide();
			}
		}
		,'handle' : {
			
		}
	};
	
	var Buttons = {
		'aniShow' : function(){
			LSN['btnShow'] && clearTimeout(LSN.btnShow);
			LSN['btnHide'] && clearTimeout(LSN.btnHide);
			LSN.btnShow = setTimeout(Buttons.show, 1200);
		}
		,'aniHide' : function(){
			LSN['btnShow'] && clearTimeout(LSN.btnShow);
			LSN['btnHide'] && clearTimeout(LSN.btnHide);
			LSN.btnHide = setTimeout(Buttons.hide, 1200);
		}
		,'show' : function(){
			/**
			 * Buttons
			 */
			nodes.btn_up.show();
			nodes.btn_down.show();
			nodes.btn_add.show();
			
			nodes.btn_up.css({
				'margin-left' : (Math.cos((2*Math.PI / 360) * -55) * ((opts.size[0] / 2) + 12)) - (nodes.btn_up.width() / 2)
				,'margin-top' : (Math.sin((2*Math.PI / 360) * -55) * ((opts.size[1] / 2) + 12)) - (nodes.btn_up.height() / 2)
			});
			
			nodes.btn_down.css({
				'margin-left' : (Math.cos((2*Math.PI / 360) * -30) * ((opts.size[0] / 2) + 12)) - (nodes.btn_down.width() / 2)
				,'margin-top' : (Math.sin((2*Math.PI / 360) * -30) * ((opts.size[1] / 2) + 12)) - (nodes.btn_down.height() / 2)
			});
			
			nodes.btn_add.css({
				'margin-left' : (Math.cos((2*Math.PI / 360) * 45) * ((opts.size[0] / 2) + 20)) - (nodes.btn_add.width() / 2)
				,'margin-top' : (Math.sin((2*Math.PI / 360) * 45) * ((opts.size[1] / 2) + 20)) - (nodes.btn_add.height() / 2)
			});
		}
		,'hide' : function(){
			nodes.btn_up.hide();
			nodes.btn_down.hide();
			nodes.btn_add.hide();
		}
	};
	
	var self = {
		'get'  : it.get
		,'set' : it.set
	};
	
	it.init();
	
	return self;
};
