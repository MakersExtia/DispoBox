<?php

 /**
 * 
 */
 class TCPConnection
 {
 	private $is_connected = false;
 	private $host;
 	private $port;
 	private $socket;
 	
 	function __construct($host, $port)
 	{
 		$this->host = $host;
 		$this->port = $port;
 	}

 	public function connect()
 	{
 		$this->socket = @socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
		if(!$this->socket){
			return false;
		}

		if(! @socket_connect($this->socket, $this->host, $this->port)){
			return false;	
		}

		$this->is_connected = ($this->socket != null);
		return $this->is_connected;
 	}

 	public function disconnect(){
 		if(! $this->is_connected) return;

		if($this->socket)
			socket_close($this->socket);
 	} 	

 	public function sendData($data){
 		if(!$this->is_connected || $this->socket == null) return;

 		socket_send($this->socket, $data, strlen($data), 0);
 	}

 	public function receiveData(){
 		if(!$this->is_connected || $this->socket == null) return null;

 		@socket_recv($this->socket, $buffer, 1024, 0);
 		return $buffer;
 	}

 }