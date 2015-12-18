/**
 * Insert before
 *
 * @param {Element} node
 * @param {Element} target
 * @author shinate | shine.wangrs@gmail.com
 * @example
 * insertBefore($.E('test'),$.E('target'));
 */
module.exports = function (node, target) {
    var parent = target.parentNode;
    parent.insertBefore(node, target);
};