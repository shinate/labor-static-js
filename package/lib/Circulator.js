/**
 * Circulator
 *
 * @file circulator.js
 * @author shine.wangrs@gmail.com
 *
 * Animation looper
 */

(function(global, __PN__, factory) {
    /* CommonJS */
    if( typeof require === 'function' && typeof module === 'object' && module && typeof exports === 'object' && exports)
        module['exports'] = factory(global);
    /* AMD */
    else if( typeof define === 'function' && define['amd'])
        define(function() {
            return factory(global);
        });
    /* Global */
    else if(global.__NS__ && ( typeof global[global.__NS__] === 'object' || typeof global[global.__NS__] === 'function') && global[global.__NS__])
        global[global.__NS__][__PN__] = global[global.__NS__][__PN__] || factory(global);
    else
        global[__PN__] = global[__PN__] || factory(global);

})( window ? window : this, 'Circulator', function(global) {

    function now() {
        return global.performance.now ? global.performance.now() : Date.now();
    };

    return function(func, context) {

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
        var request = (function() {
            // ;off
            return 0
                || global.requestAnimationFrame
                || global.webkitRequestAnimationFrame
                || global.mozRequestAnimationFrame
                || global.oRequestAnimationFrame
                || global.msRequestAnimationFrame
                // if all else fails, use setTimeout
                || function(cb) {
                    __CURRENT_TIME = now();
                    // shoot for 60 FPS
                    var s = Math.max(0, 16.7 - (__CURRENT_TIME - __LAST_TIME));
                    __LAST_TIME = __CURRENT_TIME + s;
                    try {
                        return global.setTimeout(cb, s);
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
        var clean = (function() {
            // ;off
            return 0
                || global.cancelAnimationFrame
                || global.webkitCancelAnimationFrame
                || global.mozCancelAnimationFrame
                || global.oCancelAnimationFrame
                || global.msCancelAnimationFrame
                // if all else fails, use clearTimeout
                || function(id) {
                    id != null && global.clearTimeout(id);
                };
            // ;on
        })();

        /**
         * start animations
         */
        var start = function() {
            if(!isRunning()) {
                START_TIME = now();
                LAST_TIME = START_TIME;
                REQUEST_ID = request(loop);
            }
        };

        /**
         * stop animations
         */
        var stop = function() {
            clean(REQUEST_ID), REQUEST_ID = null;
        };

        /**
         * is running
         */
        var isRunning = function() {
            return REQUEST_ID != null;
        };

        var loop = function() {
            if(LOOP_FUNC != null && LOOP_FUNC.call) {
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
            time : now,
            total : TOTAL_TIME,
            timeInterval : INTERVAL_TIME,
            startTime : START_TIME,
            lastTime : LAST_TIME,
            frame : REQUEST_ID,
            context : CONTEXT,
            start : start,
            stop : stop
        };
    };
});
