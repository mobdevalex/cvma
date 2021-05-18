<?php


namespace App\Http\Controllers;


/**
 * Class Whatsapp
 * @package App\Http\Controllers
 *
 *  https://app.chat-api.com/instance/89994
 *  spacerg
 *  123a
 */
class Whatsapp extends Controller
{

    public function send(){

        $apiURL = 'https://eu86.chat-api.com/instance89994/sendMessage?token=fwt9jc7jp308jlpo';

        $message = 'Hi! text test: less'; // https://cvmatograph.com
        $phone = '447462729943';

        $data = json_encode(
            array(
                'chatId'=>$phone.'@c.us',
                'body'=>$message
            )
        );

        $options = stream_context_create(
            array('http' =>
                array(
                    'method'  => 'POST',
                    'header'  => 'Content-type: application/json',
                    'content' => $data
                )
            )
        );
        $response = file_get_contents($apiURL,false,$options);

        //echo $response;

        print_r($response);

        exit;
    }
}
