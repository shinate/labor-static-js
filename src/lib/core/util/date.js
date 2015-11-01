/**
 *
 * @param {Number} Y 年
 * @param {Number} M 月
 * @param {Number} D 日
 * @param {Number} H 时
 * @param {Number} I 分
 * @param {Number} S 秒
 * @param {Number} V 毫秒
 */
module.exports = function (Y, M, D, H, I, S, V) {
    Y = Y || 0, M = M || 1, D = D || 0, H = H || 0, I = I || 0, S = S || 0, V = V || 0;
    V > 1000 && ( V = 0);
    var DH = new Date(0);
    DH.setFullYear(Y), DH.setMonth(M - 1), DH.setDate(D), DH.setHours(H), DH.setMinutes(I), DH.setSeconds(S), DH.setMilliseconds(V);
    return DH;
};