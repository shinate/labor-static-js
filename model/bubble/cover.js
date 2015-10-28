var coData = require('../common/coData');

module.exports = function(el){
	var Z = coData.get('cover') || 10000;
	el.style.zIndex = ++ Z;
	coData.set('cover', Z);
};
