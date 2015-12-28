var leadZero = require('../str/leadZero');
var month = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];
var week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
var sufix = ['st', 'nd', 'rd', 'th'];

function parse(date) {
    if (date == null) {
        date = new Date();
    } else if (!(date instanceof Date) && ('' + date).length === 13) {
        date = new Date(date);
    }
    var o = {};
    var TS = date.getTime();
    o.j = date.getDate(); // 月份中的第几天，没有前导零   1 到 31
    o.d = leadZero(o.j, 2); // 月份中的第几天，有前导零的 2 位数字   01 到 31
    o.w = date.getDay(); // 星期中的第几天，数字表示   0（表示星期天）到 6（表示星期六）
    o.l = week[o.w - 1]; // 星期几，完整的文本格式   Sunday 到 Saturday
    o.D = o.l.substr(0, 3); // 星期中的第几天，文本表示，3 个字母   Mon 到 Sun
    o.S = sufix[o.j] || sufix[3]; // 每月天数后面的英文后缀，2 个字符   st，nd，rd 或者 th。可以和 j 一起用
    o.N = !o.w ? 7 : o.w; // ISO-8601 格式数字表示的星期中的第几天   1（表示星期一）到 7（表示星期天）
    o.Y = date.getFullYear(); // 4 位数字完整表示的年份   例如：1999 或 2003
    o.y = o.Y.toString().substr(2); // 2 位数字表示的年份   例如：99 或 03
    o.L = +(o.Y % 4 === 0 && o.Y % 100 !== 0) || (o.Y % 100 === 0 && o.Y % 400 === 0); // 是否为闰年   如果是闰年为 1，否则为 0
    o.o = o.Y; // TODO
    o.z = Math.floor((TS - new Date(o.Y)) / 86400000); // 年份中的第几天   0 到 365
    o.n = date.getMonth() + 1; // 数字表示的月份，没有前导零   1 到 12
    o.m = leadZero(o.n, 2); // 数字表示的月份，有前导零   01 到 12
    o.F = month[o.n - 1]; // 月份，完整的文本格式，例如 January 或者 March   January 到 December
    o.M = o.F.substr(0, 3); // 三个字母缩写表示的月份   Jan 到 Dec
    o.t = (new Date(o.Y, o.n) - new Date(o.Y, o.n - 1)) / 86400000;
    o.G = date.getHours(); // 小时，24 小时格式，没有前导零   0 到 23
    o.g = o.G % 12 + 1; // 小时，12 小时格式，没有前导零   1 到 12
    o.a = o.G < 12 ? 'am' : 'pm'; // 小写的上午和下午值   am 或 pm
    o.A = o.a.toUpperCase(); // 大写的上午和下午值   AM 或 PM
    o.H = leadZero(o.G, 2); // 小时，24 小时格式，有前导零   00 到 23
    o.h = leadZero(o.g, 2); // 小时，12 小时格式，有前导零   01 到 12
    o.c = date.getMinutes(); // 没有前导零的分钟数   0 到 59
    o.i = leadZero(o.c, 2); // 有前导零的分钟数   00 到 59
    o.k = date.getSeconds(); // 秒数，没有前导零   0 到 59
    o.s = leadZero(o.k, 2); // 秒数，有前导零   00 到 59
    o.u = date.getMilliseconds(); // 毫秒 三位  示例: 654
    o.Z = date.getTimezoneOffset() * -100; // 时差偏移量的秒数。UTC 西边的时区偏移量总是负的，UTC 东边的时区偏移量总是正的。   -43200 到 43200
    o.O = (o.Z < 0 ? '-' : '+') + leadZero(o.Z / 6000, 2) + '00'; // 与格林威治时间相差的小时数   例如：+0200
    o.P = (o.Z < 0 ? '-' : '+') + leadZero(o.Z / 6000, 2) + ':00'; // 与格林威治时间（GMT）的差别，小时和分钟之间有冒号分隔  例如：+02:00
    o.I = +(new Date(o.Y, 0, 1).getTimezoneOffset() !== new Date(o.Y, 6, 1).getTimezoneOffset()); // 是否为夏令时   如果是夏令时为 1，否则为 0
    o.U = +date.getTime().toString().substr(0, 10); // 从 Unix 纪元（January 1 1970 00:00:00 GMT）开始至今的秒数

    return o;
}

function format(date, formatString) {
    var o = parse(date);
    for (var s in o) {
        if (o.hasOwnProperty(s) && formatString.indexOf(s)) {
            formatString = formatString.replace(new RegExp(s, 'g'), o[s]);
        }
    }
    return formatString;
}

/**
 * @param {Number} Y 年
 * @param {Number} M 月
 * @param {Number} D 日
 * @param {Number} H 时
 * @param {Number} I 分
 * @param {Number} S 秒
 * @param {Number} V 毫秒
 */
function make(Y, M, D, H, I, S, V) {
    Y = Y || 0, M = M || 1, D = D || 0, H = H || 0, I = I || 0, S = S || 0, V = V || 0;
    V > 1000 && ( V = 0);
    var DH = new Date(0);
    DH.setFullYear(Y), DH.setMonth(M - 1), DH.setDate(D), DH.setHours(H), DH.setMinutes(I), DH.setSeconds(S), DH.setMilliseconds(V);
    return DH;
}

module.exports = {
    format: format,
    parse: parse,
    make: make
};