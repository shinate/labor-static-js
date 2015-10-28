var $ = require('/lib/jQuery');
var tinyConfirm = require('/model/bubble/tinyConfirm');

var check = function(data, opts){

	var options = {
		'must'    : 0
		,'format' : 'string'
	};
	
	opts = $.extend({}, options, opts || {});

	var rule = {
		'string' : function($content){
			return typeof $content === 'string';
		}
	};

	if(opts.must && !data){
		return false;
	}
	
	if(rule.hasOwnProperty(opts.format) && !rule[opts.format](data)){
		return false;
	}
	
	if(opts.hasOwnProperty('len') && !data.length > parseInt(opts.len)){
		return false;
	}
	
	return true;
	
};

module.exports = function(node, opts){
	
	var options = {
		'io'     : ''
	};
	
	var it = {
		'init' : function(){
			it.parseParam();
			it.parseDOM();
			it.bind();
		}
		,'parseParam' : function(){
			opts = $.extend({}, options, opts || {});
		}
		,'parseDOM' : function(){
			
		}
		,'bind' : function(){
			for(var type in it.domEvts){
				node.delegate('[action-type="' + type + '"]', 'click', it.domEvts[type]);
			}
		}
		,'createFormUtil' : function(el){
			var data = el.data();
			var unitEl;
			
			if(!data.hasOwnProperty('value')){
				data.value = el.html() || '';
			}
			
			switch(data.type){
				case 'textbox':
					unitEl = $('<textarea>' + data.value + '</textarea>');
					break;
				case 'checkbox':
					unitEl = $('<input type="checkbox" value="' + data.value + '" />');
					if(data.hasOwnProperty('checked')){
						unitEl.get(0).checked = true;
					}
					break;
				case 'inputbox':
				default:
					unitEl = $('<input type="text" value="' + data.value + '" />');
					break;
			}
			unitEl.data('config', data.config);
			unitEl.attr('name', data.name);
			unitEl.addClass(data.type);
			unitEl.insertAfter(el);
			el.hide();
		}
		,'hasEdited' : function(els){
			var el, rule;
			for(var i=0;i<els.length;i++){
				rule = els.eq(i);
				el = rule.next();
				if(rule.html() !== el.val()){
					return true;
				}
			};
			return false;
		}
		,'getFormData' : function(el){
			var sEl = el.find('[name]')
				,config = {}
				,_cfg
				,data = {}
				,sdata = sEl.serializeArray();
				
			sEl.each(function(){
				cfg = $.Ex.queryToJson($(this).data('config'));
				if(!$.isEmptyObject(cfg)){
					config[$(this).attr('name')] = cfg;
				}
			});
			
			for(var i=0;i<sdata.length;i++){
				if(
					config.hasOwnProperty(sdata[i].name)
					&& !check(sdata[i].value, config[sdata[i].name])
				){
					return false;
				}
				data[sdata[i].name] = sdata[i].value;
			}
			
			return data;
		}
		,'getOP' : function(el){
			return el.attr('action-type');
		}
		,'domEvts' : {
			'save' : function(){
				var el = $(this);
				var dataNewEl = el.parents('[node-type="data-row"]');
				var data = it.getFormData(dataNewEl);
				
				if(!data){
					return;
				}
				
				$.post(
					opts.io + '?op=' + it.getOP(el)
					,$.extend({}, data, el.data())
					,function(ret){
						if(ret.code == '100000'){
							dataNewEl.replaceWith(ret.data.html);
						} else {
							alert(ret.msg);
						}
					}
					,'json'
				);
			}
			,'cancel' : function(){
				var el = $(this);
				var dataRow = el.parents('[node-type="data-row"]');
				var formUnit = dataRow.find('[node-type="form-unit"]');
				
				var cancel = function(){
					formUnit.each(function(){
						$(this).show().next().remove();
					});
					el.hide();
					el.parent().find('[action-type="save"]').hide();
					el.parent().find('[action-type="edit"]').show();
					
					dataRow.removeData('onEdit');
				};
				
				if(it.hasEdited(formUnit)){
					if(confirm('?')){
						cancel();
					}
					return;
				}
				
				cancel();
				
			}
			,'edit' : function(){
				var el = $(this);
				var dataRow = el.parents('[node-type="data-row"]');
				if($.hasData(dataRow, 'onEdit')){
					return;
				}
				var formUnit = dataRow.find('[node-type="form-unit"]');
				
				var _el;
				formUnit.each(function(){
					it.createFormUtil($(this));
				});
				el.hide();
				el.parent().find('[action-type="save"]').show();
				el.parent().find('[action-type="cancel"]').show();
				
				dataRow.data('onEdit', 1);
			}
			,'delete' : function(){
				var el = $(this);
				var dataRow = el.parents('[node-type="data-row"]');
				
				if(el.data('TF') || el.data('onReq')){
					return;
				}
				
				tinyConfirm(el, 'SURESURESURESURESURESURESURESURESURESURESURESURESURE?', {
					'delay' : 3000
					,'onHide' : function(){
						el.removeData('TF');
					}
					,'BTN_1' : function(){
						el.data('onReq', 1);
						$.post(
							opts.io + '?op=' + it.getOP(el)
							,$.extend({}, el.data())
							,function(ret){
								if(ret.code == '100000'){
									dataRow.remove();
								} else {
									alert(ret.msg);
								}
								
								el.removeData('onReq');
							}
							,'json'
						);
					}
					,'BTN_2' : function(){
						el.removeData('TF');
					}
					,'TEXT_1' : 'yes'
					,'TEXT_2' : 'no'
				});
				
				el.data('TF', 1);
			}
			,'multiple' : function(){
				var el = $(this);
				var checkboxes = node.find('table tr').find('td:first-child');
				checkboxes.show();
				
				el.hide();
				el.parent().find('[action-type="add-new"]').hide();
				el.parent().find('[action-type="multiple-cancel"]').show();
				el.parent().find('[action-type="multiple-delete"]').show();
			}
			,'multiple-delete' : function(){
				var el = $(this);
				var chklist = node.find('tbody td:first-child').find(':checked').serializeArray();
				
				if(chklist.length <= 0)
					return false;
					
				var data = {'opid':[]};
				for(var i=0;i<chklist.length;i++){
					data.opid.push(chklist[i].value);
				}
				
				$.post(
					opts.io + '?op=' + it.getOP(el)
					,data
					,function(ret){
						if(ret.code == '100000'){
							window.location.reload();
						} else {
							alert(ret.msg);
						}
					}
					,'json'
				);
			}
			,'multiple-cancel' : function(){
				var el = $(this);
				var checkboxes = node.find('table td:first-child');
				var checkbox = checkboxes.find('input[type="checkbox"]');
				checkbox.each(function(){
					$(this).get(0).checked = false;
				});
				
				checkboxes.hide();
				el.hide();
				el.parent().find('[action-type="multiple-delete"]').hide();
				el.parent().find('[action-type="multiple"]').show();
				el.parent().find('[action-type="add-new"]').show();
			}
			,'select-all' : function(evt){
				var el = $(this);
				var checkbox = node.find('table td:first-child input[type="checkbox"]');
				if(el.get(0).checked == false){
					checkbox.each(function(){
						$(this).get(0).checked = false;
					});
				} else {
					checkbox.each(function(){
						$(this).get(0).checked = true;
					});
				}
			}
			,'add-new' : function(){
				var temp = node.find('tfoot').find('[node-type="data-new"]');
				temp.clone().appendTo(temp.parent()).show();
				node.find('tfoot').find('[node-type="mult-operation"]').hide();
			}
			,'add-cancel' : function(){
				var el = $(this);
				el.parents('[node-type="data-new"]').remove();
				node.find('tfoot').find('[node-type="mult-operation"]').show();
			}
			,'add-save' : function(){
				var el = $(this);
				var dataNewEl = el.parents('[node-type="data-new"]');
				var data = it.getFormData(dataNewEl);
				
				if(!data){
					return;
				}
				
				$.post(
					opts.io + '?op=' + it.getOP(el)
					,$.extend({}, data, el.data())
					,function(ret){
						if(ret.code == '100000'){
							node.find('table').append(ret.data.html);
							dataNewEl.remove();
							node.find('tfoot').find('[node-type="mult-operation"]').show();
						} else {
							alert(ret.msg);
						}
					}
					,'json'
				);
			}
		}
	};
	
	var self = {};
	
	it.init();
	
	return self;
	
};