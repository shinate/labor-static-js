/**
 * @file indexOf.js
 * @param o
 * @param a
 * @returns {*}
 */
module.exports = function (o, a) {
    if (a.indexOf) {
        return a.indexOf(o);
    }
    for (var i = 0, len = a.length; i < len; i++) {
        if (a[i] === o) {
            return i;
        }
    }
    return -1;
};
