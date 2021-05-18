<?php


namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class Invitation_model extends Model
{
    public static function hr()
    {
        return DB::select('SELECT A.id, A.m_date, A.m_time, A.job_id, A.msg, A.status, B.id as uid, B.name, B.surname, C.title, C.id as jid
                                 FROM invitation A
                                 LEFT JOIN users B on B.id=A.to
                                 LEFT JOIN jobs C on C.id = A.job_id
                                 WHERE A.from_hr=?
                                 GROUP BY A.id ORDER BY A.id DESC;', [session('user_id')]);
    }

    // ? -  date - yesterday ( may different time zone )
    public static function worker()
    {
        return DB::select('SELECT A.id, A.m_date, A.m_time, A.job_id, A.msg, A.status, B.id as uid, B.name, B.surname, B.business_name, C.title, C.id as jid
                                 FROM invitation A
                                 LEFT JOIN users B on B.id=A.from_hr
                                 LEFT JOIN jobs C on C.id = A.job_id
                                 WHERE A.to=? and A.m_date >="'.date("Y-m-d", time() - 86400).'" and A.status!=2
                                 GROUP BY A.id ORDER BY A.id DESC;', [session('user_id')]);
    }

    // decline
    public static function decline(Request $request){

        DB::table('invitation')
            ->where(['to' => session('user_id'),
                'id' => $request->input('jid')])
            ->update([
                'status' => '2'
            ]);

        return;
    }

    // accept
    public static function accept(Request $request){

        DB::table('invitation')
            ->where(['to' => session('user_id'),
                'id' => $request->input('jid')])
            ->update([
                'status' => '1'
            ]);

        return;
    }

}
