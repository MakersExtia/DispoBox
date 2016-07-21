<?php

/**
* 
*/
class Box
{
	public static $DISABLE = -1;
	public static $AVAILABLE = 0;
	public static $OCCUPIED = 1;

	public $id;
	public $state;

	function __construct($data = null)
 	{
 		if($data != null){
 			$this->load($data);
 		}
 	}
	
	public function load($data)
	{
		if(is_array($data)){
			$this->id = isset($data["id"])? $data["id"] : 0;
			$this->state = isset($data["state"])? intval($data["state"]) : -1;
		}
	}

	public static function getAll(){
		$boxes = array();
		$query = "SELECT * FROM box";
		$res = DBHelper::query($query);
		if($res){
			foreach ($res as $row) {
				$boxes[] = new Box($row);
			}
		}

		return $boxes;
	}

}