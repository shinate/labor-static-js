/**
 * preventDefault
 * @id STK.core.evt.preventDefault
 * @return {Event} e
 * @author Finrila | wangzheng4@staff.sina.com.cn
 * @example
 * STK.core.evt.preventDefault();
 */
var $getEvent = require('./getEvent');

module.exports = function(e) {
	e = e || $getEvent(e);
	if (e.preventDefault) {
		e.preventDefault();
	} else {
		e.returnValue = false;
	}
};