var Plane = require('/lib/Plane');

module.exports = {
	/**
	 * 圆周分布
	 * @param {Number} num
	 * @param {Number} frameWidth
	 * @param {Number} frameHeight
	 * @param {Number} pointRadius
	 * @param {Number} centerPaddingRadius
	 */
	'fan' : function(num, frameWidth, frameHeight, pointRadius, centerPaddingRadius){
		
		var rote = 0
			,srote = 360 / num
			,plist = []
			,rand
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
			
		pointRadius = pointRadius || 0;
		
		centerPaddingRadius = centerPaddingRadius || 0;
		
		PCDist = pointRadius + centerPaddingRadius;
		
		frameWidth = frameWidth / 2 - PCDist;
		frameHeight = frameHeight / 2 - PCDist;
		
		for(var i=0;i<num;i++){
			
			tried = 0;
			//console.log(srote * i, ((srote * i)) * 2 * Math.PI / 360);
			
			//console.log([
			//	(frameWidth * rand + centerPaddingRadius) * Math.sin(rote)
			//	,(frameHeight * rand + centerPaddingRadius) * Math.cos(rote) * -1
			//]);
			
			do {
				
				//随机角度，Y周+方向为首个区域
				rote = ((srote * i) + (Math.random() * srote / 2) - (srote / 4)) * (Math.PI / 180);
			
				rand = Math.random();
				
				Ptarget = [
					(frameWidth * rand + centerPaddingRadius) * Math.cos(rote)
					,(frameHeight * rand + centerPaddingRadius) * Math.sin(rote)
				];
				
				tried ++;
				//console.log(noInter(Ptarget, plist));
			} while (
				!noInter(Ptarget, plist)
				&&
				tried < 3
			);
			
			//Ptarget['x'] = _P[0];
			//Ptarget['y'] = _P[1];
			//Ptarget['r'] = Math.sqrt(Math.pow(_P[0], 2) + Math.pow(_P[1], 2));
			//Ptarget['rote'] = rote;
			
			Ptarget.push(rote);
			Ptarget.push(Math.sqrt(Math.pow(Ptarget[0], 2) + Math.pow(Ptarget[1], 2)));
			
			plist.push(Ptarget);
		}
		
		//console.log(plist);
				
		return plist;
	}
};