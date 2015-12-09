/**
 * Make an ajax request
 * @id ajax
 * @alias ajax
 * @param {Object}    {
		'url': '',
		'charset': 'UTF-8',
		'timeout': 30 * 1000,
		'args': {},
		'onComplete': null,
		'onTimeout': null,
		'onFail': null,
		'method': 'get', // post or get
		'asynchronous': true,
		'contentType': 'application/x-www-form-urlencoded',
		'responseType': 'text'// xml or text or json
	};
 * @return {Void}
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * ajax({
	'url':'/ajax.php',
	'args':{'id':123,'test':'true'},
	});
 */
var getXHR = require('./getXHR');
var parseParam = require('../obj/parseParam');
var URL = require('../util/URL');
var jsonToQuery = require('../json/jsonToQuery');
var emptyFunc = require('../func/empty');
var stringToJson = require('../json/stringToJson');

module.exports = function (opts) {
    var opts = parseParam({
        'url': '',
        'charset': 'UTF-8',
        'timeout': 30 * 1000,
        'args': {},
        'onComplete': null,
        'onTimeout': emptyFunc,
        'uniqueID': null,
        'onFail': emptyFunc,
        'method': 'get', // post or get
        'asynchronous': true,
        'header': {},
        'isEncode': false,
        'responseType': 'json', // xml or text or json
        'nocache': false
    }, opts);

    if (opts.url == '') {
        throw new Error('Ajax need url in parameters object');
    }

    var tm;

    var trans = getXHR();

    var cback = function () {
        if (trans.readyState == 4) {
            clearTimeout(tm);
            var data = '';
            if (opts['responseType'] === 'xml') {
                data = trans.responseXML;
            } else if (opts['responseType'] === 'text') {
                data = trans.responseText;
            } else {
                try {
                    if (trans.responseText && typeof trans.responseText === 'string') {

                        data = stringToJson(trans.responseText);
                    } else {
                        data = {};
                    }
                } catch (exp) {
                    data = opts['url'] + 'return error : data error';
                }

            }
            if (trans.status == 200) {
                if (opts['onComplete'] != null) {
                    opts['onComplete'](data);
                }
            } else if (trans.status == 0) {
                //for abort;
            } else {
                if (opts['onFail'] != null) {
                    opts['onFail'](data, trans);
                }
            }
        }
        else {
            if (opts['onTraning'] != null) {
                opts['onTraning'](trans);
            }
        }
    };
    trans.onreadystatechange = cback;

    if (!opts['header']['Content-Type']) {
        opts['header']['Content-Type'] = 'application/x-www-form-urlencoded';
    }
    if (!opts['header']['X-Requested-With']) {
        opts['header']['X-Requested-With'] = 'XMLHttpRequest';
    }

    if (opts['method'].toLocaleLowerCase() == 'get') {
        var url = URL(opts['url'], {
            'isEncodeQuery': opts['isEncode']
        });
        url.setParams(opts['args']);
        opts.nocache && url.setParam('__rnd', new Date().valueOf());
        trans.open(opts['method'], url.toString(), opts['asynchronous']);
        try {
            for (var k in opts['header']) {
                trans.setRequestHeader(k, opts['header'][k]);
            }
        } catch (exp) {

        }
        trans.send('');

    }
    else {
        trans.open(opts['method'], opts['url'], opts['asynchronous']);
        try {
            for (var k in opts['header']) {
                trans.setRequestHeader(k, opts['header'][k]);
            }
        } catch (exp) {

        }
        trans.send(jsonToQuery(opts['args'], opts['isEncode']));
    }
    if (opts['timeout']) {
        tm = setTimeout(function () {
            try {
                trans.abort();
                opts['onTimeout']({}, trans);
                opts['onFail']({}, trans);
            } catch (exp) {

            }
        }, opts['timeout']);
    }
    return trans;
};
