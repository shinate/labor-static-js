var $ = require('/lib/jQuery');
var $Galaxy = require('/pagelet/Loopooq/source/Galaxy');

var Galaxy = $Galaxy({}, {
	'star' : {
		'id' : '91ee2734'
		//,'size' : [200,120]
		,'screen' : '#000000'
		,'thumbnail': 'http://ww3.sinaimg.cn/large/7e5ece8dgw1ej29m669o1j20r40dyn03.jpg'
		,'shape' : 'round'
		//,'alpha' : 10
	}
	,'planet' : [
		{
			'id' : '91882734'
			//,'size' : [100,120]
			,'screen' : '#0066FF'
			,'thumbnail' : 'http://ww3.sinaimg.cn/large/7e5ece8dgw1ej28nq4tw3j20gg0fnju2.jpg'
			,'shape' : 'round'
			,'alpha' : 80
		}
		,{
			'id' : '918er734'
			//,'size' : [80,60]
			,'screen' : '#006600'
			,'thumbnail' : 'http://ww3.sinaimg.cn/large/7e5ece8dgw1ej29fd3kxej20ie08xaa9.jpg'
			,'shape' : 'round'
			//,'alpha' : 80
		}
		,{
			'id' : '918er234'
			//,'size' : [100,100]
			,'screen' : '#FF6600'
			,'thumbnail' : 'http://ww3.sinaimg.cn/large/7e5ece8dgw1ej29g05trlj20gv0ik0wc.jpg'
			,'shape' : 'round'
			//,'alpha' : 80
		}
	]
	,'rel' : [
		['918er234', '91882734', 'we are friend']
	]
});

var Universe = $('#Universe');

var USize = {
	'height' : Universe.height()
	,'width' : Universe.width()
};

var GSize = Galaxy.get.size();

console.log(USize, GSize, (GSize.width - USize.width) / 2, (GSize.height - USize.height) / 2);

Galaxy.set.pos((GSize.width - USize.width) * -0.5, (GSize.height - USize.height) * -0.5);

Galaxy.get.node().appendTo(Universe);