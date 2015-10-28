/**
 * 在指定位置写入dom对象
 * 注意,使用此方法进行写入时,使用的是appendChild方法,所以不会存在两份dom元素
 * @id STK.core.dom.insertElement
 * @alias STK.core.dom.insertElement
 * @param {Element} node
 * @param {Element} element 需要写入的节点
 * @param {String} where beforebegin/afterbegin/beforeend/afterend
 * @author FlashSoft | fangchao@staff.sina.com.cn
 * @example
 * STK.core.dom.insertElement($.E('test'),document.createElement('input'),'beforebegin');
 * STK.core.dom.insertElement($.E('test'),document.createElement('input'),'afterbegin');
 * STK.core.dom.insertElement($.E('test'),document.createElement('input'),'beforeend');
 * STK.core.dom.insertElement($.E('test'),document.createElement('input'),'afterend');
 */
(function(global, __PN__, factory) {
    /* CommonJS */
    if ( typeof require === 'function' && typeof module === 'object' && module && typeof exports === 'object' && exports)
        module['exports'] = factory();
    /* AMD */
    else if ( typeof define === 'function' && define['amd'])
        define(function() {
            return factory();
        });
    /* Global */
    else if (global.__NS__ && (typeof global[global.__NS__] === 'object' || typeof global[global.__NS__] === 'function') && global[global.__NS__])
        global[global.__NS__][__PN__] = global[global.__NS__][__PN__] || factory();
    else
        global[__PN__] = global[__PN__] || factory();

})( window ? window : this, 'insertElement', function() {

    return function(node, element, where) {

        node = ( typeof node === 'string' ? document.getElementById(node) : node) || document.body;
        where = where ? where.toLowerCase() : "beforeend";

        switch (where) {
            case "beforebegin":
                node.parentNode.insertBefore(element, node);
                break;
            case "afterbegin":
                node.insertBefore(element, node.firstChild);
                break;
            case "beforeend":
                node.appendChild(element);
                break;
            case "afterend":
                if (node.nextSibling) {
                    node.parentNode.insertBefore(element, node.nextSibling);
                }
                else {
                    node.parentNode.appendChild(element);
                }
                break;
        }
    };
});
