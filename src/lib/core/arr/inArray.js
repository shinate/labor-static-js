/**
 * @file inArray.js
 * @author shinate | shine.wangrs@gmail.com
 *
 * @param {*} o which will be find out
 * @param {array} a source array
 * @returns {boolean}
 */
module.exports = function (o, a) {
    return indexOf(o, a) > -1;
};