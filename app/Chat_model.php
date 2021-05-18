<?php


namespace App;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class Chat_model
{

    public static function send(Request $request){

        //
        if(session('user_id') == $request->input('to')){

            return;
        }

        // insert
        DB::table('chat')->insert(
            [
                'from_id' => '' . session('user_id') . '',
                'to_id' => '' . $request->input('to') . '',
                'msg' => '' . $request->input('msg') . ''
            ]
        );
    }

    public static function load(Request $request){

        return DB::select('SELECT id, from_id, to_id, msg, mread, m_date FROM chat
                                 WHERE from_id = ? and to_id = ? or from_id = ? and to_id = ? order by id DESC limit 50',
                                [session('user_id'), $request->input('chat_with'), $request->input('chat_with'), session('user_id')]);
    }

    // set mark of reed
    public static function reed(Request $request){

        DB::table('chat')
            ->whereIn('id', [$request->input()])
            ->limit(1)
            ->update(array('mread' => '1'));
    }

    public static function check(Request $request){

        return DB::select('SELECT id, from_id, to_id, msg, mread, m_date FROM chat
                                 WHERE from_id = ? and to_id = ? and mread=0 order by id DESC limit 5',
            [$request->input('chat_with'), session('user_id')]);
    }

    public static function list(){

        return DB::select('SELECT A.id, A.pic, A.name, A.surname, A.business_name, A.recruiter,
                                       B.to_id, B.id as aid, B.mread FROM users A
                                INNER JOIN chat B ON B.id=(select id from chat where from_id=A.id or to_id=A.id order by id DESC limit 1)
                                WHERE (B.to_id=? or B.from_id=?) and A.id!=?
                                GROUP by A.id order by B.id DESC limit 100',
                                [session('user_id'),session('user_id'),session('user_id')]);

    }

    // check new msg
    public static function check_msg(){

        return DB::select('select A.from_id, B.name, B.surname from chat A
                                LEFT JOIN users B ON B.id=A.from_id
                                where A.to_id=? and A.mread=0 order by A.id DESC limit 1',
                                [session('user_id')]);
    }
}
