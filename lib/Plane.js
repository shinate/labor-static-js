module.exports = {
	'distance' : function(P1, P2){
		return Math.sqrt(Math.pow(P2[0] - P1[0], 2) + Math.pow(P2[1] - P1[1], 2));
	}
};