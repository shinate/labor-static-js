/**
 * Describe 事件名称适配器
 * @id STK.core.evt.eventName
 * @param {string} eventName
 * @return {string} eventName
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 */
STK.register('core.evt.eventName', function($){
	
	var transitionVendors = {
		WebkitTransition: 'webkitTransitionEnd',
		MozTransition: 'transitionend',
		OTransition: 'oTransitionEnd',
		msTransition: 'MSTransitionEnd',
		transition: 'transitionend'
	};
	return function(eventName){
		if(eventName === 'mousewheel'){
			if('onmousewheel' in document){
				return 'mousewheel';
			}else{
				return 'DOMMouseScroll';
			}
		}
		if(eventName === 'transitionend'){
			var tester = $.C('div');
			for(var k in transitionVendors) {
				if(k in tester.style) {
					return transitionVendors[k];
				}
			};
		}
		return eventName;
		
	}
});