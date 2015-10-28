/**
 * Describe 隐藏iframe提交数据
 * @id STK.core.io.ijax
 * @alias STK.ijax
 * @param {Object} spec
	{
		'url'			: {String}		//请求地址
		'form'			: {Element},	//请求到form表单
		'args'			: {JSON},		//get参数
		'timeout'		: {Number},		//过期时间
		'onComplete'	: {Function},	//完成到回调函数,参数(成功的返回数据)
		'onTimeout'		: {Function},	//过期到回调函数(void)
		'onFail'		: {Function},	//通信失败到回调函数(void)
		'isEncode'		: {Boolean},	//是否对get参数编码
		'abaurl'		: {String},		//如果是跨域名请求，中转页面的地址
		'responseName'	: {String},		//返回执行的函数名,如服务器支持动态名字，可不写
		'varkey'		: {String},		//标示返回执行函数的请求字段名,默认值callback
		'abakey'		: {String}		//中转页面标示返回执行函数的字段名,默认值callback
	}
 * @return {Object}
	{
		abort:{Function} //销毁请求
	}
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 */
$Import("core.obj.parseParam");
$Import("core.func.empty");
$Import("core.io.getIframeTrans");
$Import("core.util.getUniqueKey");
$Import("core.util.URL");

STK.register('core.io.ijax', function($){
	return function(spec){
		var conf, trans, uniqueID, timer, destroy, getData, that;
		
		conf = $.core.obj.parseParam({
			'url'			: '',
			'form'			: null,
			'args'			: {},
			'uniqueID'		: null,
			'timeout'		: 30 * 1000,
			'onComplete'	: $.core.func.empty,
			'onTimeout'		: $.core.func.empty,
			'onFail'		: $.core.func.empty,
			'asynchronous'	: true,
			'isEncode'		: true,
			'abaurl'		: null,
			'responseName'	: null,
			'varkey'		: 'callback',
			'abakey'		: 'callback'
		}, spec);
		
		that = {};
		
		if (conf.url == '') {
			throw 'ijax need url in parameters object';
		}
		if(!conf.form){
			throw 'ijax need form in parameters object';
		}
		
		trans = $.core.io.getIframeTrans();
		
		
		/*----parameters ball shit----*/
		uniqueID = conf.responseName || ('STK_ijax_' + $.core.util.getUniqueKey());
		getData = {};
		getData[conf['varkey']] = uniqueID;
		if(conf.abaurl){
			conf.abaurl = $.core.util.URL(conf.abaurl).setParams(getData);
			getData = {};
			getData[conf['abakey']] = conf.abaurl.toString();
		}
		conf.url = $.core.util.URL(conf.url,{
			'isEncodeQuery' : conf['isEncode']
		}).setParams(getData).setParams(conf.args);
		/*----end parameters ball shit----*/
		
		
		destroy = function(){
			window[uniqueID] = null;
			trans.destroy();
			trans = null;
			clearTimeout(timer);
		};
		
		timer = setTimeout(function(){
			try{
				conf.onTimeout();
				conf.onFail();
			}catch(exp){
				
			}finally{
				destroy();
			}
			
		}, conf.timeout);
		
		
		window[uniqueID] = function(oResult, query) {
			try{
				conf.onComplete(oResult, query);
			}catch(exp){
				
			}finally{
				destroy();
			}
		};
		
		
		conf.form.action = conf.url.toString();
		conf.form.target = trans.getId();
		conf.form.submit();
		
		that.abort = destroy;
		
		return that;
		
	};
});