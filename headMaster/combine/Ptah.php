<?php
/**
 * Path
 * 
 * @author 莳子 | shine.wangrs@gmail.com
 */

namespace headMaster\combine;

class Ptah
{
	protected static $SHORT_INDEX = 0;
	
	/**
	 * 入口文件地址
	 */
	private static $PATH;
	
	/**
	 * 相对根目录
	 */
	private static $REL_PATH_ROOT;
	
	/**
	 * 文件内容列表
	 */
	private static $FC = array();
	
	/**
	 * 文件识别列表
	 */
	private static $FCHash = array();
	
	/**
	 * Unique
	 */
	private static $chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	
	/**
	 * 外部框架模板
	 */
	private static $TEMP_Frame = <<<EOF
(function(factory) {
    var component = {};
    var require = function(key) {
        if (!component[key]) {
            var module = {exports:{}};
            factory[key].call(module.exports, require, module.exports, module);
            component[key] = module.exports;
        }
        return component[key];
    };
    return require("%s");
})({%s});
EOF;
    
	/**
	 * 单文件模板
	 */
    private static $TEMP_Item = <<<EOF
"%s" : function(require, exports, module, define){
%s
	}
EOF;
	
	/**
	 * 执行结果
	 */
	public static $RES;
	
	/**
	 * 最后修改时间
	 */
	public static $LAST_MODIFY = 0;
	
	public static $FILE_LIST = array();
	
	private static $requireFix = 'R___eqU_es__t';
	
	public static function comply($Path){
		$c = __CLASS__;
		return new $c($Path);
	}
	
	/**
	 * 实例化方法
	 */	
	public function __construct($Path){
		$this->init($Path);
		$this->RES = self::$RES;
		$this->LAST = self::$LAST_MODIFY;
	}
	
	protected static function init($Path){
		
		self::$PATH = $Path;
		
		if(!is_readable(self::$PATH))
			self::halt('File referenced does not exist:['.self::$PATH.']');
		
		self::$REL_PATH_ROOT = ABSPATH;
		
		self::fetch(self::$PATH);
		
		self::format();
		
		//短方法名
		!!self::$SHORT_INDEX && self::sortPackageName();
	}
	
	/**
	 * 拼装FC
	 */
	private static function format(){
		
		$requireName = substr(self::$PATH, 0, -3);
		
		$C = array();
		foreach(self::$FC as $item){
			$C[] = sprintf(self::$TEMP_Item, $item['name'], "\n\t\t".preg_replace('/(\n)/', "$1\t\t", $item['content'])."\n\t");
		}
		
		$C = str_replace(self::$requireFix, 'require', join($C, ",\n\t"));
		
		self::$RES = sprintf(self::$TEMP_Frame, $requireName, "\n\t".$C."\n");
	}
	
	/**
	 * 递归匹配
	 * 
	 * @param {STRING} 入口文件路径
	 */
	private static function fetch($Path){
		
		$requireName = substr($Path, 0, -3);
		
		if(in_array($requireName, self::$FCHash)){
			return;
		}
		self::$FCHash[] = $requireName;
		
		$NS = substr($Path, 0, strrpos($Path, '/'));
		
		//最后修改时间
		$ft = filemtime($Path);
		if($ft > self::$LAST_MODIFY){
			self::$LAST_MODIFY = $ft;
		}
		
		//注册到文件列表
		if(!in_array($Path, self::$FILE_LIST)){
			self::$FILE_LIST[] = $Path;
		}
		
		//文件内容
		$fc = file_get_contents($Path);
		$fc = self::noteIgnore($fc);
		
		list($sourReqList, $requireList) = self::preg_match_entire('/require\((.*)\)/iU', $fc);

		$realReqList = array();
		foreach($requireList as $_k => $rp){
			$_requirePath = substr($rp, 1, -1);
			if(strpos($_requirePath, '/') === 0){
				$_realReqPath = self::rp(self::$REL_PATH_ROOT . $_requirePath . '.js');
			} else {
				$_realReqPath = self::rp($NS . DS . $_requirePath . '.js');
			}
			
			if($_realReqPath == $Path){
				self::halt('Infinite loop references:['.$_requirePath.']'."\n".'in '.$Path . ' line ' . self::codeAtLine($Path, $_realReqPath));
			} else if(!$_realReqPath || !is_readable($_realReqPath)){
				self::halt('File referenced does not exist:['.$_requirePath.']'."\n".'in '.$Path . ' line ' . self::codeAtLine($Path, $_realReqPath));
			} else {
				$_requireName = substr($_realReqPath, 0, -3);
				$realReqList[$_k] = 'require(\'' . $_requireName . '\')';
				self::fetch($_realReqPath);
			}
		}
		
		$c = array(
			'name'     => $requireName
			,'content' => str_replace($sourReqList, $realReqList, $fc)
		);
		
		self::$FC[] = $c;
	}

