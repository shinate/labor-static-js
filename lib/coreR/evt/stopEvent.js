/**
 * stop event
 * @id STK.core.evt.stopEvent
 * @alias STK.core.evt.stopEvent
 * @return {Event} e
 * @author Robin Young | yonglin@staff.sina.com.cn @Finrila | wangzheng4@
 * @example
 * STK.core.evt.stopEvent();
 */
$Import("core.evt.getEvent");
STK.register('core.evt.stopEvent', function($){
	
	return function(event){
		
		event = event || $.core.evt.getEvent();
		
		if (event.preventDefault) {
			event.preventDefault();
			event.stopPropagation();
		} else {
			event.cancelBubble = true;
			event.returnValue = false;
		}
		
		return false;
		
	};
	
});
