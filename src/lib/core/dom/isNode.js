/**
 * is node
 *
 * @param {Element} node
 * @return {Boolean} true/false
 * @author shinate | shine.wangrs@gmail.com
 * @example
 * isNode(node) == true;
 */
module.exports = function (node) {
    return (node != undefined) && Boolean(node.nodeName) && Boolean(node.nodeType);
};