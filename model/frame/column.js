var $ = require('/lib/jQuery');

var getScreenWidth = function(){
	return $(window).width();
};

module.exports = function(node){
		
	var nodes;
	
	var it = {
		'init' : function(){
			it.bind();
			it.createScreen();
		}
		,'bind' : function(){
			$(window).bind("onorientationchange" in window ? "orientationchange" : "resize", it.createScreen);
		}
		,'createScreen' : function(){
			var position
				,el
				,prev
				,next
				,unit
				,revert = false
				,screenWidth;
			
			nodes = node.find('[--column-position]');
			
			for(var i = 0; i < nodes.length; i++){
				el = nodes.eq(i);
				position = el.attr('--column-position');
				
				if(typeof position !== 'undefined'){
					
					if(position === '^' || position === '$'){
						switch(position){
							case '^':
								el.prevAll().css('display', 'none');
								el.next().css('left', 0 + 'px');
								break;
							case '$':
								el.nextAll().css('display', 'none');
								el.prev().css('right', 0 + 'px');
								break;
						}
						el.css('display', 'none');
						continue;
					}
					
					/**
					 * 反向标识
					 */
					if(position.substr(0,1) === ':'){
						position = position.replace(':', '');
						revert = true;
					} else {
						revert = false;
					}
					
					/**
					 * 百分比区分
					 */
					if(position.indexOf('%') > -1){
						position = parseFloat(position.replace('%', ''));
						unit = '%';
						screenWidth = 100;
					} else {
						position = parseFloat(position);
						unit = 'px';
						screenWidth = getScreenWidth();
					}
					
					if(prev = el.prev()){
						prev.css('right', (revert ? position : (screenWidth - position)) + unit);
					}
					if(next = el.next()){
						next.css('left', (revert ? (screenWidth - position) : position) + unit);
					}
					
					el.css('left', (revert ? (screenWidth - position) : position) + unit);
				}
			}
		}
	};
	
	it.init();
	
	return it;
};