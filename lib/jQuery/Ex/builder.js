var $ = require('../core');

module.exports = function(node, contain){
	var ns = $('[node-type]', $(node)), dl = {}, nt, el;
	contain = contain || '';
	ns.each(function(n){
		el = ns.eq(n);
		nt = el.attr('node-type');
		if(!contain || contain === nt){
			if(dl[nt]){
				if(!$.isArray(dl[nt])){
					dl[nt] = [dl[nt]];
				}
				dl[nt].push($(el.get(0)));
			} else {
				dl[nt] = $(el.get(0));
			}
		}
	});
	return dl;
};