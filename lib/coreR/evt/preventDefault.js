/**
 * preventDefault
 * @id STK.core.evt.preventDefault
 * @return {Event} e 
 * @author Finrila | wangzheng4@staff.sina.com.cn
 * @example
 * STK.core.evt.preventDefault();
 */
$Import('core.evt.getEvent');
STK.register('core.evt.preventDefault', function($){
	return function(event) {
		event = event || $.core.evt.getEvent();
		if (event.preventDefault) {
			event.preventDefault();
		} else {
			event.returnValue = false;
		}
	};
});