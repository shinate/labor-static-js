/**
 * 自动把HTML分析成Dom节点,并返回相应的文档碎片跟带级联的节点列表
 * 不传入规则自动分析node-type属性,传入规则按照传入规则进行分析
 * @id STK.core.dom.builder
 * @alias STK.core.dom.builder
 * @param {String|Node} sHTML 需要被处理的HTML字符串 或者节点引用
 * @param {Object | Null} 参数
 * {
 * // dom对象, 选择器
 * 'input1': 'input[node-type=input1],textarea[node-type=input1]'
 * }
 * @return {Object} 文档碎片跟节点列表
 * {
 * 	'box': 文档碎片
 * 	'list': 节点列表,带级联
 * }
 * @author FlashSoft | fangchao@staff.sina.com.cn
 * @example
 * var sHTML = '' +
 * '<div node-type=div1>' +
 * '<input />' +
 * '<input />' +
 * '<input />' +
 * '<input />' +
 * '<input />' +
 * '<input />' +
 * '<input node-type="feed_item444444" />' +
 * '<input node-type="feed_item" />' +
 * '<textarea style="font-family: Tahoma,宋体;" range="1400" name="status" node-type="poster"></textarea>' +
 * '<ul>' +
 * '<li class="MIB_linedot_l" node-type ="feed_item" dynamic-id="2777763617"></li>' +
 * '<li class="MIB_linedot_l" node-type= "feed_ite43m" dynamic-id="2777763617"></li>' +
 * '<li class="MIB_linedot_l" node-type=              "feed_1item" dynamic-id="2777763617"></li>' +
 * '<li class="MIB_linedot_l" node-type="feed_it2em" dynamic-id="2777763617"></li>' +
 * '<li class="MIB_linedot_l" node-type="feed_item" dynamic-id="2777763617"></li>' +
 * '<li class="MIB_linedot_l" anode-type="1111111111111111111" dynamic-id="2777763617"></li>' +
 * '</ul>' +
 * '</div>' +
 * '<input node-type="input13" />' +
 * '<h1 node-type="h1111" />asdfasdf</h1>';
 * var bd = $.core.dom.builder(sHTML);
 */
$Import('core.dom.sizzle');

STK.register('core.dom.builder', function($){
	return function(sHTML, oSelector){
		
		var isHTML = ((typeof sHTML) === "string");
		// 自动配置
		// var selectorList = autoDeploy( _isHTML ? sHTML : sHTML.innerHTML, oSelector);
		
		// 写入HTML
		var container = sHTML;
		
		if(isHTML) {
			container = $.C('div');
			container.innerHTML = sHTML;
		}
		
		// 通过选择器产生domList
		// 默认产生的是数组,所以需要转化下
		
		// modify by Robin Young 
		// 用core.dom.sizzle.matches来提高性能.
		var domList, totalList;
		domList = {};
		
		if(oSelector){
			for(key in selectorList){
				domList[key] = $.core.dom.sizzle(oSelector[key].toString(), container);
			}
		}else{
			totalList = $.core.dom.sizzle('[node-type]', container);
			for(var i = 0, len = totalList.length; i < len; i += 1){
				var key = totalList[i].getAttribute('node-type');
				if(!domList[key]){
					domList[key] = [];
				}
				domList[key].push(totalList[i]);
			}
		}
		//end modify
		
		
		// 把结果放入到文档碎片中
		var domBox = sHTML;
		
		if (isHTML) {
			domBox = $.C('buffer');
			while (container.childNodes[0]) {
				domBox.appendChild(container.childNodes[0]);
			}
		}
		
		// 返回文档碎片跟节点列表
		return {
			'box': domBox,
			'list': domList
		};
	};
});
