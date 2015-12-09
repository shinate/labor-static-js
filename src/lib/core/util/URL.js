/**
 * Describe 对url进行解析变化
 * @id URL
 * @alias
 * @param {String} url
 * @param {Object}
    {
        'isEncodeQuery'	 : {Boolean}, //对query编码
        'isEncodeHash'	 : {Boolean}  //对hash编码
    }
 * @return {Object}
 {
     setParam	: {Function}
     getParam	: {Function}
     setParams	: {Function}
     setHash		: {Function}
     getHash		: {Function}
     toString	: {Function}
 }
 * @author FlashSoft | fangchao@staff.sina.com.cn
 * @example
 *    alert(
 *        URL('http://abc.com/a/b/c.php?a=1&b=2#a=1').
 *        setParam('a', 'abc').
 *        setHash('a', 67889).
 *        setHash('a1', 444444).toString()
 *    );
 */

var parseParam = require('../obj/parseParam');
var parseURL = require('../str/parseURL');
var queryToJson = require('../json/queryToJson');
var jsonToQuery = require('../json/jsonToQuery');

module.exports = function (sURL, args) {
    var opts = parseParam({
        'isEncodeQuery': false,
        'isEncodeHash': false
    }, args || {});
    var that = {};
    var url_json = parseURL(sURL);


    var query_json = queryToJson(url_json.query);

    var hash_json = queryToJson(url_json.hash);

    /**
     * Describe 设置query值
     * @method setParam
     * @param {String} sKey
     * @param {String} sValue
     * @example
     */
    that.setParam = function (sKey, sValue) {
        query_json[sKey] = sValue;
        return this;
    };
    /**
     * Describe 取得query值
     * @method getParam
     * @param {String} sKey
     * @example
     */
    that.getParam = function (sKey) {
        return query_json[sKey];
    };
    /**
     * Describe 设置query值(批量)
     * @method setParams
     * @param {Json} oJson
     * @example
     */
    that.setParams = function (oJson) {
        for (var key in oJson) {
            that.setParam(key, oJson[key]);
        }
        return this;
    };
    /**
     * Describe 设置hash值
     * @method setHash
     * @param {String} sKey
     * @param {String} sValue
     * @example
     */
    that.setHash = function (sKey, sValue) {
        hash_json[sKey] = sValue;
        return this;
    };
    /**
     * Describe 设置hash值
     * @method getHash
     * @param {String} sKey
     * @example
     */
    that.getHash = function (sKey) {
        return hash_json[sKey];
    };
    /**
     * Describe 取得URL字符串
     * @method toString
     * @example
     */
    that.valueOf = that.toString = function () {
        var url = [];
        var query = jsonToQuery(query_json, opts.isEncodeQuery);
        var hash = jsonToQuery(hash_json, opts.isEncodeQuery);
        if (url_json.scheme != '') {
            url.push(url_json.scheme + ':');
            url.push(url_json.slash);
        }
        if (url_json.host != '') {
            url.push(url_json.host);
            if (url_json.port != '') {
                url.push(':');
                url.push(url_json.port);
            }
        }
        url.push('/');
        url.push(url_json.path);
        if (query != '') {
            url.push('?' + query);
        }
        if (hash != '') {
            url.push('#' + hash);
        }
        return url.join('');
    };

    return that;
};
