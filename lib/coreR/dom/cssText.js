/**
 * 样式缓存及合并
 * @id STK.core.dom.cssText
 * @param {String} oldCss 旧的cssText
 * @author Finrila|wangzheng4@staff.sina.com.cn
 * @example 
 * var a = STK.core.dom.cssText(STK.E("test").style.cssText);
 * a.push("width", "3px").push("height", "4px");
 * STK.E("test").style.cssText = a.getCss();
 */
$Import('core.util.browser');

STK.register("core.dom.cssText", function($) {
	var getToken = function(cssText){
		var i = 0;
		var token = [];
		var state = 'close';
		var stringing = false;
		var stringType = null;
		var gen_token = function(charSet){
			token.push({'type':'info','content':cssText.slice(0,i)});
			token.push({'type':'sign','content':cssText.slice(i,i+1)});
			cssText = cssText.slice(i+1);
			i = 0;
		};
		while(cssText){
			var charSet = cssText.charAt(i);
			switch(charSet){
				case ':' :
					if(!stringing){
						if(state === 'close'){
							token.push({'type':'attr','content':cssText.slice(0,i)});
							token.push({'type':'sign','content':cssText.slice(i,i+1)});
							cssText = cssText.slice(i+1);
							i = 0;
							state = 'open';
							break;
						}
					}
					i += 1;
					break;

				case ';' :
					if(!stringing){
						if(state === 'open'){
							token.push({'type':'info','content':cssText.slice(0,i)});
							token.push({'type':'sign','content':cssText.slice(i,i+1)});
						}
						cssText = cssText.slice(i+1);
						i = 0;
						state = 'close';
						break;
					}
					i += 1;
					break;
				case '"' :
				case '\'':
					if(stringing){
						if(charSet === stringType){
							stringing = !stringing;
							stringType = null;
						}
					}else{
						stringing = !stringing;
						stringType = charSet;
					}
					i += 1;
					break;

				case ' ' :
				case '!' :
				case ',' :
				case '(' :
				case ')' :
					gen_token(charSet);
					break;
				case '' :
					token.push({'type':'info','content':cssText.slice(0,i)});
					cssText = '';
					i = 0;
					break;
				default :
					i += 1;
			}
		}
		return token;
	};

	var styleObj = function(token){
		var ret = {};
		var cur;
		for(var i = 0, len = token.length; i < len; i += 1){
			if(token[i].type === 'attr'){
				cur = token[i]['content'];
				ret[cur] = '';
			}else if(token[i].type === 'sign' && token[i]['content'] === ';'){
				cur = null;
				continue;
			}else if(token[i].type === 'sign' && token[i]['content'] === ':'){
				continue;
			}else{
				if(cur !== null){
					ret[cur] += token[i]['content'];
				}
			}
		}
		return ret;
	};
	
	var css3HeadsRegString = ({
		'webkit'	: '-webkit-',
		'presto'	: '-o-',
		'trident'	: '-ms-',
		'gecko'		: '-moz-'
	})[$.core.util.browser.CORE];
	
	var css3Styles = [
		'transform',
		'transform-origin',
		'transform-style',
		'transition',
		'transition-delay',
		'transition-duration',
		'transition-property',
		'transition-timing-function',
		'animation',
		'animation-delay',
		'animation-direction',
		'animation-duration',
		'animation-iteration-count',
		'animation-name',
		'animation-play-state',
		'animation-timing-function'
	];
	var checkCss3Property = function(property){
		for(var i = 0, len = css3Styles.length; i < len; i += 1){
			if(property === css3Styles[i]){
				return true;
			}
		}
		return false;
	};
	return function(oldCss) {
		var cssObj = styleObj(getToken(oldCss || ''));
		var push = function(property, value) {
			property = property.toLowerCase();
			cssObj[property] = value;
			if(checkCss3Property(property)){
					cssObj[css3HeadsRegString + property] = value;
			}
			return that;
		};
		var that = {
				/**
				 * 向样式缓存列表里添加样式
				 * @method push
				 * @param {String} property 属性名
				 * @param {String} value 属性值
				 * @return {Object} this
				 */
				push: push,
				/**
				 * 从样式缓存列表删除样式
				 * @method remove
				 * @param {String} property 属性名
				 * @return {Object} this
				 */
				remove: function(property) {
					property = property.toLowerCase();
					cssObj[property] && delete cssObj[property];
					if(checkCss3Property(property)){
						if(cssObj[css3HeadsRegString + property]){
							delete cssObj[css3HeadsRegString + property];
						}
					}
					return that;
				},
				/**
				 * 将样式合并到样式缓存列表中·
				 * @method merge
				 * @param {String} cssText 属性名
				 */
				merge: function(cssText){
					var mergeCssObj = styleObj(getToken(cssText || ''));
					for(var k in mergeCssObj){
						push(k, mergeCssObj[k]);
					}
				},
				/**
				 * 得到·
				 * @method getCss
				 * @return {String} newCss
				 */
				getCss: function() {
					var newCss = [];
					for(var i in cssObj) {
						newCss.push(i + ":" + cssObj[i]);
					}
					return newCss.join(";");
				}
			};
		return that;
	};
});