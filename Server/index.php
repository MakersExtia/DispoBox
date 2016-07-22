<?php
    header('Content-Type: text/plain; charset=utf-8');
   //header("Content-Type: text/html; charset=UTF-8");
    error_reporting(E_ALL ^ E_NOTICE);
    //error_reporting(0);
    include __DIR__.'/config/init.inc.php';

    $result = array( "code" => -1, "message" => "undefined action" );
    if(isset($_REQUEST['action'])){
        $action = $_REQUEST['action'];
        $data = isset($_REQUEST['data'])? $_REQUEST['data'] : null;

        $ah = new ActionHelper($action, $data);
        $result = $ah->run();//run web service action
    }

    send($result);//display json return
?>