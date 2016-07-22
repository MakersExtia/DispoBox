<?php

/**
 * Auto load fonction
 * @param $class_name
 */
function __autoload($class_name) {
    include __DIR__."/../class/$class_name.class.php";
}

/**
 * Display json
 * @param $data
 */
function send($data){
    echo DataDecoder::encodeParams($data);
    exit;
}

function check_for_fatal(){
    $error = error_get_last();
    if ( $error["type"] == E_ERROR )
        customErrorHandler( $error["type"], $error["message"], $error["file"], $error["line"] );
}

function customExceptionHandler(Exception $e){
    customErrorHandler($e->getCode(), $e->getMessage(), $e->getFile(), $e->getLine());
}

function customErrorHandler($errno, $errstr, $errfile, $errline)
{
    $error_type = "DEFAULT";
    switch ($errno) {
        case E_PARSE:
        case E_ERROR:
        case E_CORE_ERROR:
        case E_COMPILE_ERROR:
        case E_USER_ERROR:
            $error_type = 'FATAL ERROR';
            break;
        case E_WARNING:
        case E_USER_WARNING:
        case E_COMPILE_WARNING:
        case E_RECOVERABLE_ERROR:
            $error_type = 'Warning';
            break;
        case E_NOTICE:
        case E_USER_NOTICE:
            $error_type = 'Notice';
            break;
        case E_STRICT:
            $error_type = 'Strict';
            break;
        case E_DEPRECATED:
        case E_USER_DEPRECATED:
            $error_type = 'Deprecated';
            break;
        default :
            $error_type = "DEFAULT";
            break;
    }

    $date = date("Y-m-d H:i:s");
    write_error_log("[$date][$error_type] $errstr ($errfile line $errline)");
    return false;
}

set_exception_handler( "customExceptionHandler" );
set_error_handler("customErrorHandler");//define custom error action
register_shutdown_function( "check_for_fatal" );//custom error for fatal

function write_error_log($msg){
    $dir = __DIR__."/../logs";
    if(! is_dir($dir)) mkdir($dir);
    $f = "$dir/error_log.".date("Y-m-d").".log";
    $hld = fopen($f, "a+");
    flock($hld, LOCK_EX);
    fwrite($hld, "$msg\n");
    flock($hld, LOCK_UN);
    fclose($hld);
}