	/**
	 * 查找代码所在行
	 * 
	 * int codeAtLine(string $filePath[,string $code = null])
	 * 
	 * @param {STRING} 文件路径
	 * @param {STRING} 代码内容
	 * 
	 * @return {INT|STRING} 代码所在行 | unknow 
	 */
	private static function codeAtLine($filePath, $code = null){
		$line = 'unknow';
		if(!$code){
			return $line;
		}
		$fa = file($filePath);
		foreach($fa as $k => &$v){
			if(strpos($v, $code) > 0){
				$line = $k + 1;
				break;
			}
		}
		return $line;
	}
	
	/**
	 * 正则匹配字符串并返回结果
	 * 
	 * array preg_match_entire(regEx $regex, string $string [, int $flag = 0])
	 * 
	 * @param {REGEXP} regex 正则表达式
	 * @param {STRING} setting 待匹配的字符串
	 * @param {INT} flag 标识(可选), 切分维度选择
	 * 
	 * @return {ARRAY} 正则匹配结果;
	 */
	private static function preg_match_entire($regex, $string, $flag = 0){
		$flags = array(PREG_PATTERN_ORDER, PREG_SET_ORDER);
		preg_match_all($regex, $string, $matches, $flags[$flag]);
		return $matches;
	}
	
	/**
	 * 错误中断
	 * 
	 * @param {STRING} 错误文案
	 */
	private static function halt($C = ''){
		@header('HTTP/1.1 500 Internal Server Error');
		$err = '/**'."\n".' * ERROR: '.$C."\n".' */';
		exit($err);
	}
	
	/**
	 * realpath重新封装，绝对返回结果，不管对错
	 * 
	 * @param {STRING} 地址
	 * 
	 * @return {STRING} 文件真实地址
	 */
	protected static function rp($path){ 
		////check if realpath is working 
		if (strlen(realpath($path))>0){
			return realpath($path);
		}
		///if its not working use another method/// 
		$p = getenv("PATH_TRANSLATED");
		$p = str_replace("\\","/",$p);
		$p = str_replace(basename(getenv("PATH_INFO")),"",$p);
		$p .= "/";
		if($path == "."){
			return $p;
		}
		//now check for back directory//		
		$dirs = explode('/', $p.$path);
		foreach($dirs as $k => $v){
			if($v == '..'){
				$dirs[$k] = '';
				$dirs[$k-2] = '';
			}
		}
		
		$p = preg_replace('/\/+/', '/', $p . implode($dirs, '/'));
		
		$p = str_replace('/', DS, $p);
		
		return $p;
	}
	
	/**
	 * javascript 输出头
	 */
	protected static function output(){
		self::Header();
		
		if(!ob_start("ob_gzhandler")) ob_start();
		echo self::$RES;
		ob_flush();
	}
	
