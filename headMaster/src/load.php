<?php
error_reporting(0);
/**
 * Const
 */
define('RUN', TRUE);
define('DS', DIRECTORY_SEPARATOR);
define('ABSPATH', substr(dirname(__FILE__), 0, -15));
define('HMPATH', ABSPATH . DS . 'headMaster');
/**
 * Initialize autoloader
 */
include dirname(__FILE__) . DS . 'autoLoader.php';
new autoLoader();
?>