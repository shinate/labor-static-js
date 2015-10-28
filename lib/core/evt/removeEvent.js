/**
 * Remove event for a node
 * @id STK.core.evt.removeEvent
 * @alias STK.core.evt.removeEvent
 * @param {Node} el
 * @param {Function} func
 * @param {String} sEventType
 * @return {Boolean} TRUE/FALSE
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * var hock= function(e){console.log(e);}
 * STK.core.evt.removeEvent($.E('id'), hock, 'click');
 */
module.exports = function(el, type, fn) {
    if (el == null || typeof fn !== "function") {
        return false;
    }
    if (el.removeEventListener) {
        el.removeEventListener(type, fn, false);
    } else if (el.detachEvent) {
        el.detachEvent("on" + type, fn);
    }
    el['on' + type] = null;
    return true;
};