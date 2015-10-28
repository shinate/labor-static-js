/**
 * stop event
 * @id STK.core.evt.stopEvent
 * @alias STK.core.evt.stopEvent
 * @return {Event} e
 * @author Robin Young | yonglin@staff.sina.com.cn @Finrila | wangzheng4@
 * @example
 * STK.core.evt.stopEvent();
 */
var $getEvent = require('getEvent');

module.exports = function(e) {

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
