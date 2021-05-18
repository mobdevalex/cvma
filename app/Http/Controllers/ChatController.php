<?php


namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Chat_model as CM;
use Session;

class ChatController
{

    public function send(Request $request)
    {
        //if(session('profile') == '1'){

        CM::send($request);
        //}
    }

    public function load(Request $request){

        return CM::load($request);
    }

    public function reed(Request $request){

        CM::reed($request);

        return; //count($request->input()); //implode(',', $request->input());
    }

    public function check(Request $request){

        return CM::check($request);
    }

    public function list(){

        if (!empty(session('user_id'))) {

            return view('/chat/list',
                [
                    'chats' => CM::list()
                ]);
        } else {

            return redirect('/');
        }

        return;
    }

    public function check_msg(){

        if (!empty(session('user_id'))) {

            return CM::check_msg();
        }
    }
}
