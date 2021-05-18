<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class Worker_profile extends Model
{
    public static function getProfile()
    {

        return DB::select('SELECT A.id, A.name, A.surname, A.email, A.phone, A.recruiter, A.availability, A.phone, A.pic, A.about_you, A.business_name, A.address, A.postcode,
                                B.fname, C.country, C.city FROM users A 
                                LEFT JOIN video B ON B.id_candidate=A.id
                                LEFT JOIN city C on C.id=A.city_id
                                WHERE A.id = ? limit 1;', [session('user_id')]);
    }


    //
    public static function profileUpdate(Request $request)
    {

        //if (strlen(trim($request->input('pass-login-input'))) < 8) {

        DB::table('users')
            ->where('id', session('user_id'))
            ->update($request->all());
    }

    public static function getExperience()
    {

        return DB::select('SELECT A.id, A.company_name, A.position, A.years, A.year_start, B.name FROM experience A 
                                        LEFT JOIN category B ON B.id=A.id_category_job
                                        WHERE A.id_candidate = ?;', [session('user_id')]);
    }


    public static function experienceAdd(Request $request)
    {

        DB::table('experience')->insert(
            [
                'id_candidate' => '' . session('user_id') . '',
                'id_category_job' => '' . $request->input('job_category') . '',
                'company_name' => '' . $request->input('company_name') . '',
                'position' => '' . $request->input('workers_position') . '',
                'years' => '' . ($request->input('years_of_work') == '' ? 1 : $request->input('years_of_work')) . '',
                'year_start' => '' . $request->input('year_start') . '',
                'currently_here' => '' . $request->input('currently_here') . '',
                'responsibilities' => '' . $request->input('responsibilities') . ''
            ]
        );

        return DB::getPdo()->lastInsertId();
    }

    public static function experienceUpdate(Request $request)
    {

        DB::table('experience')
            ->where(['id_candidate' => session('user_id'),
                'id' => $request->input('id')])
            ->update([
                'id_category_job' => '' . $request->input('job_category') . '',
                'company_name' => '' . $request->input('company_name') . '',
                'position' => '' . $request->input('workers_position') . '',
                'years' => '' . $request->input('years_of_work') . '',
                'year_start' => '' . $request->input('year_start') . '',
                'currently_here' => '' . $request->input('currently_here') . '',
                'responsibilities' => '' . $request->input('responsibilities') . ''
            ]);
    }


    public static function getEducation()
    {

        return DB::select('SELECT A.id, A.edesc FROM education A 
                                        WHERE A.id_candidate = ?;', [session('user_id')]);
    }

    public static function getLanguages()
    {

        return DB::select('SELECT B.id, A.name, B.level FROM languages A 
                                        INNER JOIN language_users B ON B.id_lang=A.id and B.id_candidate=?;', [session('user_id')]);

    }

    public static function getEmployeeAvailability()
    {

        return DB::select('SELECT * FROM shifts WHERE id_user=? limit 1;', [session('user_id')]);

    }

    public static function getEmployeePortfolio()
    {

        return DB::select('SELECT * FROM portfolio WHERE id_user=?;', [session('user_id')]);
    }

    public static function getCountries()
    {

        return DB::select('SELECT iso, nicename FROM country;');
    }
}
