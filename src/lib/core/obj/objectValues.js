module.exports = function (o) {
    if ('[object Object]' !== Object.prototype.toString.call(o)) {
        throw 'Argument must be an object!';
    }
    var a = [];
    for (var i in o) {
        a.push(o[i]);
    }
    return a;
};
