/**
 * 是否已经DomReady的检测方法
 * @id STK.core.dom.isDomReady
 * @return {boolean} 是否已经ready
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example 
 * console.log(STK.core.dom.isDomReady());
 */

$Import('core.dom.ready');

STK.register('core.dom.isDomReady', function($){
	var domready = false;
	$.core.dom.ready(function(){
		domready = true;
	});
	return function(){
		return domready;
	};
});