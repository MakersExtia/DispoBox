<?php

	class DBHelper{
		private $db;
		private static $instance;

		public static function getEnv(){
			return 'DEV';
		}

		private function __construct(){
			$config_file = __DIR__."/../config/config.t" ;			
			$config = parse_ini_file($config_file, true);
			$config = $config[ self::getEnv() ];

			$host = $config["host"];
			$user = $config["user"];
			$password = $config["password"];
			$database = $config["database"];
			try {
				$this->db = new PDO("mysql:host=$host;dbname=$database", $user, $password, array(PDO::ATTR_ERRMODE => PDO::ERRMODE_WARNING, PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8")) ;
			} catch (Exception $e) {
				trigger_error($e->getMessage());
			}
		}

		public function _query($query, $params = null){
			if($params && is_array($params)){
				$stmt = $this->db->prepare($query);
				$stmt->execute($params);
				$res = $stmt->fetchAll();
			}else{
				$res = $this->db->query($query)->fetchAll();
			}
							
			return $res;
		}

		public function _update($query, $params = null){
			try{
				$stmt = $this->db->prepare($query);				
				return $stmt->execute($params);
			}catch(Exception $e){
				trigger_error($e->getmessages());
				return false;
			}

				
				//$stmt->debugDumpParams();
				//$res = $stmt->fetchAll();
			//}else{
				//$res = $this->db->query($query);
			//}
							
			//return $res;
		}


		public static function getInstance(){
			if(self::$instance == null) self::$instance = new DBHelper();

			return self::$instance;
		}

		public static function query($query, $params = null){
			return self::getInstance()->_query($query, $params);
		}

		public static function update($query, $params = null){
			return self::getInstance()->_update($query, $params);
		}

		public static function lastInsertId(){
			return self::getInstance()->db->lastInsertId();
		}


	}


?>