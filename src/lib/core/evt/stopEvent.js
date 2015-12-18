/**
 * stop event
 *
 * @return {Event} e
 * @author shinate | shine.wangrs@gmail.com
 * @example
 * stopEvent();
 */
var $getEvent = require('./getEvent');

module.exports = function (e) {

    e = e || $getEvent();

    if (e.preventDefault) {
        e.preventDefault();
        e.stopPropagation();
    } else {
        e.cancelBubble = true;
        e.returnValue = false;
    }

    return false;

};
