/**
 * 邻居节点的获取
 * 从参考节点开始向父子前后查找节点;参考节点变化为每次查找的第一个节点；支持连写;使用finish方法获取当前结果节点同时销毁；找不到满足条件的节点时参考节点不跟进；
 * @id STK.core.dom.neighbor
 * @param {Element} el 参考节点
 * @return {object} 
 * @author Finrila|wangzheng4@staff.sina.com.cn
 * @example 
 * STK.core.dom.neighbor(forwardNode)
 *     .parent('[action-type="feed_list_item"]')
 *     .child('[node-type="feed_list_forwardContent"]')
 *     .finish();
 */

$Import('core.dom.dir');
$Import('core.dom.firstChild');
$Import('core.dom.lastChild');
$Import('core.dom.sizzle');

STK.register('core.dom.neighbor', function($) {
	
	var dirExpr = function(el, dir, expr) {
		return el && $.core.dom.dir(el, {
			dir: dir,
			expr: expr
		})[0];
	};
	
	/*
	 * 警告
	 */
	function warning( type, data ) {
		$.log( 'warning', type, data );
	}
	
	var neighbor = function(el) {
		var current = el;
		
		var that = {
			/**
			 * 得到当前节点
			 * @method getCurrent
			 * @return {Element} current
			 */
			getCurrent: function() {
				return current;
			},
			/**
			 * 得到当前节点
			 * @method setCurrent
			 * @return {Element} current
			 */
			setCurrent: function(el) {
				if(el) {
					current = el;
				}
				return that;
			},
			/**
			 * 得到当前节点 并销毁
			 * @method getCurrent
			 * @return {Element} current
			 */
			finish: function() {
				var el = current;
				current = null;
				return el;
			},
			/**
			 * 得到满足条件前面的父节点
			 * @method parent
			 * @param {String} expr 条件 
			 * @return {Element} parent 满足条件的第一个节点
			 */
			parent: function( expr ) {
				var parentNode = dirExpr( current, 'parent', expr );
				if ( parentNode ) {
					current = parentNode;
				} else {
					warning( 'parent', expr );
				}
				return that;
			},
			/**
			 * 得到满足条件前面的子节点
			 * @method child
			 * @param {String} expr 条件 
			 * @return {Element} child 满足条件的第一个节点
			 */
			child: function(expr) {
				var childNode = (expr ? $.core.dom.sizzle(expr, current)[0] : $.core.dom.firstChild(current));
				if ( childNode ) {
					current = childNode;
				} else {
					warning( 'child', expr );
				}
				return that;
			},
			/**
			 * 得到满足条件前面的第一个子节点
			 * @method firstChild
			 * @return {Element} firstChild 满足条件的第一个节点
			 */
			firstChild: function() {
				var firstChildNode = $.core.dom.firstChild(current);
				if ( firstChildNode ) {
					current = firstChildNode;
				} else {
					warning( 'firstChild' );
				}
				return that;
			},
			/**
			 * 得到满足条件前面的最后一个子节点
			 * @method lastChild
			 * @return {Element} lastChild 满足条件的第一个节点
			 */
			lastChild: function() {
				var lastChildNode = $.core.dom.lastChild(current);
				if ( lastChildNode ) {
					current = lastChildNode;
				} else {
					warning( 'lastChild' );
				}
				return that;
			},
			/**
			 * 得到满足条件前面的兄弟节点
			 * @method prev
			 * @param {String} expr 条件 
			 * @return {Element} prev 满足条件的第一个节点
			 */
			prev: function( expr ) {
				var prevNode = dirExpr(current, 'prev', expr);
				if ( prevNode ) {
					current = prevNode;
				} else {
					warning( 'prev', expr );
				}
				return that;
			},
			/**
			 * 得到满足条件后面的兄弟节点
			 * @method next
			 * @param {String} expr 条件 
			 * @return {Element} next 满足条件的第一个节点
			 */
			next: function(expr) {
				var nextNode = dirExpr(current, 'next', expr);
				if ( nextNode ) {
					current = nextNode;
				} else {
					warning( 'next', expr );
				}
				return that;
			},
			/**
			 * 销毁
			 * @method destroy
			 */
			destroy: function() {
				current = null;
			}
		};
		
		return that;
	};
	
	return neighbor;
});
