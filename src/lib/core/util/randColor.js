var F = 0, T = 255;

var int2hex = function (num) {
    return (num < 16 ? '0' : '') + num.toString(16);
};

var randomCode = function () {
    return Math.floor((Math.random() * 1000 % (T - F)) + F);
};

module.exports = function (from, to) {
    F = from == null ? F : from;
    T = to == null ? T : to;

    return '#' + [int2hex(randomCode()), int2hex(randomCode()), int2hex(randomCode())].join('');
};
