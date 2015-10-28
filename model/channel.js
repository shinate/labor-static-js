var $listener = require('/lib/core/util/listener');

var $listenerList = (function() {
	if (!window.hasOwnProperty('__CODATA__')) {
		window.__CODATA__ = {};
	};
	if (!window.__CODATA__.hasOwnProperty('channel')) {
		window.__CODATA__.channel = {};
	}
	return window.__CODATA__.channel;
})();

/**
 * 创建广播白名单
 * @param {String} sChannel
 * @param {Array} aEventList
 */
module.exports = {
	'define' : function(sChannel, aEventList) {
		if ($listenerList[sChannel] != null) {
			throw 'common.listener.define: 频道已被占用';
		}
		$listenerList[sChannel] = aEventList;

		var ret = {};
		ret.register = function(sEventType, fCallBack) {
			if ($listenerList[sChannel] == null) {
				throw 'common.listener.define: 频道未定义';
			}
			$listener.register(sChannel, sEventType, fCallBack);
		};
		ret.fire = function(sEventType, oData) {
			if ($listenerList[sChannel] == null) {
				throw 'commonlistener.define: 频道未定义';
			}
			$listener.fire(sChannel, sEventType, oData);
		};
		ret.remove = function(sEventType, fCallBack) {
			$listener.remove(sChannel, sEventType, fCallBack);
		};

		/**
		 * 使用者可以在任意时刻获取到listener缓存的(某频道+事件)最后一次触发(fire)的数据；如果没有fire过为undefined;
		 * @method cache
		 * @param {String} sEventType
		 */
		ret.cache = function(sEventType) {
			return $listener.cache(sChannel, sEventType);
		};
		return ret;
	}
};
