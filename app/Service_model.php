<?php


namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class Service_model extends Model
{

    public static function list(){

        $row = DB::select('SELECT A.id, title, price, price_type, requirement, how_long
                                 FROM service A
                                 WHERE A.id_user = ?;', [session('user_id')]);

        return $row;
    }

    public static function add(Request $request){

        DB::table('service')->insert(
            [
                'id_user' => '' . session('user_id') . '',
                'title' => '' . $request->input('title') . '',
                'price' => '' . $request->input('price') . '',
                'price_type' => '' . $request->input('price_type') . '',
                'requirement' => '' . $request->input('requirement') . '',
                'how_long' => '' . $request->input('how_long') . '' // mix
            ]
        );

        return DB::getPdo()->lastInsertId();
    }

    // get By id
    public static function get($id){

        $row = DB::select('SELECT title, price, price_type, requirement, how_long
                                 FROM service A
                                 WHERE A.id = ? limit 1;', [$id]);

        return $row;

    }

    public static function updateService(Request $request){

        DB::table('service')
            ->where('id', $request->input('id'))
            ->where('id_user', session('user_id'))
            ->update($request->all());
    }

    public static function deleteService(Request $request){

        $query = 'DELETE FROM service WHERE id=? and id_user = ? limit 1';

        DB::delete($query, [$request->input('id'), session('user_id')]);
    }

    public static function loadPortfolio(Request $request){

        return DB::select('SELECT A.id, title, pdesc, pfile, B.id_portfolio, B.id_service FROM portfolio A
                                LEFT JOIN service_portfolio B ON B.id_portfolio=A.id and B.id_service=?
                                WHERE A.id_user = ? GROUP BY A.id;', [$request->input('id_service'), session('user_id')]);
    }

    public static function portfolioServiceAttach(Request $request){

        DB::table('service_portfolio')->insert(
            [
                'id_portfolio' => '' . $request->input('id_portfolio') . '',
                'id_service' => '' . $request->input('id_service') . '' // mix
            ]
        );
    }

    public static function portfolioServiceRemove(Request $request){

        $query = 'DELETE FROM service_portfolio WHERE id_service=? and id_portfolio = ? limit 1';

        DB::delete($query, [$request->input('id_service'), $request->input('id_portfolio')]);
    }
}
