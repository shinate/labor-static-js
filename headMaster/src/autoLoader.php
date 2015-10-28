<?php
/**
 * 
 * @global ABSPATH 绝对根路径
 * @global DS 文件系统分隔符(unix:/, windows:\\)
 */
class autoLoader {
	
	private static $NP;
	
	public function __construct($native_path = NULL){
		self::$NP = $native_path;
		set_include_path(ABSPATH);
        spl_autoload_register(array(__CLASS__, 'loader'));
	}
	
	/**
	 * 自动载入文件
	 * 
	 * @param string $className 类名
	 */
    private static function loader($className) {
        ($p = self::realPath($className)) && include( $p );
    }
	
	/**
	 * 获取包真实路径
	 * 
	 * @param {STRING} $package 包的名称，支持 "\" "/" "." "_" 分隔符
	 * 
	 * @return {STRING|BOOLEN} 返回真实地址，如果不存在则返回false
	 * 
	 * @example
	 * 	realPath('a\b\c')
	 * 	realPath('a\b_c')
	 * 	realPath('a.b.c')
	 * 	  ===>>> (假设为unix)
	 * 	  {Prefix}/a/b/c/c.php
	 *    {Prefix}/a/b/c.php
	 *    a/b/c/c.php
	 *    a/b/c.php
	 */
	public static function realPath($package){
		$path = str_replace(array('\\', '/', '_', '.'), DS, $package);
		$name = array_pop(explode(DS, $path));
		return self::$NP && is_readable( $p = ABSPATH . DS . self::$NP . DS . $path . DS . $name . '.php' ) ? $p : 
				self::$NP && is_readable( $p = ABSPATH . DS . self::$NP . DS . $path . '.php' ) ? $p : 
				is_readable( $p = ABSPATH . DS . $path . DS . $name . '.php' ) ? $p : 
				is_readable( $p = ABSPATH . DS . $path . '.php' ) ? $p : 
				false;
	}
}
?>