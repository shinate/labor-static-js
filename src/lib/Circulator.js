/**
 * Circulator
 *
 * @file circulator.js
 * @author shine.wangrs@gmail.com
 *
 * Animation looper
 */

function now() {
    return window.performance.now ? window.performance.now() : Date.now();
};

module.exports = function (func, context) {

    /**
     * last time, only for setTimeout case
     */
    var __LAST_TIME = 0;

    /**
     * current time, only for setTimeout case
     */
    var __CURRENT_TIME;

    /**
     * request id, increment number
     */
    var REQUEST_ID;

    /**
     * total time
     */
    var TOTAL_TIME = 0;

    /**
     * interval between two frames
     */
    var INTERVAL_TIME = 0;

    /**
     * frame start time
     */
    var START_TIME = 0;

    /**
     * frame end time
     */
    var LAST_TIME = 0;

    /**
     * the loop callback function
     */
    var LOOP_FUNC = func || null;

    /**
     * context
     */
    var CONTEXT = context || null;

    /**
     * Fix requestAnimationFrame
     */
    var request = (function () {
        // ;off
        return 0
            || window.requestAnimationFrame
            || window.webkitRequestAnimationFrame
            || window.mozRequestAnimationFrame
            || window.oRequestAnimationFrame
            || window.msRequestAnimationFrame
                // if all else fails, use setTimeout
            || function (cb) {
                __CURRENT_TIME = now();
                // shoot for 60 FPS
                var s = Math.max(0, 16.7 - (__CURRENT_TIME - __LAST_TIME));
                __LAST_TIME = __CURRENT_TIME + s;
                try {
                    return window.setTimeout(cb, s);
                } finally {
                    s = null;
                    // For trash collection
                }
            };
        // ;on
    })();

    /**
     * Fix cancelAnimationFrame
     */
    var clean = (function () {
        // ;off
        return 0
            || window.cancelAnimationFrame
            || window.webkitCancelAnimationFrame
            || window.mozCancelAnimationFrame
            || window.oCancelAnimationFrame
            || window.msCancelAnimationFrame
                // if all else fails, use clearTimeout
            || function (id) {
                id != null && window.clearTimeout(id);
            };
        // ;on
    })();

    /**
     * start animations
     */
    var start = function () {
        if (!isRunning()) {
            START_TIME = now();
            LAST_TIME = START_TIME;
            REQUEST_ID = request(loop);
        }
    };

    /**
     * stop animations
     */
    var stop = function () {
        clean(REQUEST_ID), REQUEST_ID = null;
    };

    /**
     * is running
     */
    var isRunning = function () {
        return REQUEST_ID != null;
    };

    var loop = function () {
        if (LOOP_FUNC != null && LOOP_FUNC.call) {
            LOOP_FUNC.call(CONTEXT);
        }
        var c = now();
        INTERVAL_TIME = c - LAST_TIME;
        TOTAL_TIME += INTERVAL_TIME;
        LAST_TIME = c;

        REQUEST_ID = request(loop);
    };

    /*
     function Circulator() {
     this.time = now;
     this.total = TOTAL_TIME;
     this.timeInterval = INTERVAL_TIME;
     this.startTime = START_TIME;
     this.lastTime = LAST_TIME;
     this.frame = REQUEST_ID;
     this.context = CONTEXT;
     };

     Circulator.prototype.start = start;
     Circulator.prototype.stop = stop;
     */

    return {
        time: now,
        total: TOTAL_TIME,
        timeInterval: INTERVAL_TIME,
        startTime: START_TIME,
        lastTime: LAST_TIME,
        frame: REQUEST_ID,
        context: CONTEXT,
        start: start,
        stop: stop
    };
}
