var $ = require('/lib/jQuery');
var column = require('/model/frame/column');

$('[--column="column"]').each(function(){
	column($(this));
});
