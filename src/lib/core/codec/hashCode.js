module.exports = function (str) {
    str += '';
    var h = 0, off = 0;
    var len = str.length;

    for (var i = 0; i < len; i++) {
        h = 31 * h + str.charCodeAt(off++);
        if (h > 0x7fffffff || h < 0x80000000) {
            h = h & 0xffffffff;
        }
    }
    return h;
};