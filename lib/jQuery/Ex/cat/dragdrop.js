/**
 * Drag & drop controller
 *
 * @author 莳子 | shine.wangrs@gmail.com
 * @create 24 Sept. 2014
 * @lastModify 24 Oct. 2014
 *
 * @depend jQuery
 *
 * @param {jQuery Element} Dom used to bind events
 * @param [{jQuery Element}] Dom to be controlled, If not set, it will control the binding element(the first argument).
 * @param [{Object}] You options
 *
 * @return {Object} controller handle
 */

( function(factory) {

	if ( typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(['jquery'], factory);
	} else if ( typeof exports === 'object') {
		// Node/CommonJS style for Browserify
		module.exports = factory(jQuery);
	} else {
		// Browser globals
		factory(jQuery);
	}

}(function($) {

	var options = {
		'onDrop' : function(){}
	};

	return function() {

		var args = Array.prototype.slice.call(arguments);

		var bind, control, opts;

		var onDrag = false;

		var lsn = {};
		
		var isMoved = false;

		var relativePos, controlPos;

		var it = {
			'init' : function() {
				it.parseParam();
				it.bind();
			},
			'parseParam' : function() {
				switch (args.length) {
				case 1:
					control = bind = args[0];
					opts = $.extend({}, options);
					break;
				case 2:
					bind = args[0];

					if ($.isPlainObject(args[1])) {
						opts = $.extend({}, options, args[1] || '');
					} else {
						control = args[1];
						opts = $.extend({}, options);
					}
					break;
				case 3:
					bind = args[0];
					control = args[1];
					opts = $.extend({}, options, args[2] || '');
					break;
				}
			},
			'bind' : function() {
				bind.bind('mousedown', it.handle.drag);
				bind.bind('mouseup', it.handle.drop);
			},
			'handle' : {
				'drag' : function(spec) {
					bind.unbind('mousemove', it.handle.move);
					lsn.drag = setTimeout(function() {
						spec.preventDefault();
						relativePos = [spec.clientX, spec.clientY];
						var _cp = control.position();
						controlPos = [_cp.left, _cp.top];

						bind.unbind('mousemove', it.handle.move);
						bind.bind('mousemove', it.handle.dragmove);
					}, 0);
				},
				'move' : function() {
					lsn['drag'] && (clearTimeout(lsn.drag), lsn.drag = null);
				},
				'dragmove' : function(spec) {
					spec.preventDefault();
					isMoved = true;
					control.css({
						'left' : spec.clientX - relativePos[0] + controlPos[0],
						'top'  : spec.clientY - relativePos[1] + controlPos[1]
					});
				},
				'drop' : function(spec) {
					spec.preventDefault();
					lsn['drag'] && (clearTimeout(lsn.drag), lsn.drag = null);
					typeof options.onDrop == 'function' && opts.onDrop.call(null, spec);
					bind.unbind('mousemove', it.handle.dragmove);
					bind.bind('mousemove', it.handle.move);
				}
			}
		};

		var self = {};

		it.init();

		return self;
	};

})); 