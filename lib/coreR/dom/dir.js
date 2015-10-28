/**
 * sizzle查找某节点相关的节点列表
 * @id STK.core.dom.dir
 * @param {Element} el 参考节点 必选
 * @param {object} spec 可选
 * {
 *  dir //与参考节点关系 parent/next/prev
 * 	expr //节点筛选条件 同sizzle的条件
 *  endpoint //终极节点 默认为document
 *  matchAll: false//匹配el到终极节点之前所有复合条件的节点 默认为false
 * }
 * @return {Array} 节点列表
 * @author Finrila|wangzheng4@staff.sina.com.cn
 * @example 
 * STK.core.dom.dir(forwardNode, { 
 * 	dir : 'parent',//与参考节点关系 
 * 	expr : '[action-type=feed_list_item]',//节点筛选条件 同sizzle的条件 
 * 	endpoint : feedListNode,//终极节点或者检索范围 
 * 	matchAll : false//是否匹配forwardNode到终极节点feedListNode之前所有复合条件的节点 默认为false 
 * });
 */
$Import('core.obj.parseParam');
$Import('core.dom.sizzle');

STK.register('core.dom.dir', function($) {
	
	var dirType = {
		'parent': 'parentNode',
		'next': 'nextSibling',
		'prev': 'previousSibling'
	};
	
	var dir = function(el, spec) {
		spec = $.core.obj.parseParam({
			dir: 'parent',//与参考节点关系
			expr: undefined,//条件
			endpoint: document,//终极节点
			matchAll: false//匹配el到终极节点之前所有复合条件的节点 默认为false
		}, spec);
		var dir = dirType[spec.dir],
			expr = spec.expr,
			endpoint = spec.endpoint,
			matchAll = !!spec.matchAll;
		if (!el) {
			throw 'core.dom.dir: el is undefined.';
		}
		if (!dir) {
			throw 'core.dom.dir: spec.dir is undefined.';
		}
		var matches = [],
			cur = el[dir];
		while (cur) {
			if (cur.nodeType == 1) {
				if (!expr || $.core.dom.sizzle.matches(expr, [cur]).length > 0) {
					matches.push(cur);
					if (!matchAll) {
						break;
					}
				}
			}
			if (cur == endpoint) {
				break;	
			}
			cur = cur[dir];
		}
		return matches;
	};
	
	/**
	 * 查找满足条件的父节点
	 * @method parent
	 * @static
	 * @param {Element} el 参考节点  必选
	 * @param {Object} spec 可选
	 * {
	 * 	expr //节点筛选条件 同sizzle的条件
	 *  endpoint //终极节点 默认为document
	 *  matchAll: false//匹配el到终极节点之前所有复合条件的节点 默认为false
	 * }
	 * @return {Array} 节点列表
	 * @example 
	 * STK.core.dom.dir.parent(STK.E('test'), {
	 * 	expr: 'div',
	 * 	matchAll: true
	 * });
	 */
	dir.parent = function(el, spec) {
		spec = spec || {};
		spec.dir = 'parent';
		return dir(el, spec);
	};
	
	/**
	 * 查找满足条件的向前的兄弟节点
	 * @method prev
	 * @static
	 * @param {Element} el 参考节点 必选
	 * @param {Object} spec 可选
	 * {
	 * 	expr //节点筛选条件 同sizzle的条件
	 *  endpoint //终极节点 默认为document
	 *  matchAll: false//匹配el到终极节点之前所有复合条件的节点 默认为false
	 * }
	 * @return {Array} 节点列表
	 * @example 
	 * STK.core.dom.dir.prev(STK.E('test'), {
	 * 	expr: '[node-type="test"]',
	 * 	matchAll: true
	 * });
	 */
	dir.prev = function(el, spec) {
		spec = spec || {};
		spec.dir = 'prev';
		return dir(el, spec);
	};
	
	/**
	 * 查找满足条件的向后的兄弟节点
	 * @method next
	 * @static
	 * @param {Element} el 参考节点 必选
	 * @param {Object} spec 可选
	 * {
	 * 	expr //节点筛选条件 同sizzle的条件 
	 *  endpoint //终极节点 默认为document
	 *  matchAll: false//匹配el到终极节点之前所有复合条件的节点 默认为false
	 * }
	 * @return {Array} 节点列表
	 * @example 
	 * STK.core.dom.dir.next(STK.E('test'), {
	 * 	expr: '[node-type="test"]',
	 * 	matchAll: true
	 * });
	 */
	dir.next = function(el, spec) {
		spec = spec || {};
		spec.dir = 'next';
		return dir(el, spec);
	};
	
	return dir;
});