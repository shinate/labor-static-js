/**
 * Get page size
 * @id STK.core.util.pageSize
 * @alias
 * @return {Object} 
	{
		'page':{
			width: {Number},
			height: {Number}
		},
		'win':{
			width: {Number},
			height: {Number}
		}
	};
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * $.core.util.pageSize();
 */
$Import('core.util.winSize');
STK.register('core.util.pageSize', function($){
	return function(_target){
		var target;
		if (_target) {
			target = _target.document;
		}
		else {
			target = document;
		}
		var _rootEl = (target.compatMode == "CSS1Compat" ? target.documentElement : target.body);
		var xScroll, yScroll;
		var pageHeight,pageWidth;
		if (window.innerHeight && window.scrollMaxY) {
			xScroll = _rootEl.scrollWidth;
			yScroll = window.innerHeight + window.scrollMaxY;
		}
		else 
			if (_rootEl.scrollHeight > _rootEl.offsetHeight) {
				xScroll = _rootEl.scrollWidth;
				yScroll = _rootEl.scrollHeight;
			}
			else {
				xScroll = _rootEl.offsetWidth;
				yScroll = _rootEl.offsetHeight;
			}
		var win_s = $.core.util.winSize(_target);
		if (yScroll < win_s.height) {
			pageHeight = win_s.height;
		}
		else {
			pageHeight = yScroll;
		}
		if (xScroll < win_s.width) {
			pageWidth = win_s.width;
		}
		else {
			pageWidth = xScroll;
		}
		return {
			'page':{
				width: pageWidth,
				height: pageHeight
			},
			'win':{
				width: win_s.width,
				height: win_s.height
			}
		};
	};
});
