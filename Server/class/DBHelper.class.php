<?php

/**
 * MySQL Connector query helper
 * Class DBHelper
 */
	class DBHelper{
		private $db;
		private static $instance;

		/**
		 * Get current environment
		 * @return string
		 */
		public static function getEnv(){
			if(strpos($_SERVER['HTTP_HOST'], "localhost") !== false)
				return 'DEV';
			else
				return 'PROD';
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
				send(array( "code" => -1, "message" => "Connection failed : {$e->getMessage()}"));
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
		}

		public static function getInstance(){
			if(self::$instance == null) self::$instance = new DBHelper();

			return self::$instance;
		}

		/**
		 * Execute a read only query
		 * @param $query
		 * @param null $params : array of values to inject
		 * @return array
		 */
		public static function query($query, $params = null){
			return @self::getInstance()->_query($query, $params);
		}

		/**
		 * Execute a write query
		 * @param $query
		 * @param null $params : array of values to inject
		 * @return bool
		 */
		public static function update($query, $params = null){
			return @self::getInstance()->_update($query, $params);
		}

		/**
		 * Get last ID inserted
		 * @return string
		 */
		public static function lastInsertId(){
			return self::getInstance()->db->lastInsertId();
		}
	}
?>