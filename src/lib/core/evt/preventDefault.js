/**
 * preventDefault
 *
 * @return {Event} e
 * @author shinate | shine.wangrs@gmail.com
 * @example
 * preventDefault();
 */
var $getEvent = require('./getEvent');

module.exports = function (e) {
    e = e || $getEvent(e);
    if (e.preventDefault) {
        e.preventDefault();
    } else {
        e.returnValue = false;
    }
};