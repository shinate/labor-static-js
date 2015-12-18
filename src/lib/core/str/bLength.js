/**
 * Get byte length
 *
 * @param {String} str
 * @return {Number} n
 * @example
 * bLength('aabbcc') === 6;
 */
module.exports = function (str) {
    if (!str) {
        return 0;
    }
    var aMatch = str.match(/[^\x00-\xff]/g);
    return (str.length + (!aMatch ? 0 : aMatch.length));
};
