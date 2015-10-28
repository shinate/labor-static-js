/**
 * @param {String|HTML Element} node id or element
 */
module.exports = function(node) {
	node = typeof node === 'string' ? document.getElementById(node) : node;
	try {
		node.parentNode.removeChild(node);
	} catch (e) {}
};
