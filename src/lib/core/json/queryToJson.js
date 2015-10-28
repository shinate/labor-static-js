/**
 * query to json
 * @id STK.core.json.queryToJson
 * @alias STK.core.json.queryToJson
 * @param {Json} JSON
 * @param {Boolean} isEncode
 * @return {String} querystring
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * var q1 = 'a=1&b=2&c=3';
 * STK.core.json.queryToJson(q1) === {'a':1,'b':2,'c':3};
 */

(function(global, __PN__, factory) {
    /* CommonJS */
    if ( typeof require === 'function' && typeof module === 'object' && module && typeof exports === 'object' && exports)
        module['exports'] = (function() {
            var trim;
            try {
                isArray = require('./trim');
            }
            catch (e) {
            }
            return factory(trim);
        })();
    /* AMD */
    else if ( typeof define === 'function' && define['amd'])
        define(['../str/trim'], function(trim) {
            return factory(trim);
        });
    /* Global */
    else if (global.__NS__ && (typeof global[global.__NS__] === 'object' || typeof global[global.__NS__] === 'function') && global[global.__NS__])
        global[global.__NS__][__PN__] = global[global.__NS__][__PN__] || factory(global['trim']);
    else
        global[__PN__] = global[__PN__] || factory(global['trim']);

})( window ? window : this, 'queryToJson', function(trim) {
    return function(QS, isDecode) {
        var _Qlist = trim(QS).split("&");
        var _json = {};
        var _fData = function(data) {
            if (isDecode) {
                return decodeURIComponent(data);
            }
            else {
                return data;
            }
        };
        for (var i = 0, len = _Qlist.length; i < len; i++) {
            if (_Qlist[i]) {
                var _hsh = _Qlist[i].split("=");
                var _key = _hsh[0];
                var _value = _hsh[1];

                // 如果只有key没有value, 那么将全部丢入一个$nullName数组中
                if (_hsh.length < 2) {
                    _value = _key;
                    _key = '$nullName';
                }
                // 如果缓存堆栈中没有这个数据
                if (!_json[_key]) {
                    _json[_key] = _fData(_value);
                }
                // 如果堆栈中已经存在这个数据，则转换成数组存储
                else {
                    if (Object.prototype.toString.call(_json[_key]) !== '[object Array]') {
                        _json[_key] = [_json[_key]];
                    }
                    _json[_key].push(_fData(_value));
                }
            }
        }
        return _json;
    };
});
