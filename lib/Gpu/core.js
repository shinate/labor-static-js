/**
 * running id
 */
var reqID = 0;

/**
 * last time sign
 */
var lastime = 0;

/**
 * animation handles
 */
var ANIMS = {};

var ANIM_CFGS = {};

var TL = 0;

/**
 * Fix requestAnimationFrame
 */
var request = (function() {
	return window.requestAnimationFrame
	|| window.webkitRequestAnimationFrame
	|| window.mozRequestAnimationFrame
	|| window.oRequestAnimationFrame
	||
	// if all else fails, use setTimeout
	function(callback) {
		var curtime = window.performance.now ? window.performance.now() : Date.now();
		var s = Math.max(0, 16.7 - (curtime - lastime));
		try {
			return window.setTimeout(callback, s);
		} finally {
			lastime = curtime + s;
		}
		// shoot for 60 fps
	};
})();

/**
 * Fix cancelAnimationFrame
 */
var clean = (function() {
	return window.cancelAnimationFrame
	|| window.webkitCancelAnimationFrame
	|| window.mozCancelAnimationFrame
	|| window.oCancelAnimationFrame
	||
	function(id) {
		window.clearTimeout(id);
	};
})();

/**
 * Render
 * 
 * @param {Number} TP
 * @return {Number}
 */
var render = function(TP){
	
	var _cbargs;
	
	for(var name in ANIMS){
		if(ANIMS[name] !== null){
			
			_cbargs = ANIM_CFGS[name][1] > 0 ? ANIM_CFGS[name][0] / ANIM_CFGS[name][1] : ANIM_CFGS[name][0];
			
			ANIMS[name].call(null, _cbargs);
			
			ANIM_CFGS[name][0] += TP - TL;
			
			if(ANIM_CFGS[name][0] >= ANIM_CFGS[name][1]){
				removeAnimation(name);			
			}
		}
	}
	
	TL = TP;
	
	reqID = request(render);
};

/**
 * start anims
 */
var start = function(){
	if(!reqID)
		reqID = request(render);
};

/**
 * stop anims
 */
var stop = function(){
	if(reqID){
		clean(reqID);
		reqID = 0;
	}
};

/**
 * is running
 */
var isRunning = function(){
	return !!reqID;
};

/**
 * register animation to handle list
 * 
 * @param {String} name
 * @param {Function} animation
 */
var registerAnimation = function(name, animation, duration){
	if(hasAnimation(name))
		throw '"' + name + '" already exists!';

	ANIMS[name] = typeof animation === 'function' ? animation : null;
	
	ANIM_CFGS[name] = [0, duration || 0];
};

/**
 * check property in handle list
 * 
 * @param {String} name
 */
var hasAnimation = function(name){
	return typeof name !== 'undefined' && ANIMS.hasOwnProperty(name);
};

/**
 * remove property from handle list
 * 
 * @param {String} name
 */
var removeAnimation = function(name){
	if(hasAnimation(name)){
		ANIMS[name] = ANIM_CFGS[name] = null;
		delete ANIMS[name], ANIM_CFGS[name];
	}
};

/**
 * detecting whether an object is empty
 * 
 * @param {Object} obj
 * @return {Boolean}
 */
var isEmptyObject = function(obj){
	var name;
	for ( name in obj ) {
		return false;
	}
	return true;
};

module.exports = {
	'start'   : start
	,'stop'   : stop
	,'running': isRunning
	,'add'    : registerAnimation
	,'has'    : hasAnimation
	,'remove' : removeAnimation
};
