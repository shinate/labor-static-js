<?php
/**
 * Seth
 *
 * @author 莳子 | shine.wangrs@gmail.com
 */

namespace headMaster\combine;

class Seth {

	private static $TEMP = <<<EOF
define(function(require, exports, module, define){
%s
});
EOF;

	protected $PATH;

	public $RES;

	public $LAST = 0;
	
	public $FILES = array();

	public static function comply($Path) {
		$c = __CLASS__;
		return new $c($Path);
	}

	/**
	 * 实例化方法
	 */
	public function __construct($Path) {
		$this->indexAction($Path);
	}

	public function indexAction($Path) {
		$this->PATH = $Path;
		if (is_readable($this->PATH)) {
			$this->LAST = @filemtime($this->PATH);
			$this->RES = sprintf(self::$TEMP, "\n\t" . preg_replace('/(\n)/', "$1\t", file_get_contents($this->PATH)) . "\n");
			$this->FILES[] = $this->PATH;
		}
	}

}
?>