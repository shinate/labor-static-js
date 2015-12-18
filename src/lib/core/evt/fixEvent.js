/**
 * Fix the difference of event in each browser
 *
 * @param {Event} e
 * @return {Event} e
 * @author shinate | shine.wangrs@gmail.com
 * @example
 * var ev = fixEvent(window.event);
 */
var $getEvent = require('./getEvent');

module.exports = function (e) {
    e = e || $getEvent();
    //fix target
    if (!e.target) {
        e.target = e.srcElement || document;
    }
    //fix pageX & pageY
    if (e.pageX == null && e.clientX != null) {
        var html = document.documentElement;
        var body = document.body;

        e.pageX = e.clientX + (html.scrollLeft || body && body.scrollLeft || 0) - (html.clientLeft || body && body.clientLeft || 0);
        e.pageY = e.clientY + (html.scrollTop || body && body.scrollTop || 0) - (html.clientTop || body && body.clientTop || 0);
    }
    //fix button
    if (!e.which && e.button) {
        if (e.button & 1) {
            e.which = 1;
        } // Left
        else if (e.button & 4) {
            e.which = 2;
        } // Middle
        else if (e.button & 2) {
            e.which = 3;
        } // Right
    }

    //fix relatedTarget
    if (e.relatedTarget === undefined) {
        e.relatedTarget = e.fromElement || e.toElement;
    }

    return e;
};
