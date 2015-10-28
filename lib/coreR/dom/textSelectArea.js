/**
 * get input/textarea selection
 * @id STK.core.dom.getSelectText
 * @alias STK.core.dom.getSelectText
 * @param {Element} input
 * @return {Object} {'start':[Number],'len':[Number]}
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * var area STK.core.dom.getSelectText($.E('input'));
 * //{'start':1,'len':3}
 */
STK.register('core.dom.textSelectArea', function($){
	return function(input){
		var ret = {
			'start' : 0,
			'len' : 0
		};
		if(typeof input.selectionStart === 'number'){
			ret.start = input.selectionStart;
			ret.len = input.selectionEnd - input.selectionStart;
		}else if(typeof document.selection !== 'undefined'){
			var workRange = document.selection.createRange();
			//去他妈的IE6，傻逼浏览器，行为一直能死啊！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
			if(input.tagName === 'INPUT'){
				var surveyRange = input.createTextRange();
			}else if(input.tagName === 'TEXTAREA'){
				var surveyRange = workRange.duplicate();
				surveyRange.moveToElementText(input);
			}
			//end fuck IE6
			surveyRange.setEndPoint('EndToStart', workRange);
			ret.start = surveyRange.text.length;
			ret.len = workRange.text.length;
			//此段代码是计算EndToStart产生的差值的,主要是IE忽略了之间的回车
			var k = 0;
			surveyRange.moveEnd('character',input.value.length - ret.start);
			surveyRange.moveStart('character', ret.start);
			for(var i = ret.start; i < input.value.length; i += 1){
				if(surveyRange.compareEndPoints('StartToStart',workRange) < 0){
					surveyRange.moveStart('character', 1);
					k += 2;//这个是为了处理回车有\r\n的.因为暂时只发现了回车有这个差值才使用了只加2的方案,如有别的字符也可以产生差值请使用下面注释的方案处理回车,这里就自加1,
				}else{
					break;
				}
			}
			// 处理回车的方案
			// for (var j = 0; j <= k; j ++) {
			// 	if (input.value.charAt(ret.start + j) == '\n') {
			// 		k += 1;
			// 	}
			//}
			ret.start += k;
			workRange = null;
			surveyRange = null;
		}
		return ret;
	};
});