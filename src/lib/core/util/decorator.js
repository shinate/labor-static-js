/**
 * Global
 */
var hasProp = require('../obj/hasProp');

module.exports = function (handle) {

    var it = {};

    it.original = handle;

    it.set = function (path, value) {

        if (path == null) {
            return false;
        }

        path = path.split('.');
        var _P = handle;
        var _Path = [];

        if (path.length > 1) {
            for (var i = 0, len = path.length; i < len - 1; i++) {
                _Path.push(path[i]);
                if (_P[path[i]] == null) {
                    _P[path[i]] = {};
                } else if (typeof _P[path[i]] !== 'object') {
                    console.log('"' + _Path.join('.') + '" is not a container, value is: ' + _P[path[i]]);
                    return;
                }
                _P = _P[path[i]];
            }
        }

        _P[path[path.length - 1]] = value;

        _P = null;
    };

    it.get = function (path) {
        if (path == null) {
            return handle;
        } else {
            path = path.split('.');
            var _P = handle;
            for (var i = 0, len = path.length; i < len; i++) {
                if (hasProp(_P, path[i])) {
                    _P = _P[path[i]];
                } else {
                    return null;
                }
            }

            return _P;
        }
    };

    it.reset = function (path) {
        it.set(path, {});
    };

    it.del = function (path) {
        delete it.get(path);
    };

    return it;
};
