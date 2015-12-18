/**
 * 浏览器事件支持检测
 *
 * @param {string} evtName [必选] 需要检测的事件类型
 * @param {string} tagName [必选] HTML tagName
 * @return {boolean} 是否存在该事件
 * @author shinate | shine.wangrs@gmail.com
 * @example
 * console.log(hasEvent('click', 'div'));
 */

//用于缓存已经查询过的节点事件
var resCache = {};

module.exports = function (evtName, tagName) {
    if (typeof tagName !== 'string') {
        throw new Error('tagName is not a String!');
    }
    tagName = tagName.toLowerCase();
    evtName = 'on' + evtName;
    if (resCache[tagName] && resCache[tagName][evtName] !== undefined) {
        return resCache[tagName][evtName];
    }
    var el = document.createElement(tagName),
    // 检测元素是否已经包含了对应的事件
        isSupported = ( evtName in el);

    // 如果没有对应事件，则尝试增加对应事件，然后判断是否为回调
    if (!isSupported) {
        el.setAttribute(evtName, 'return;');
        isSupported = typeof el[evtName] === 'function';
    }
    //缓存结果
    resCache[tagName] || (resCache[tagName] = {});
    resCache[tagName][evtName] = isSupported;

    el = null;
    return isSupported;
};
