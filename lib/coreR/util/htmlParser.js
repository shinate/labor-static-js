/**
 * HTML Parser By John Resig (ejohn.org)
 * Original code by Erik Arvidsson, Mozilla Public License
 * http://erik.eae.net/simplehtmlparser/simplehtmlparser.js
 *
 * // Use like so:
 * @id STK.core.util.htmlparser
 * @param {string} html 处理的HTML字符串
 * @param {object} handler html分析时的回调方法对象
 * {
 *  start : 匹配到节点时的回调 参数 tag(节点名称)、attrs(属性数组)、unary(是否为单标签（非必须闭合节点）)
 *  end : 匹配到节点结束时的回调 参数 tag(节点名称)
 *  chars : 匹配到文本时的回调 参数text(文本内容)
 *  comment : 匹配到注释节点时的架设 参数text(注释文本) 
 * }
 * @author John Resig
 * @example 开源代码，对html做分析用的。这个东西我觉得有必要再拆分。

 * STK.core.util.htmlParser(htmlString, {
 *     start: function(tag, attrs, unary) {},
 *     end: function(tag) {},
 *     chars: function(text) {},
 *     comment: function(text) {}
 * });
 */
STK.register('core.util.htmlParser', function($){
	var makeMap = function(str){
		var obj = {}, items = str.split(",");
		for ( var i = 0; i < items.length; i++ )
			obj[ items[i] ] = true;
		return obj;
	};
	var startTag = /^<(\w+)((?:\s+[\w-\:]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/,
		endTag = /^<\/(\w+)[^>]*>/,
		attr = /([\w|\-]+)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g;
	
	// Empty Elements - HTML 4.01
	var empty = makeMap("area,base,basefont,br,col,frame,hr,img,input,isindex,link,meta,param,embed");

	// Block Elements - HTML 4.01
	var block = makeMap("address,applet,blockquote,button,center,dd,del,dir,div,dl,dt,fieldset,form,frameset,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,p,pre,script,table,tbody,td,tfoot,th,thead,tr,ul");

	// Inline Elements - HTML 4.01
	var inline = makeMap("a,abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,code,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var");

	// Elements that you can, intentionally, leave open
	// (and which close themselves)
	var closeSelf = makeMap("colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr");

	// Attributes that have their values filled in disabled="disabled"
	var fillAttrs = makeMap("checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected");

	// Special Elements (can contain anything)
	var special = makeMap("script,style");
	
	var that = function( html, handler ) {
		var index, chars, match, stack = [], last = html;
		
		var parseStartTag = function( tag, tagName, rest, unary ) {
			if ( block[ tagName ] ) {
				while ( stack.last() && inline[ stack.last() ] ) {
					parseEndTag( "", stack.last() );
				}
			}

			if ( closeSelf[ tagName ] && stack.last() == tagName ) {
				parseEndTag( "", tagName );
			}

			unary = empty[ tagName ] || !!unary;

			if ( !unary ){
				stack.push( tagName );
			}
			var attrs = [];
			
			
			//for textarea
			if(tag === 'textarea'){
				var match = html.match(/^(.*)<\/textarea[^>]*>/);
				attrs.push({
					name:'text',
					value:html.slice(0, match[0].length)
				});
				html = html.substring( match[0].length );
			}
			
			if ( handler.start && typeof handler.start === 'function' ) {
				
				rest.replace(attr, function(match, name) {
					var value = arguments[2] ? arguments[2] :
						arguments[3] ? arguments[3] :
						arguments[4] ? arguments[4] :
						fillAttrs[name] ? name : "";
					
					attrs.push({
						name: name,
						value: value,
						escaped: value.replace(/(^|[^\\])"/g, '$1\\\"') //"
					});
				});
				handler.start( tagName, attrs, unary );
			}
		};
		
		var parseEndTag = function( tag, tagName ) {
			// If no tag name is provided, clean shop
			if ( !tagName ){
				var pos = 0;
			}	
			// Find the closest opened tag of the same type
			else{
				for ( var pos = stack.length - 1; pos >= 0; pos-- ){
					if ( stack[ pos ] == tagName ){
						break;
					}
				}
			}
				
			if ( pos >= 0 ) {
				// Close all the open elements, up the stack
				for ( var i = stack.length - 1; i >= pos; i-- ){
					if ( handler.end && typeof handler.end === 'function'){
						handler.end( stack[ i ] );
					}	
				}
				// Remove the open elements from the stack
				stack.length = pos;
			}
		};
		
		stack.last = function(){
			return this[ this.length - 1 ];
		};

		while ( html ) {
			chars = true;
			// Make sure we're not in a script or style element
			if ( !stack.last() || !special[ stack.last() ] ) {

				// Comment
				if ( html.indexOf("<!--") === 0 ) {
					index = html.indexOf("-->");
	
					if ( index >= 0 ) {
						if ( handler.comment && typeof handler.comment === 'function'){
							handler.comment( html.substring( 4, index ) );
						}
						html = html.substring( index + 3 );
						chars = false;
					}
				// end tag
				} else if ( html.indexOf("</") === 0 ) {
					match = html.match( endTag );
					if ( match ) {
						html = html.substring( match[0].length );
						match[0].replace( endTag, parseEndTag );
						chars = false;
					}
				// start tag
				} else if ( html.indexOf("<") === 0 ) {
					match = html.match( startTag );
	
					if ( match ) {
						html = html.substring( match[0].length );
						match[0].replace( startTag, parseStartTag );
						chars = false;
					}
				}

				if ( chars ) {
					index = html.indexOf("<");
					
					var text = index < 0 ? html : html.substring( 0, index );
					html = index < 0 ? "" : html.substring( index );
					
					if ( handler.chars && typeof handler.chars === 'function' ){
						handler.chars( text );
					}
				}
			} else {
				html = html.replace(new RegExp("(.*)<\/" + stack.last() + "[^>]*>"), function(all, text){
					text = text.replace(/<!--(.*?)-->/g, "$1").replace(/<!\[CDATA\[(.*?)]]>/g, "$1");
					if ( handler.chars && typeof handler.chars === 'function' ){
						handler.chars( text );
					}
					return "";
				});
				parseEndTag( "", stack.last() );
			}
			if ( html == last ){
				throw "Parse Error: " + html;
			}
			last = html;
		}
		// Clean up any remaining tags
		parseEndTag();
	};
	return that;
});