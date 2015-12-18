/**
 * parse HTML
 *
 * @param {String} str
 * @return {Array} ret
 * @author shinate | shine.wangrs@gmail.com
 * @example
 * parseHTML('<div></div>') === [["<div>", "", "div", ""], ["</div>", "/", "div", ""]];
 */
module.exports = function (htmlStr) {
    var tags = /[^<>]+|<(\/?)([A-Za-z0-9]+)([^<>]*)>/g;
    var a, i;
    var ret = [];
    while (( a = tags.exec(htmlStr))) {
        var n = [];
        for (i = 0; i < a.length; i += 1) {
            n.push(a[i]);
        }
        ret.push(n);
    }
    return ret;
};
