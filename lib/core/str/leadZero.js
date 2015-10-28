/**
 * leadZero
 *
 * leadZero('123', 5) ==> '00123'
 */
module.exports = function(val, len) {
    return new Array((len || 10) - val.toString().length + 1).join('0') + val;
};