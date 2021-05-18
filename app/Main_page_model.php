<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
//use Illuminate\Http\Request;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class Main_page_model extends Model
{

    public static function getVacancy()
    {

        return DB::select('select A.id, D.id as applied, A.source_id, A.job_id, A.company_id, A.city_id, A.title, A.description, A.employment_type, A.address, A.create_date, A.urgent,
                        A.immediate_start, A.experience_not_required, A.shifts, A.salary_from, A.salary_to, A.period, A.currency_code, A.extra_options,
                        B.name as name_company, C.city, E.business_name, F.city
                        FROM jobs A
                        LEFT JOIN job_companies B ON B.id=A.company_id
                        LEFT JOIN users E ON E.recruiter=1 and E.id=A.company_id
                        LEFT JOIN city C ON C.id=A.city_id
                        LEFT JOIN city F ON F.id=E.city_id
                        LEFT JOIN jobs_applied D on D.vid=A.id and D.user_id=?
                        GROUP by A.id
                        ORDER BY A.id DESC limit 99', [session('user_id')]); // limit 21
    }

    public static function searchVacancy(Request $request)
    {
        return DB::select('select A.id, A.source_id, A.job_id, A.company_id, A.city_id, A.title, A.description, A.employment_type, A.address, A.create_date, A.urgent,
                        A.immediate_start, A.experience_not_required, A.shifts, A.salary_from, A.salary_to, A.period, A.currency_code, A.extra_options,
                        B.name as name_company, C.city, E.business_name
                        FROM jobs A
                        LEFT JOIN job_companies B ON B.id=A.company_id
                        LEFT JOIN users E ON E.recruiter=1 and E.id=A.company_id
                        LEFT JOIN city C ON C.id=A.city_id and C.id=?
                        WHERE A.title like ?
                        GROUP by A.id
                        ORDER BY A.id DESC limit 99', [session('city_id'), '%' . $request->input('letters') . '%']);
    }

    public static function searchIfNoLogin(Request $request)
    {

        return DB::select('select A.id, A.source_id, A.job_id, A.company_id, A.city_id, A.title, A.description, A.employment_type, A.address, A.create_date, A.urgent,
                        A.immediate_start, A.experience_not_required, A.shifts, A.salary_from, A.salary_to, A.period, A.currency_code, A.extra_options,
                        B.name as name_company, C.city, E.business_name
                        FROM jobs A
                        LEFT JOIN job_companies B ON B.id=A.company_id
                        LEFT JOIN users E ON E.recruiter=1 and E.id=A.company_id
                        INNER JOIN city C ON C.id=A.city_id
                        WHERE A.title like ?
                        GROUP by A.id
                        ORDER BY A.id DESC limit 99', ['%' . $request->input('letters') . '%']); // limit 21
    }

}
