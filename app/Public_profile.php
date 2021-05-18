<?php


namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class Public_profile
{
    public static function getProfile($id)
    {

        return DB::select('SELECT A.id, A.name, A.surname, A.email, A.phone, A.recruiter, A.availability, A.phone, A.pic, A.about_you, A.business_name, A.address, A.postcode,
                                B.fname, C.city FROM users A
                                LEFT JOIN video B ON B.id_candidate=A.id
                                LEFT JOIN city C on C.id=A.city_id
                                WHERE A.id = ? limit 1;', [$id]);
    }

    public static function getExperience($id)
    {

        return DB::select('SELECT A.id, A.company_name, A.position, A.years, A.year_start, A.responsibilities, A.currently_here, A.years, B.name FROM experience A
                                        LEFT JOIN category B ON B.id=A.id_category_job
                                        WHERE A.id_candidate = ? order by A.year_start DESC;', [$id]);
    }

    public static function getLanguages($id)
    {

        return DB::select('SELECT B.id, A.name, B.level FROM languages A
                                        INNER JOIN language_users B ON B.id_lang=A.id and B.id_candidate=?;', [$id]);

    }

    public static function getEmployeePortfolio($id)
    {

        return DB::select('SELECT * FROM portfolio WHERE id_user=?;', [$id]);
    }

    public static function getEducation($id)
    {

        return DB::select('SELECT A.id, A.edesc FROM education A
                                        WHERE A.id_candidate = ?;', [$id]);
    }

    public static function getPortfolioById($id)
    {

        return DB::select('SELECT * FROM portfolio A
                                        WHERE id = ?;', [$id]);
    }

    public static function getHrInvitations($id)
    {

        if (session('profile') == '0') {

            return;
        }

        return DB::select('SELECT A.m_date, A.m_time, B.title FROM invitation A
                                        INNER JOIN jobs B on B.id = A.job_id
                                        WHERE A.to = ? and A.from_hr=? and A.m_date>=?', [$id, session('user_id'), date('Y-m-d')]);
    }

    public static function part_time($user_id)
    {

        return DB::select('SELECT A.* FROM shifts A
                                 INNER join users B on B.id=A.id_user and B.availability!=2
                                        WHERE A.id_user = ? limit 1;', [$user_id]);
    }

    public static function users_services($user_id)
    {

        return DB::select('SELECT A.id, title, price, price_type, requirement, how_long FROM service A
                                        WHERE A.id_user = ?;', [$user_id]);
    }

    public static function portfolio_services($user_id)
    {

        return DB::select('SELECT A.id, A.id_portfolio, A.id_service FROM service_portfolio A
                                INNER JOIN portfolio B on B.id=A.id_portfolio and B.id_user=?;', [$user_id]);
    }

    // get likes to main profile

    public static function getLikesToProfile($uid){

        // portfolio_like

        return DB::select('SELECT count(A.pid) as cpid, A.pid FROM portfolio_like A
                                INNER JOIN portfolio B ON B.id=A.pid and B.id_user=?
                                 GROUP BY A.pid;', [$uid]);
    }

    // set like
    public static function like($idp)
    {

        DB::table('portfolio_like')->insert(
            [
                'user_id' => '' . session('user_id') . '',
                'pid' => '' . $idp . '' // mix
            ]
        );
    }

    public static function like_remove($idp)
    {

        $query = 'DELETE FROM portfolio_like WHERE user_id=? and pid = ? limit 1';

        DB::delete($query, [session('user_id'), $idp]);
    }

    public static function countLikeById($pid)
    {

        return DB::select('SELECT count(A.id) as cid FROM portfolio_like A where A.pid=?;', [$pid]);
    }

    public static function didYouLike($pid)
    {

        return DB::select('SELECT A.id FROM portfolio_like A where A.pid=? and A.user_id=? limit 1;', [$pid, session('user_id')]);
    }

    // portfolio view +1
    public static function incrementView($pid)
    {
        $row = DB::select('SELECT A.views FROM portfolio_views A where A.pid=?;', [$pid]);

        //echo $row[0]->views;

        //print_r($row);

        if(!$row){

            DB::table('portfolio_views')->insert(
                [
                    'pid' => '' . $pid . '',
                    'views' => '1' // mix
                ]
            );

            return;

        } else {

            DB::table('portfolio_views')
                ->where('pid', $pid)
                ->increment('views', 1);
        }

        return $row;
    }

}
