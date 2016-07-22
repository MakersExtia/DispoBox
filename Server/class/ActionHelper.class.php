<?php

/**
* a
*/
class ActionHelper
{	
	private $action;
	private $data;
	public static $connected_user_id = null;

	function __construct($action, $data)
	{
		if(DBHelper::getEnv() == 'DEV'){// log DEV
			$msg = "Files:\nPost:\n".json_encode($_POST);
			//ActionHelper::log($msg);
		}

		$this->action = $action;
		if($data){
			$this->data = DataDecoder::decodeParams($data);
			if(isset($this->data['connected_user_id']))
				self::$connected_user_id = $this->data['connected_user_id'];

			@self::log(print_r($this->data, true));
		}
	}

	public static function log($msg){
		$dir = __DIR__."/../logs";
		if(! is_dir($dir)) mkdir($dir);
		$f = "$dir/custom_log.".date("Y-m-d").".log";
		$hld = fopen($f, "a+");
		flock($hld, LOCK_EX);
		fwrite($hld, "$msg\n");
		flock($hld, LOCK_UN);
		fclose($hld);
	}

	/**
	 * get formed array for json display
	 * @param int $code
	 * @param string $message
	 * @param null $data
	 * @return array
	 */
	public function publishResult($code = -1, $message = "Internal error", $data = null){
		return array( "code" => $code, "message" => $message, "data" => $data );
	}

	/**
	 * Execute WS action
	 * @return array
	 */
	public function run(){
		ini_set('display_errors',1);

		$action = $this->action."Action";
		if(method_exists($this, $action))
			$results = $this->$action();
		else
			$results = array( "code" => -1, "message" => "Action {$this->action} not found");

		if(isset($results["message"]))
			$results["message"] = utf8_encode($results["message"]);//utf8 message fix

		return $results;
	}

	/**
	 * Test action : action = test2
	 * @return array
	 */
	private function test2Action(){
		return $this->publishResult(0, "", array("1" => 1, "2" => 0));	
	}

	/**
	 * Test action : action = test
	 * @return array
	 */
	private function testAction(){
		$boxes = Box::getAll();
		return $this->publishResult(0, "", $boxes);	
	}

	/**
	 * WS action get all boxes infos : action = getAllBoxes
	 * @return array
	 */
	private function getAllBoxesAction(){
		$boxes = Box::getAll();
		return $this->publishResult(0, "", $boxes);
	}

}