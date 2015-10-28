/**
 * Get event object
 * @id STK.core.evt.getEvent
 * @alias STK.core.evt.getEvent
 * @return {Event} e
 * @author Robin Young | yonglin@staff.sina.com.cn  @Finrila | wangzheng4@
 * @example
 * var ev = STK.core.evt.getEvent();
 */
STK.register('core.evt.getEvent', function($) {
	
	return (function() {
		if (document.addEventListener) {
			return function() {
				var o = arguments.callee;
				var e;
				do {
					e = o.arguments[0];
					if (e && /Event/.test(Object.prototype.toString.call(e))) {
						return e;
					}
				} while (o = o.caller);
				return e;
			};
		} else {
			return function() {
				return window.event;
			};
		}
	}());
	
});
