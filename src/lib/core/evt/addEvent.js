/**
 * Add event for a node
 *
 * @param {Node} sNode
 * @param {String} sEventType
 * @param {Function} oFunc
 * @return {Boolean} TRUE/FALSE
 * @author shinate | shine.wangrs@gmail.com
 * @example
 * addEvent($.E('id'),'click',function(e){
 * 	console.log(e);
 * });
 */
module.exports = function (el, type, fn) {
    if (el == null || typeof fn !== "function") {
        return false;
    }
    if (el.addEventListener) {
        el.addEventListener(type, fn, false);
    } else if (el.attachEvent) {
        el.attachEvent('on' + type, fn);
    } else {
        el['on' + type] = fn;
    }
    return true;
};
