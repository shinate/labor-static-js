var $ = require('/lib/jQuery');
var dataTable = require('source/main');

$('[--pagelet-type="datatable"]').each(function(){
	dataTable($(this), $(this).data());
});
