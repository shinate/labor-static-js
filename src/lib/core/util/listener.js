/**
 * Global
 */
var extend = require('../obj/extend');

module.exports = function (handle, opts) {

    var opts = extend({}, {
        timer: -1
    }, opts || {});

    var dispatchList = handle != null && '[object Object]' === Object.prototype.toString.call(handle) ? handle : global['__CHANNEL__'] != null ? global['__CHANNEL__'] : (global['__CHANNEL__'] = {});

    var fireTaskList = [];

    var fireTaskTimer;

    var runFireTaskList = function () {
        if (fireTaskList.length == 0) {
            return;
        }

        fireTaskTimer && clearTimeout(fireTaskTimer);

        var curFireTask = fireTaskList.splice(0, 1)[0];
        try {
            curFireTask['func'].apply(curFireTask, [].concat(curFireTask['data']));
        }
        catch (exp) {
        }

        if (opts.timer > -1) {
            fireTaskTimer = setTimeout(runFireTaskList, opts.timer);
        }
        else {
            runFireTaskList();
        }
    };

    var it = {
        'register': function (channelName, eventType, callBack) {
            if (!dispatchList.hasOwnProperty(channelName)) {
                dispatchList[channelName] = {};
            }
            if (!dispatchList[channelName].hasOwnProperty(eventType)) {
                dispatchList[channelName][eventType] = [];
            }
            dispatchList[channelName][eventType].push(callBack);
        },
        'fire': function (channelName, eventType, data) {
            if (dispatchList[channelName] && dispatchList[channelName][eventType] && dispatchList[channelName][eventType].length) {
                var fList = dispatchList[channelName][eventType];
                fList.cache = data;
                for (var i = 0, len = fList.length; i < len; i++) {
                    fireTaskList.push({
                        'channel': channelName,
                        'evt': eventType,
                        'func': fList[i],
                        'data': data
                    });
                }
                runFireTaskList();
            }
        },
        'remove': function (channelName, eventType, callBack) {
            if (dispatchList[channelName]) {
                if (dispatchList[channelName][eventType]) {
                    for (var i = 0, len = dispatchList[channelName][eventType].length; i < len; i++) {
                        if (dispatchList[channelName][eventType][i] === fCallBack) {
                            dispatchList[channelName][eventType].splice(i, 1);
                            break;
                        }
                    }
                }
            }
        },
        'list': function () {
            return dispatchList;
        },
        'cache': function (channelName, eventType) {
            if (dispatchList[channelName] && dispatchList[channelName][eventType]) {
                return dispatchList[channelName][eventType].cache;
            }
        },
        'bind': function (listen, fire, append) {
            if (!(
                    listen != null
                    && Object.prototype.toString.call(listen) === '[object Array]'
                    && listen.length === 2
                    && fire != null
                    && Object.prototype.toString.call(fire) === '[object Array]'
                    && fire.length === 2
                )) {
                throw new Error('Parameter error, must be Array(2), Array(2)');
            }

            if (dispatchList[fire[0]] && dispatchList[fire[0]][fire[1]]) {
                it.register(listen[0], listen[1], function () {
                    it.fire(fire[0], fire[1], [].concat(Array.prototype.slice.call(arguments), append || []));
                });
            }
        }
    };
    return it;
};
