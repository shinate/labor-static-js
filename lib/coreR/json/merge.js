
/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @id STK.core.json.merge
 * @alias STK.core.json.merge
 * @param {Object} origin
 * @param {Object} cover
 * @return {Object} opts{isDeep:true/false}
 * @example
 * var j1 = {'a':1,'b':2,'c':3};
 * var j2 = {'a':2,'d':4};
 * var mJson = $.core.json.merge(j1, j2);
 */

$Import("core.arr.inArray");
$Import("core.arr.isArray");
$Import("core.dom.isNode");
$Import("core.obj.parseParam");
STK.register('core.json.merge',function($){
	var checkCell = function(obj){
		if(obj === undefined){
			return true;
		}
		if(obj === null){
			return true;
		}
		if($.core.arr.inArray( (typeof obj), ['number','string','function','boolean'])){
			return true;
		}
		if($.core.dom.isNode(obj)){
			return true;
		}
		return false;
	};
	var deep = function(ret, key, coverItem){
		if(checkCell(coverItem)){
			ret[key] = coverItem;
			return;
		}
		if($.core.arr.isArray(coverItem)){
			if(!$.core.arr.isArray(ret[key])){
				ret[key] = [];
			}
			for(var i = 0, len = coverItem.length; i < len; i += 1){
				deep(ret[key], i, coverItem[i]);
			}
			return;
		}
		if(typeof coverItem === 'object'){
			if(checkCell(ret[key]) || $.core.arr.isArray(ret[key])){
				ret[key] = {};
			}
			for(var k in coverItem){
				deep(ret[key], k, coverItem[k]);
			}
			return;
		}
	};
	
	var merge = function(origin, cover, isDeep){
		var ret = {};
		if(isDeep){
			for(var k in origin){
				deep(ret, k, origin[k]);
			}
			for(var k in cover){
				deep(ret, k, cover[k]);
			}
		}else{
			for(var k in origin){
				ret[k] = origin[k];
			}
			for(var k in cover){
				ret[k] = cover[k];
			}
		}
		return ret;
	};
	
	return function(origin, cover, opts){
		var conf = $.core.obj.parseParam({
			'isDeep' : false
		}, opts);
		
		return merge(origin, cover, conf.isDeep);
	};
});