<?php

/**
* 
*/
class DataDecoder
{
	
	public static function decodeParams($data){
		if($data == null) return array();

		return json_decode($data, true);
	}

	public static function encodeParams($data){
		return json_encode($data);
	}
}