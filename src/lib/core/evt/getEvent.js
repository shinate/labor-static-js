/**
 * Get event object
 *
 * @return {Event} e
 * @author shinate | shine.wangrs@gmail.com
 * @example
 * var ev = getEvent();
 */
module.exports = (function () {
    if (document.addEventListener) {
        return function () {
            var o = arguments.callee;
            var e;
            do {
                e = o.arguments[0];
                if (e && /Event/.test(Object.prototype.toString.call(e))) {
                    return e;
                }
            } while (o = o.caller);
            return e;
        };
    } else {
        return function () {
            return window.event;
        };
    }
}());
