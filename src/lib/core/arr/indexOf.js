/**
 * @file indexOf.js
 * @author shinate | shine.wangrs@gmail.com
 *
 * @param {*} o
 * @param {array} a
 * @returns {number}
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
