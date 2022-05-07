<?php

/* This library contains standard response of tapi */

define('TAPI_SUCCESS',0);
define('TAPI_ERR_NOT_LOGGED_IN',1);
define('TAPI_ERR_RESTRICTED',2);
define('TAPI_ERR_INVALID_INPUT',3);
define('TAPI_ERR_MISSING_PARAM',4);
define('TAPI_ERR_INTERNAL',5);
define('TAPI_ERR_OTHER',6);

class Tapi{
    public function get_request(){
        //get raw request json data
        $raw_data=file_get_contents('php://input');
        $data=json_decode($raw_data,true);
        if(!$data){
            $this->throw_error(TAPI_ERR_OTHER,"Error decoding request data");
            return false;
        }
        return $data;
    }
    public function throw_error($error,$errmsg){
        header('Content-Type: application/json');
        $data=array(
            'error'=>$error,
            'errmsg'=>$errmsg
        );
        echo json_encode($data);
        exit;
    }
    public function response($data){
        header('Content-Type: application/json');
        $resp=array(
            'error'=>TAPI_SUCCESS,
        );
        $resp=array_merge($resp,$data);
        echo json_encode($resp);
        exit;
    }
}