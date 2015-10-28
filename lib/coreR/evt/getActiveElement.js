/**
 * Describe 获取当前活动的对象
 * @id	STK.core.evt.getActiveElement
 * @alias
 * @return {Element}
 * @author FlashSoft | fangchao@staff.sina.com.cn
 * @example
 */
$Import('core.evt.getEvent');
STK.register('core.evt.getActiveElement', function($) {
    return function () {
	    try {
	        var evt = $.core.evt.getEvent();
	        return document.activeElement? document.activeElement: evt.explicitOriginalTarget;
	    }
	    catch (e) {
	        return document.body;
	    }
	};
});
