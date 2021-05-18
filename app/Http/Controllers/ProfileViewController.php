<?php


namespace App\Http\Controllers;

use App\Public_profile as PP;
use Illuminate\Support\Facades\DB;
use Session;

class ProfileViewController extends Controller
{

    public function index($id)
    {
        $user = PP::getProfile($id);

        if (isset($user[0]->name)) {

            // view + 1
            DB::table('users')
                ->where('id', $id)
                ->increment('views', 1);

            return view('/profile_public/index_view',
                [
                    'user' => $user,
                    'experience' => PP::getExperience($id),
                    'education' => PP::getEducation($id),
                    'languages' => PP::getLanguages($id),
                    'portfolio' => PP::getEmployeePortfolio($id),
                    'part_time' => PP::part_time($id),
                    'invited' => PP::getHrInvitations($id), // if HR
                    'services' => PP::users_services($id),
                    'service_portfolio' => PP::portfolio_services($id),
                    'likes' => PP::getLikesToProfile($id)
                ]);
        } else {

            return redirect('/');
        }
    }

    public function recovery(){

        if(session('user_id') != null){

            return redirect('/');
        }



        return view('/profile_public/recovery',
            [
                'key' => $this->_checkKey()
            ]);
    }

    private function _checkKey(){

        $row = DB::select('SELECT id FROM recovery_account WHERE akey = ? and k_expired>=? limit 1;', [request('k'), date('Y-m-d H:i:s')]);

        if (isset($row[0]->id)) {

            return true;
        }

        return false;
    }

}
