module.exports = function (o) {
    if (Object.prototype.toString.call(o) !== '[object Object]') {
        throw 'Argument must be an object!';
    }
    if (Object.keys) {
        return Object.keys(o);
    } else {
        var a = [];
        for (var i in o) {
            a.push(i);
        }
        return a;
    }
};
