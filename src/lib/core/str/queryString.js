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

var extend = require('../obj/extend');

module.exports = function (key, opts) {
    var opts = extend({}, {
        source: window.location.search.substr(1),
        split: '&'
    }, opts || {});
    var rs = new RegExp("(^|" + opts.split + ")" + key + "=([^\\" + opts.split + "]*)(\\" + opts.split + "|$)", "gi").exec(opts.source), tmp;
    if (tmp = rs) {
        return tmp[2];
    }
    return null;
};
