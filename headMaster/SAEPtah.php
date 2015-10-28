<?php
namespace headMaster;

use \headMaster\combine\Ptah as Ptah;

class SAEPtah extends Ptah
{
	
	public function __CONSTRUCT($Path){
		
		parent::$SHORT_INDEX = 0;
		parent::$SINGLE_COMPRESS = 0;
		
		$MC = memcache_init();
		
		$Key = sha1($Path);
		
		$C = memcache_get($MC, $Key);
		$C = false;
		if($C){
			$last_modify = parent::get_last_modify($C[1]);
			if($last_modify <= $C[0]){
				parent::$RES = $C[2];
				parent::Header();
				parent::output();
				return;
			}
		}
		
		parent::init($Path);
		
		memcache_set($MC, $Key, array(parent::$LAST_MODIFY, parent::$FILE_LIST, parent::$RES));
		
		parent::output();
	}
}
?>