	/**
	 * 去掉注释
	 * 
	 * @param {STRING} 代码内容
	 * 
	 * @return {STRING} 代码内容
	 */
	private static function cleanNote($c){
		// 去除多行注释
		$c = preg_replace('/\/\*.*\*\//isU', '', $c);
		// 去除独立单行注释
		$c = preg_replace('/([\r\n])/', "\\1\\1", $c);
		$c = preg_replace('/([\r\n])\s*\/\/[^\r\n]*[\r\n]/iU', "\\1", $c);
		$c = preg_replace('/([\r\n])+/', "\\1", $c);
		// 去除单行尾行注释
		$c = preg_replace('/(https?:)\/\//', "\\1__", $c);
		$c = preg_replace('/(([\/\'\"]).*\\2[\,\;\]\}\)]+.*)\/\/[^\r\n]*[\r\n]/iU', "\\1\n", $c);
		$c = preg_replace('/(https?:)__/', "\\1//", $c);
		return $c;
	}
	
	private static function noteIgnore($c){
		
		$c = "\n" . preg_replace('/([\n\r])/', "\\1\\1", $c) . "\n";
		
		$cmmpl = self::preg_match_entire('/\/\*.*\*\//isU', $c);
		$cmone = self::preg_match_entire('/[\n\r]\s*(\/\/.+)/', $c);
		$cmlst = self::preg_match_entire('/[\/\'\"].*[\/\'\"].*(\/\/.+)[\r\n]/iU', $c);
		
		$res = array_unique(array_merge($cmmpl[0], $cmone[1], $cmlst[1]));
		
		$rcp = array();
		
		foreach($res as $k => $v){
			$rcp[$k] = str_replace('require', self::$requireFix, $v);
		}
		
		$c = str_replace($res, $rcp, $c);
		
		$c = trim(preg_replace('/([\n\r]{2})/', "\n", $c), "\n");
		
		return $c;
	}
	
	private static function noteFix($c){
		
		$c = "\n" . preg_replace('/([\n\r])/', "\\1\\1", $c) . "\n";
		
		$cmmpl = self::preg_match_entire('/\/\*.*\*\//isU', $c);
		$cmone = self::preg_match_entire('/[\n\r]\s*(\/\/.+)/', $c);
		$cmlst = self::preg_match_entire('/[\/\'\"].*[\/\'\"].*(\/\/.+)[\r\n]/iU', $c);
		
		$res = array_unique(array_merge($cmmpl[0], $cmone[1], $cmlst[1]));
		
		$rcp = array();
		
		foreach($res as $k => $v){
			$rcp[$k] = str_replace('require', self::$requireFix, $v);
		}
		
		$c = str_replace($res, $rcp, $c);
		
		$c = trim(preg_replace('/([\n\r]{2})/', "\n", $c), "\n");
		
		return $c;
	}
	
	/**
	 * 短方法名滤镜
	 */
	private static function sortPackageName(){
		$source = $replace = array();
		foreach(self::$FCHash as $k => $value){
			$l = strlen(self::$chars);
			$r = '';
			do {
				$r .= self::$chars{$k % $l};
				$k = floor($k / $l);
			} while( $k > 0 );
			$source[] = '\''.$value.'\'';
			$replace[] = '\''.$r.'\'';
		}
		self::$RES = str_replace($source, $replace, self::$RES);
	}
	
	protected static function Header(){
		
		$offset = 365 * 24 * 60 * 60;
		$expire = "expires: ".gmdate("D, d M Y H:i:s", time() + $offset)." GMT";
		
		//@header('HTTP/1.1 200 OK');
		@header("content-type: text/javascript; charset: UTF-8");
		//@header("cache-control: must-revalidate");
		//@header("Cache-Control: max-age=315360000");
		//@header($expire);
		//@header("Last-Modified: " .gmdate("D, d M Y H:i:s", self::$LAST_MODIFY)." GMT");
		//@header("Content-Length: " . strlen(self::$RES));
		//@header("Etag: " . md5(self::$RES));
		
	}
	
	protected static function get_last_modify($fl){
		$last = 0;
		foreach($fl as $file){
			$t = @filemtime($file);
			if($t > $last){
				$last = $t;
			}
		}
		
		return $last;
	}
}
?>