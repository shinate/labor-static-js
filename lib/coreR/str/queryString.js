/**
 * get querykey's value
 * @id STK.core.str.queryString
 * @alias STK.core.str.queryString
 * @param {String} sKey
 * @param {Object} oOpts
 * @return {String} str
 * @author FlashSoft | fangchao@staff.sina.com.cn
 * @example
 * STK.core.str.queryString('author',{'source':'author=flashsoft&test=1'}) === 'flashsoft';
 */
$Import('core.obj.parseParam');
STK.register('core.str.queryString', function($){
	return function(sKey, oOpts){
		var opts = $.core.obj.parseParam({
			source: window.location.search.substr(1),
			split: '&'
		}, oOpts);
		var rs = new RegExp("(^|" + opts.split + ")" + sKey + "=([^\\" + opts.split + "]*)(\\" + opts.split + "|$)", "gi").exec(opts.source), tmp;
		if (tmp = rs) {
			return tmp[2];
		}
		return null;
	};
});
