/**
 * 拖拽分发坐标的函数
 * @id STK.core.util.connect
 * @alias STK.core.util.connect
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
	$.core.util.connect.create({
		'sid' : 'server1',
		'handle' : function(fn, data, rid){},
		'onAbort' : function(rid){}
	});

	$.core.util.connect.request({
		'sid' : 'server1',
		'data' : {},
		'onSuccess' : function(data, rid){},
		'onError' : function(err, rid){}
	});

	res({
		'error' : true/false,
		'data' : {}
	});

	$.core.util.connect.abort(rid);
	$.core.util.connect.destroy(sid);
 */
$Import('core.json.jsonToStr');
$Import('core.json.strToJson');
$Import('core.func.empty');



STK.register('core.util.connect', function($){
	var that = {};
	/**
	serverList = {
		[[sid]] : {
			handle : function(function(){}, data, rid){},
			onAbort : function(rid){}
			callback : {
				[[rid]] : {
					'onSuccess' : function(data, rid){},
					'onError' : function(err, rid){}
				}....
			}
		}
		....
	};
	*/
	var serverList = {};
	var uniqueKey = 0;
	
	var hop = function(obj, prop){
		return Object.prototype.hasOwnProperty.call(obj, prop);
	};
	
	var getKey = function(){
		return (++ uniqueKey) + '' + new Date().getTime();
	};

	var response = function(sid, rid, isError, data){
		if(!hop(serverList, sid)){
			return false;
		}
		var server = serverList[sid];
		if(!hop(server.callback, rid)){
			return false;
		}
		var onSuccess = server.callback[rid].onSuccess;
		var onError = server.callback[rid].onError;
		var stringifyData = $.core.json.jsonToStr(data || {});
		setTimeout(function(){
			var data = $.core.json.strToJson(stringifyData);
			if(isError){
				data.type = 'error';
				onError(data, rid);
			}else{
				onSuccess(data, rid);
			}
		}, 0);
		delete server.callback[rid];
		return true;
	};
	
	
	that.request = function(spec){
		var sid = spec.sid;
		if(!sid || typeof sid != 'string'){
			return -1;
		}
		if(!hop(serverList, sid)){
			return -1;
		}
		var server = serverList[sid];
		var rid = getKey();
		var stringifyData = $.core.json.jsonToStr(spec.data || {});
		server.callback[rid] = {
			onSuccess : spec.onSuccess || $.core.func.empty,
			onError : spec.onError || $.core.func.empty
		};
		var res = function(args){
			response(sid, rid, args.error, args.data);
		};
		setTimeout(function(){
			server.handle(res, $.core.json.strToJson(stringifyData), rid);
		}, 0);
		return rid;
	};
	
	that.create = function(spec){
		if(!spec){
			return false;
		}
		var sid = spec.sid;
		if(!sid || typeof sid != 'string'){
			return false;
		}
		if(hop(serverList, sid)){
			return false;
		}
		var handle = spec.handle;
		if(typeof handle != 'function'){
			return false;
		}
		serverList[sid] = {
			handle : handle,
			onAbort : spec.onAbort || $.core.func.empty,
			callback : {}
		};
		return true;
	};
	
	
	that.abort = function(rid){
		if(!rid){
			return false;
		}
		for(var sid in serverList){
			var server = serverList[sid];
			if(hop(server.callback, rid)){
				setTimeout(function(){
					server.onAbort(rid);
				}, 0);
				delete server.callback[rid];
				return true;
			}
		}
		return false;
	};
	
	that.destory = function(sid){
		if(!sid || typeof sid != 'string'){
			return false;
		}
		if(!hop(serverList, sid)){
			return false;
		}
		for(var rid in serverList[sid].callback){
			try{
				serverList[sid].callback[rid].onError({'type': 'destroy'}, rid);
			}catch(exp){
			
			}
		}
		delete serverList[sid];
		return true;
	};
	
	return that;
});