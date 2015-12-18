/**
 * encode HTML
 *
 * @param {String} str
 * @return {String} str
 * @author shinate | shine.wangrs@gmail.com
 * @example
 * encodeHTML('&<>" ') === '&amp;&lt;&gt;&quot;$nbsp;';
 */
module.exports = function (str) {
    if (typeof str !== 'string') {
        throw 'encodeHTML need a string as parameter';
    }
    return str.replace(/\&/g, '&amp;').replace(/"/g, '&quot;').replace(/\</g, '&lt;').replace(/\>/g, '&gt;').replace(/\'/g, '&#39;').replace(/\u00A0/g, '&nbsp;').replace(/(\u0020|\u000B|\u2028|\u2029|\f)/g, '&#32;');
};
