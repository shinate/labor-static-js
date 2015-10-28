/**
 * set Elements style
 * @id STK.core.dom.setStyle
 * @alias STK.core.dom.setStyle
 * @param {Element} node
 * @param {String} property
 * @param {String} val
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * STK.core.dom.setStyle($.E('test'),'display','none');
 */
function supportFilters() {
	if ('y' in supportFilters) {
		return supportFilters.y;
	}
	return supportFilters.y = ('filters' in document.createElement('div'));
}

module.exports = function(node, property, val){
	if (supportFilters()) {
		switch (property) {
			case "opacity":
				node.style.filter = "alpha(opacity=" + (val * 100) + ")";
				if (!node.currentStyle || !node.currentStyle.hasLayout) {
					node.style.zoom = 1;
				}
				break;
			case "float":
				property = "styleFloat";
			default:
				node.style[property] = val;
		}
	} else {
		if (property == "float") {
			property = "cssFloat";
		}
		node.style[property] = val;
	}
};