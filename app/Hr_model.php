<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
//use Illuminate\Http\Request;
use Illuminate\Pagination\Paginator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class Hr_model extends Model
{

    public static function profile()
    {

//        return DB::select('select A.id, D.id as applied, A.source_id, A.job_id, A.company_id, A.city_id, A.title, A.description, A.employment_type, A.address, A.create_date, A.urgent,
//                        A.immediate_start, A.expirience_not_required, A.shifts, A.salary_from, A.salary_to, A.period, A.currency_code, A.extra_options,
//                        B.name as name_company, C.city
//                        FROM jobs A
//                        LEFT JOIN job_companies B ON B.id=A.company_id
//                        LEFT JOIN city C ON C.id=A.city_id
//                        LEFT JOIN jobs_applied D on D.vid=A.id and D.user_id=?
//                        ORDER BY A.id DESC
//                        limit 21', [session('user_id')]);

        return;
    }

    public static function cvs_list()
    {
        return DB::table('users')
            ->join('experience', 'experience.id_candidate', '=', 'users.id')
            ->leftJoin('city', 'city.id', '=', 'users.city_id')
            ->select('users.id', 'users.name', 'users.surname', 'users.pic', 'users.availability',
                'experience.position', 'city.city')
            ->where('users.recruiter', '=', '0')
            ->where('users.availability', '!=', '2')
            //->whereIn('users.availability', array(0,1))

            ->where('users.city_id', '=', (request('city') ? request('city') : null))
            ->where('experience.position', 'like', '%' . request('search') . '%')
            ->where('users.blocked', '=', '0')
            ->groupBy('users.id')
            ->orderBy('users.id', 'DESC')
            ->simplePaginate(9);


        // Let's paginate!
        //return $all_transactions->paginate(10);
    }


    private static function extractUsersId($users)
    {

        $u = null;

        foreach ($users as $user) {

            $u[] = $user->id;
        }


        if (isset($u)) {

            return implode(',', $u);
        }

        return;
    }

    public static function getUsersExperiences($users)
    {


        $users_comma = Hr_model::extractUsersId($users);

        if (!isset($users_comma)) {

            return;
        }

        return DB::select('SELECT A.id_candidate, A.position FROM experience A
                                 WHERE A.id_candidate IN (' . $users_comma . ')');
    }

    public static function getCityById(){

        return DB::select('SELECT A.* FROM city A
                                        WHERE A.id = ? limit 1;', [request('city')]);
    }

}
