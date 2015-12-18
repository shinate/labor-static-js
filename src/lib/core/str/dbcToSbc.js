/**
 * 全角字转半角字
 *
 * @param {String} str
 * @return {String} str
 * @author shine.wangrs@gmail.com
 * @example
 * dbcToSbc('ＳＡＡＳＤＦＳＡＤＦ') === 'SAASDFSADF';
 */
module.exports = function (str) {
    return str.replace(/[\uff01-\uff5e]/g, function (a) {
        return String.fromCharCode(a.charCodeAt(0) - 65248);
    }).replace(/\u3000/g, " ");
};