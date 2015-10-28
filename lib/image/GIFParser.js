var Lzw = require('Lzw');

module.exports = (function(){
	
	/**
	 * 图片原型
	 */
	var imagePrototype = function(){
		return {
			/**
			 * 版本号
			 */
			'version' : ''
			/**
			 * 逻辑屏幕宽度
			 */
			,'width' : 0
			/**
			 * 逻辑屏幕高度
			 */
			,'height' : 0
			/**
			 * 颜色深度
			 */
			,'colorResolution' : 0
			/**
			 * 全局色表分类标志
			 */
			,'sorted' : false
			/**
			 * 全局色表
			 */
			,'globalPalette' : null
			/**
			 * 背景色索引
			 */
			,'backgroundIndex' : -1
			/**
			 * 像素宽高比
			 */
			,'pixelAspectRadio' : 0
			/**
			 * 图像各帧
			 */
			,'frames' : []
		};
	};
	
	/**
	 * 帧原型
	 */
	var framPrototype = function(){
    	return {
			/**
			 * X方向偏移量
			 */
			'offsetX' : 0
			/**
			 * Y方向偏移量
			 */
		   	,'offsetY' : 0
			/**
			 * 图象宽度
			 */
			,'width' : 0
			/**
			 * 图象高度
			 */
			,'height' : 0
			/**
			 * 局部色表
			 */
			,'localPalette' : null
			/**
			 * 颜色深度
			 */
			,'colorResolution' : 0
			/**
			 * 交错标志
			 */
			,'interlace' : false
			/**
			 * 局部色表分类标志
			 */
			,'sorted' : false
			/**
			 * 图像数据，存储各像素颜色的整数索引
			 */
			,'data' : []
			/**
			 * 透明色索引
			 */
			,'transparentIndex' : -1
			/**
			 * 帧延时
			 */
			,'delay' : 0
			/**
			 * 单帧完成的数据，可进行单帧独立渲染
			 */
			,'exactData' : []
		};
	};
	
	var it = function(Result){
		
		/**
		 * 图片二进制数据
		 */
		var Bytes = '';
		
		/**
		 * 配置
		 */
		var options;
		
		/**
		 * 快照
		 */
		var snapshot = [];
		
		
		var it = {
			'init' : function(){
				it.parseSource();
			}
			,'parseSource' : function(){
				
				options = imagePrototype();
								
				if(it.is.fileResult(Result)){
					if(it.is.gifResult(Result)){
						Result = it.get.base64Source(Result);
					} else {
						console.log('ERROR: Not GIF resource!');
						return;
					}
				}
				
				Bytes = it.get.bytes(Result);
				
				if(!Bytes){
					console.log('ERROR: Invalid source!');
					return;
				}
				var i = 0;
				for(;i<6; i++){
					options.version += String.fromCharCode(Bytes[i]);
				}
				if(!it.is.gifSource(options.version)){
					console.log('ERROR: Not GIF resource!');
					return null;
				}
				
				options.width = Bytes[i] | (Bytes[i + 1] << 8);
				options.height = Bytes[i + 2] | (Bytes[i + 3] << 8);
				
				var tp = Bytes[i + 4];
				
				options.colorResolution = (tp >> 4 & 0x7) + 1;
				options.sorted = (tp & 0x8) ? true : false;
				options.backgroundIndex = Bytes[i + 5];
				options.pixelAspectRadio = Bytes[i + 6];
				if(tp & 0x80){
					options.globalPalette = [];
					i += it.get.palette(i + 7, Bytes, options.globalPalette, 2 << (tp & 0x7));
				}				
				i += 7;
				
				var x;
				
				/**
				 * 获取帧起始位置
				 */
				for(x=i; x<Bytes.length;x++){
					if(Bytes[x] == 0x21 && Bytes[x + 1] == 0xF9){
						break;
					}
				}
				
				/**
				 * 单帧
				 */
				if(x == Bytes.length){
					for(; i<Bytes.length; i++){
						if(bytes[i] == 0x2C){
							break;
						}
					}
					if(i == Bytes.length){
						console.log("ERROR: Can not find the image data!");
						return;
					}
					var f = framPrototype();
					if(!it.get.frame(i, f)){
						return null;
					} else {
						options.frames.push(f);
					}
				/**
				 * 动画
				 */
				} else {
					i = x;
					do{
						var f = framPrototype();
						var t = it.get.frame(i, f);
						if(!t){
							return null;
						}
						options.frames.push(f);
						for(i+=t; i<Bytes.length; i++){
							if(Bytes[i] == 0x21 && Bytes[i+1] == 0xF9){
								break;
							}
						}
					} while(i < Bytes.length);
				}
			}
			,'is' : {
				'fileResult' : function(c){
					return /^data:/.test(c);
				}
				,'gifResult' : function(c){
					return /:image\/gif/.test(c);
				}
				,'gifSource' : function(c){
					return /^GIF8[69]a/.test(c);
				}
			}
			,'get' : {
				'base64Source' : function(res){
					return res.substr(res.indexOf(String.fromCharCode(0x2C)) + 1);
				}
				,'bytes' : function(str){
					if(!str.length || str.length % 4){
						return null;
					}
					var code64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
					var index64=[];
					for(var i=0; i<code64.length; i++){
						index64[code64.charAt(i)] = i;
					}
					var c0,c1,c2,c3,b0,b1,b2;
					var len = str.length;
					var len1 = len;
					if(str.charAt(len-1)=='='){
						len1-=4;
					}
					var result=[];
					for(var i=0,j=0; i<len1; i+=4){
						c0 = index64[str.charAt(i)];
						c1 = index64[str.charAt(i+1)];
						c2 = index64[str.charAt(i+2)];
						c3 = index64[str.charAt(i+3)];
						b0 = (c0<<2) | (c1>>4);
						b1 = (c1<<4) | (c2>>2);
						b2 = (c2<<6) | c3;
						result.push(b0 & 0xff);
						result.push(b1 & 0xff);
						result.push(b2 & 0xff);
					}
					if(len1 != len){
						c0 = index64[str.charAt(i)];
						c1 = index64[str.charAt(i+1)];
						c2 = str.charAt(i+2);
						b0 = (c0<<2) | (c1>>4);
						result.push(b0 & 0xff);
						if(c2 != '='){
							c2 = index64[c2];
							b1 = (c1<<4) | (c2>>2);
							result.push(b1&0xff);
						}
					}
					return result;
				}
				/**
				 * 获取配色表
				 */
				,'palette' : function(pos, s, d, len){
					len *= 3;
					for(var i = pos; i < pos+len; i += 3){
						/*
						d.push('#'
							+ (s[i]   <= 0xF ? "0" : "") + s[i].toString(16)
							+ (s[i+1] <= 0xF ? "0" : "") + s[i+1].toString(16)
							+ (s[i+2] <= 0xF ? "0" : "") + s[i+2].toString(16)
						);
						*/
						d.push([s[i], s[i+1], s[i+2]]);
					}
					return len;
				}
				/**
				 * 内部过程，整合数据段
				 */
				,'block' : function(pos, s, d){
					var p = pos;
					while(len = s[p++]){
						for(var i=0;i<len;i++){
							d.push(s[p+i]);
						}
						p += len;
					}
					return p-pos;
			    }
				,'frame' : function(pos, opts){
					var i = pos;
					if(Bytes[i] == 0x21){
						i += 3;
						if(Bytes[i] & 1){
							opts.transparentIndex = Bytes[i + 3];
						}

						opts.delay = Bytes[i + 1] | (Bytes[i + 2]<<8);
						
						for(i+=5; i<Bytes.length && Bytes[i]!=0x2C; i++);
						if(i == Bytes.length){
					   		console.log('ERROR: Can not find the image identifier!');
							return;
						}
					}
					opts.offsetX = Bytes[i + 1] | (Bytes[i + 2]<<8);
					opts.offsetY = Bytes[i + 3] | (Bytes[i + 4]<<8);
					opts.width   = Bytes[i + 5] | (Bytes[i + 6]<<8);
					opts.height  = Bytes[i + 7] | (Bytes[i + 8]<<8);
					var f = Bytes[i + 9];
					i += 10;
					if(f & 0x40){
						opts.interlace = true;
					}
					if(f & 0x20){
						opts.sorted = true;
					}
					if(f & 0x80){
						opts.colorResolution = (f & 0x7) + 1;
						opts.localPalette = [];
						i += it.get.palette(i, Bytes, opts.localPalette, 1 << opts.colorResolution);
					} else {
					   opts.colorResolution = options.colorResolution;
					   opts.localPalette = options.globalPalette;
					}
					var lzwLen = Bytes[i++] + 1;
					i += it.get.block(i, Bytes, opts.data);
					opts.data = Lzw.decode(opts.data, lzwLen);
					
					opts.exactData = it.create.exactData(opts);
					
					return opts.data ? i - pos : 0;
				}
			}
			,'create' : {
				/**
				 * 创建(叠加)快照
				 */
				'snapshot' : function(){
					var i;
					for(i=0;i<options.width*options.height;i++){
						snapshot.push();
					}
				}
				/**
				 * 创建逐帧数据
				 */
				,'exactData' : function(opts){
					if(snapshot.length <= 0){
						it.create.snapshot();
					}
					var x,y,i = 0;
					for(y=opts.offsetY; y<opts.offsetY+opts.height; y++){
						for(x=opts.offsetX; x<opts.offsetX+opts.width; x++){
							snapshot[y * options.width + x] = opts.localPalette[opts.data[i]];
							i++;
						}
					}
					return [].concat(snapshot);
				}
			}
		};
		
		var self = {
			'data' : function(){
				return options;
			}
		};
		
		it.init();
		
		return self;
	};
	
	return it;
})();