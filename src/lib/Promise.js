/**
 * Promise
 *
 * @file Promise.js
 * @author shine.wangrs@gmail.com
 *
 * Fix Promise for no native function browser
 */
/**
 * Class Promise
 *
 * @param {Function} func dependent function
 * @param {*} context context
 */
var Promise = function (func, context) {
    this.state = 'pending';

    this._resolve = [];
    this._reject = [];

    if (typeof func === 'function') {
        this._func = func;
    }
    if (context != null) {
        this.context = context || global;
    }
};

/**
 * Add callback functions and performs the Promise._func
 *
 * @param {Object} resolve The function is triggered when success
 * @param {Object} reject The function is triggered when failure
 */
Promise.prototype.then = function (resolve, reject) {
    if (typeof resolve === 'function') {
        this._resolve.push(resolve);
    }
    if (typeof reject === 'function') {
        this._reject.push(reject);
    }
    this.exec();
};

/**
 * Perform all the callbacks in the list of Promise._resolve
 */
Promise.prototype.resolve = function () {
    this.state = 'resolved';
    while (this._resolve.length) {
        this._resolve.shift().apply(this, arguments);
    }
};

/**
 * Perform all the callbacks in the list of Promise._reject
 */
Promise.prototype.reject = function () {
    this.state = 'reject';
    while (this._reject.length) {
        this._reject.shift().apply(this, arguments);
    }
};

/**
 * Function bound to perform
 *
 * @param {Object} func
 */
Promise.prototype.always = function (func) {
    if (typeof func === 'function') {
        this._resolve.push(func);
        this._reject.push(func);
    }
    this.exec();
};

/**
 * Execution dependent function (if there is)
 */
Promise.prototype.exec = function () {
    if (typeof this._func === 'function') {
        var that = this;
        this._func.call(this.context, function () {
            that.resolve.apply(that, arguments);
            arguments.callee = null;
        }, function () {
            that.reject.apply(that, arguments);
            arguments.callee = null;
        });
    }
};

Promise.when = function () {

    var p = new Promise();

    var surplus = Array.prototype.slice.call(arguments, 0);

    var remind = surplus.length;

    var done = new Array(remind);

    p._func = function () {
        for (var i = 0, len = surplus.length; i < len; i++) {
            if (!(surplus[i] instanceof Promise)) {
                return false;
            } else {
                (function (index) {
                    surplus[index].always(function () {
                        if (this.state !== 'resolved') {
                            p.reject.apply(p, arguments);
                        } else {
                            done[index] = arguments[0];
                            if (--remind === 0) {
                                p.resolve.call(p, done);
                            }
                        }
                    });
                })(i);
            }
        }
    };

    return p;
};

Promise.all = function (funcs) {
    return Promise.when.apply(null, funcs);
};

module.exports = Promise;
