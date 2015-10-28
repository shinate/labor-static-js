var $ = require('/lib/jQuery');
var P = require('/pagelet/Loopooq/source/Planet');

var ps = [];

ps.push(
	
P({
	'id' : '91882734'
	//,'size' : [100,120]
	,'screen' : '#0066FF'
	,'thumbnail' : 'http://ww3.sinaimg.cn/large/7e5ece8dgw1ej28nq4tw3j20gg0fnju2.jpg'
	,'shape' : 'round'
	,'alpha' : 80
}), P({
	'id' : '918er734'
	//,'size' : [80,60]
	,'screen' : '#006600'
	,'thumbnail' : 'http://ww3.sinaimg.cn/large/7e5ece8dgw1ej29fd3kxej20ie08xaa9.jpg'
	,'shape' : 'round'
	//,'alpha' : 80
}), P({
	'id' : '918er234'
	//,'size' : [100,100]
	,'screen' : '#FF6600'
	,'thumbnail' : 'http://ww3.sinaimg.cn/large/7e5ece8dgw1ej29g05trlj20gv0ik0wc.jpg'
	,'shape' : 'round'
	//,'alpha' : 80
}));

ps[0].set.pos(100,100);
ps[1].set.pos(-240,-100);
ps[2].set.pos(300,-100);

var Galaxy = $('#Galaxy');

for(var i=0;i<ps.length;i++){
	ps[i].get.node().appendTo(Galaxy);
}

var scale = 100;

$('#tools').delegate('[action-type="scale"]', 'click', function(){
	var self = $(this);
	var s = parseInt(self.attr('scale'));
	
	scale += s;
	
	console.log(scale);
	
	for(var i=0;i<ps.length;i++){
		ps[i].set.scale(scale / 100);
	}
	
});