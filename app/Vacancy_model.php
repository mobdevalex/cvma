<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class Vacancy_model extends Model
{

    public static function vacancyById($id)
    {

        return DB::select('select A.id, D.id as applied, A.source_id, A.job_id, A.company_id, A.city_id, A.title, A.description, A.employment_type, A.address, A.create_date, A.urgent,
                        A.immediate_start, A.experience_not_required, A.shifts, A.salary_from, A.salary_to, A.period, A.currency_code, A.extra_options, A.shifts, A.full_time, A.part_time,
                        B.name as name_company, B.description as description_company, B.business_category, C.city,
                        E.business_name, E.about_you, E.address as business_address, F.city
                        FROM jobs A
                        INNER JOIN job_companies B ON B.id=A.company_id
                        LEFT JOIN jobs_applied D on D.vid=A.id and D.user_id=?
                        LEFT JOIN users E ON E.recruiter=1 and E.id=A.company_id
                        LEFT JOIN city C ON C.id=A.city_id
                        LEFT JOIN city F ON F.id=E.city_id
                        where A.id = ?
                        ORDER BY A.id DESC
                        limit 1', [session('user_id'), $id]);
    }

    public static function suggestionVacancy($str, $id)
    {

        return DB::select('select A.id, D.id as applied, A.source_id, A.job_id, A.company_id, A.city_id, A.title, A.description, A.employment_type, A.address, A.create_date, A.urgent,
                        A.immediate_start, A.experience_not_required, A.shifts, A.salary_from, A.salary_to, A.period, A.currency_code, A.extra_options,
                        B.name as name_company, C.city, E.business_name
                        FROM jobs A
                        LEFT JOIN job_companies B ON B.id=A.company_id
                        LEFT JOIN city C ON C.id=A.city_id
                        LEFT JOIN jobs_applied D on D.vid=A.id and D.user_id=?
                        LEFT JOIN users E ON E.recruiter=1 and E.id=A.company_id
                        WHERE A.title like ? and A.id!=?
                        ORDER BY A.id DESC limit 3', [session('user_id'), $str . '%', $id]); // limit 21
    }

    public static function add(Request $request)
    {

        $city = DB::select('SELECT id FROM city
                                        WHERE id = ?;', [session('user_id')]);

        DB::table('jobs')->insert(
            [
                'source_id' => '0',
                'company_id' => '' . session('user_id') . '',
                'city_id' => '' . (session('city_id') != '' ? session('city_id') : 0) . '',
                'title' => '' . $request->input('title') . '',
                'description' => '' . $request->input('description') . '',
                'full_time' => '' . $request->input('full_time') . '',
                'part_time' => '' . $request->input('part_time') . '',
                'urgent' => '' . $request->input('urgent') . '',
                'immediate_start' => '' . $request->input('immediate_start') . '',
                'experience_not_required' => '' . $request->input('experience_not_required') . '',
                'shifts' => '' . $request->input('shifts') . '',
                'salary_from' => '' . $request->input('salary_from') . '',
                'salary_to' => '' . $request->input('salary_to') . '',
                'period' => '' . $request->input('period') . '',
                'currency_code' => 'GBP',
                'extra_options' => '' . $request->input('extra_options') . '',
                'md_hash' => '' . md5(session('user_id') . $request->input('description')) . ''
            ]
        );


        return DB::getPdo()->lastInsertId();
    }

    public static function getAll()
    {

        return DB::select('SELECT A.id, A.title, A.description, A.employment_type, A.full_time, A.part_time, A.address,
                                 A.urgent, A.immediate_start, A.experience_not_required,A.shifts, A.salary_from, A.salary_to,
                                 A.period, A.extra_options, B.city, count(C.id) as count_applied
                                 FROM jobs A
                                 LEFT JOIN city B on B.id=A.city_id
                                 LEFT JOIN jobs_applied C ON C.vid=A.id
                                 WHERE A.company_id = ? and A.source_id=0
                                 GROUP BY A.id
                                 ORDER BY A.id DESC;', [session('user_id')]);
    }

    public static function getById(Request $request)
    {

        return DB::select('SELECT A.id, A.title, A.description, A.employment_type, A.full_time, A.part_time, A.address,
                                 A.urgent, A.immediate_start, A.experience_not_required,A.shifts, A.salary_from, A.salary_to,
                                 A.period, A.extra_options, B.city, count(C.id) as count_applied
                                 FROM jobs A
                                 LEFT JOIN city B on B.id=A.city_id
                                 LEFT JOIN jobs_applied C ON C.vid=A.id
                                 WHERE A.company_id = ? and A.source_id=0 and A.id=?
                                 GROUP BY A.id
                                 ORDER BY A.id DESC
                                 LIMIT 1;', [session('user_id'), $request->input('id')]);
    }

    public static function update_hr_vacancy(Request $request)
    {

        DB::table('jobs')
            ->where('id', $request->input('id'))
            ->where('company_id', session('user_id'))
            ->update($request->all());
    }

    public static function delete_hr_vacancy(Request $request)
    {

        $query = 'DELETE FROM jobs WHERE id=? and source_id=0 and company_id = ? limit 1';

        DB::delete($query, [$request->input('id'), session('user_id')]);
    }

    public static function suitableVacancy($title)
    {

        return DB::select('select A.id, D.id as applied, A.source_id, A.job_id, A.company_id, A.city_id, A.title, A.description, A.employment_type, A.address, A.create_date, A.urgent,
                        A.immediate_start, A.experience_not_required, A.shifts, A.salary_from, A.salary_to, A.period, A.currency_code, A.extra_options, A.shifts,
                        B.name as name_company, B.description as description_company, B.business_category, C.city, E.business_name, E.about_you
                        FROM jobs A
                        LEFT JOIN job_companies B ON B.id=A.company_id
                        LEFT JOIN city C ON C.id=A.city_id
                        LEFT JOIN jobs_applied D on D.vid=A.id and D.user_id=?
                        LEFT JOIN users E ON E.recruiter=1 and E.id=A.company_id
                        where A.title = ? and A.id!=A.id
                        ORDER BY A.id DESC
                        limit 3', [session('user_id'), $title]);
    }

    public static function check_vcv()
    {

        $row = DB::select('SELECT A.cv_file, B.id FROM users A
                                 LEFT join experience B ON B.id_candidate=A.id
                                 WHERE A.id = ?
                                 limit 1;', [session('user_id')]);

        if (isset($row[0]->cv_file) || isset($row[0]->id)) {

            return;
        }

        return 'false';
    }

    public static function companies_email_exists($email)
    {

        $row = DB::select('SELECT A.id FROM users A
                                 WHERE A.email = ?
                                 limit 1;', [$email]);

        if (isset($row[0]->id)) {

            return 'exist';
        }

        return 'can_use';
    }

    public static function save_vacancy(Request $request)
    {

        // user insert
        DB::table('users')->insert(
            [
                'business_name' => '' . $request->input('business_name') . '',
                'name' => '' . $request->input('business-user-name') . '',
                'surname' => '' . $request->input('business-user-surname') . '',
                'email' => '' . $request->input('business-email') . '',
                'phone' => '' . $request->input('business-phone') . '',
                'postcode' => '' . $request->input('business-postcode') . '',
                'about_you' => '' . $request->input('company_description') . '',
                'city_id' => '' . session('city_id') . '',
                'address' => ''. $request->input('business-address') . '',
                'recruiter' => '1'
            ]
        );

        $lastId = DB::getPdo()->lastInsertId();

        if (isset($lastId)) {

            // vacancy insert
            DB::table('jobs')->insert(
                [
                    'title' => '' . $request->input('vacancy_title') . '',
                    'company_id' => '' . $lastId . '',
                    'salary_from' => '' . $request->input('vacancy_salary_from') . '',
                    'salary_to' => '' . $request->input('vacancy_salary_to') . '',
                    'period' => '' . $request->input('vacancy_period') . '',
                    'description' => '' . $request->input('vacancy_description') . '',
                    'full_time' => '' . $request->input('vacancy_fullTime') . '',
                    'part_time' => '' . $request->input('vacancy_partTime') . '',
                    'urgent' => '' . $request->input('vacancy_urgent') . '',
                    'immediate_start' => '' . $request->input('vacancy_immediateStart') . '',
                    'experience_not_required' => '' . $request->input('vacancy_experienceNot') . '',
                    'shifts' => '' . $request->input('vacancy_shifts') . '',
                    'extra_options' => '' . $request->input('vacancy_extra') . '',
                    'address' => ''. $request->input('business-address') . '',
                    'md_hash' => '' . md5($lastId . $request->input('vacancy_description')) . '' // mix
                ]
            );

            return; // $lastId;
        }
    }

    public static function load_vacancies()
    {

        return DB::select('select A.id, A.title from jobs A where A.company_id=?',
            [session('user_id')]);
    }

    public static function load_invitation_dates(Request $request)
    {

        return DB::select('select A.m_time from invitation A where A.from_hr=? and A.m_date=? order by A.m_time',
            [session('user_id'), $request->input('m_date')]);
    }

    public static function invitation_send(Request $request)
    {
        // user invitation
        DB::table('invitation')->insert(
            [
                'job_id' => '' . $request->input('job_id') . '',
                'from_hr' => '' . session('user_id') . '',
                'to' => '' . $request->input('to') . '',
                'msg' => '' . $request->input('msg') . '',
                'm_date' => '' . $request->input('m_date') . '',
                'm_time' => '' . $request->input('m_time') . ''
            ]
        );


        // to do: send link to invitation

        // insert
        DB::table('chat')->insert(
            [
                'from_id' => '' . session('user_id') . '',
                'to_id' => '' . $request->input('to') . '',
                'msg' => '<a href="/invitations">invitation</a>'
            ]
        );
    }

}
