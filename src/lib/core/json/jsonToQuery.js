/**
 * json to querystring
 *
 * @param {Object} o
 * @return {String} pre
 */
module.exports = function (o) {
    var s = [], e = encodeURIComponent;
    for (var i in o) {
        if (o[i] != null && o[i] !== '') {
            s.push(e(i) + '=' + e(o[i]));
        }
    }
    return s.join('&');
};
