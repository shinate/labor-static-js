<?php
error_reporting(0);
define('RUN', TRUE);
define('DS', DIRECTORY_SEPARATOR);
define('ABSPATH', dirname(__FILE__));

include ABSPATH . DS . 'headMaster' . DS . 'src' . DS . 'load.php';

$uri_config = parse_url($_SERVER['REQUEST_URI']);

$path = trim($uri_config['path'], '/');

if ($path === '' || $path === 'package' || $path === 'amd') {
	exit('Silence is golden.');
}

$path = explode('/', $path);
$type = array_shift($path);
$file_name = array_pop($path);
if (FALSE !== strstr($file_name, '.min.js')) {
	$path[] = str_replace('.min.js', '.js', $file_name);
	$use_compress = TRUE;
} else {
	$path[] = $file_name;
	$use_compress = FALSE;
}
$path = ABSPATH . DS . join($path, DS);

if (strtotime(preg_replace('/;.*$/', '', $_SERVER['HTTP_IF_MODIFIED_SINCE'])) >= filemtime($path)) {
	\headMaster\Comm_Response::status(304);
	exit();
}

switch ($type) {
	case 'package' :
		$hand = \headMaster\combine\Ptah::comply($path);
		break;
	case 'amd' :
		$hand = \headMaster\combine\Seth::comply($path);
		break;
	default :
		break;
}

if (!empty($hand)) {
	$content = $hand->RES;
	if ($use_compress) {
		$content = \headMaster\compress\JSMin::minify($content);
	}
	header('Content-Length: ' . strlen($content));
	//header('Expires: ' . gmdate('D, d M Y H:i:s \G\M\T', time() + 604800));
	header('Last-Modified: ' . date('D, d M Y H:i:s \G\M\T', $hand->LAST));
	\headMaster\Comm_Response::status(200);
	\headMaster\Comm_Response::mime('js');
	exit($content);
}
?>