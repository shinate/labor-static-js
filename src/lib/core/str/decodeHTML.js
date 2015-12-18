/**
 * decode HTML
 *
 * @param {String} str
 * @return {String} str
 * @author shinate | shine.wangrs@gmail.com
 * @example
 * decodeHTML('&amp;&lt;&gt;&quot;$nbsp;') === '&<>" ';
 */
module.exports = function (str) {
    if (typeof str !== 'string') {
        throw 'decodeHTML need a string as parameter';
    }
    return str.replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, '\'').replace(/&nbsp;/g, '\u00A0').replace(/&#32;/g, '\u0020').replace(/&amp;/g, '\&');
};
