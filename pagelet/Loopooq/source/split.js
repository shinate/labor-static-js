var $ = require('/lib/jQuery');
var Plane = require('/lib/Plane');

var options = {
	'pointRadius' : 0
	,'centerPaddingRadius' : 0
	,'hitRadians' : null
	,'hitSector' : 0
};

module.exports = {
	/**
	 * 圆周分布
	 * @param {Number} splitNum
	 * @param {Number} frameWidth
	 * @param {Number} frameHeight
	 * @param {Number} pointRadius
	 * @param {Number} centerPaddingRadius
	 */
	'fan' : function(splitNum, frameSize, opts){
		
		opts = $.extend({}, options, opts || {});
		
		var rote = 0
			,srote = (2 * Math.PI - (opts.hitRadians == null ? 0 : opts.hitSector * 2)) / splitNum
			,plist = []
			,tried = 0
			,PCDist = 0
			,Ptarget;
		
		//检测交集
		var noInter = function(P, Pl){
			if(Pl.length >= 2){
				return Plane.distance([0, 0], P) > 1.5 * PCDist && Plane.distance(Pl[0], P) > PCDist && Plane.distance(Pl[Pl.length - 1], P) > PCDist;
			} else if(Pl.length == 1) {
				return Plane.distance([0, 0], P) > 1.5 * PCDist && Plane.distance(Pl[0], P) > PCDist;
			} else {
				return Plane.distance([0, 0], P) > 1.5 * PCDist;
			}
		};
		
		PCDist = opts.pointRadius + opts.centerPaddingRadius;
		
		frameSize = [frameSize[0] / 2 - PCDist, frameSize[1] / 2 - PCDist];
		
		var offset = opts.hitRadians == null ? 0 : Math.PI - opts.hitRadians + opts.hitSector;
			
		for(var i=0,rand;i<splitNum;i++){
			
			tried = 0;
			
			do {
				
				//随机角度，Y周+方向为首个区域
				rote = (srote * i) + (Math.random() * srote / 2) - (srote / 4) + offset;
			
				rand = Math.random();
				
				Ptarget = [
					(frameSize[0] * rand + opts.centerPaddingRadius) * Math.cos(rote)
					,(frameSize[1] * rand + opts.centerPaddingRadius) * Math.sin(rote)
				];
				
				tried ++;
				//console.log(noInter(Ptarget, plist));
			} while (
				!noInter(Ptarget, plist)
				&&
				tried < 3
			);
			
			Ptarget.push(rote);
			Ptarget.push(Math.pow(Math.pow(Ptarget[0], 2) + Math.pow(Ptarget[1], 2), 0.5));
			
			plist.push(Ptarget);
		}
				
		return plist;
	}
};