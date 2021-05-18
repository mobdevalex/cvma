<?php
/**
 * Created by PhpStorm.
 * User: webex
 * Date: 5/25/2018
 * Time: 6:22 PM
 */

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Session;

class LoginController extends Controller
{

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index(Request $request)
    {
        if (!filter_var($request->input('email-login-input'), FILTER_VALIDATE_EMAIL)) {

            return 'false';
        }

        if (strlen(trim($request->input('pass-login-input'))) < 8) {

            return 'false';
        }

        $row = DB::select('SELECT A.id, A.name, A.recruiter, A.city_id, B.country, B.city FROM `users` A
                                 LEFT JOIN city B on B.id=A.city_id
                                 WHERE A.email = ? and A.passw = ? limit 1;',
                                 [$request->input('email-login-input'), $this->makeHash($request->input('pass-login-input'))]);


        if (isset($row[0]->id)) {

            session()->put('user_id', $row[0]->id);
            session()->put('user_name', $row[0]->name);

            // city_id & city
            session()->put('city_id', $row[0]->city_id);
            session()->put('city', $row[0]->city);
            session()->put('country', $row[0]->country);

            // link to profile
            session()->put('profile', $row[0]->recruiter);

            return [$row[0]->name, $row[0]->recruiter]; // . ' - '. Session::getId();
        }

        return 'false';
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function signup(Request $request)
    {
        if (!filter_var($request->input('email-input'), FILTER_VALIDATE_EMAIL)) {

            echo 'false';
            return;
        }

        if ($this->emailExists($request->input('email-input')) == true) {

            return 'email_exists';
        }

        if (strlen(trim($request->input('first-name-input'))) < 2) {

            return 'false';
        }

        if (strlen(trim($request->input('last-name-input'))) < 2) {

            return 'false';
        }

        if (strlen(trim($request->input('password-input'))) < 8) {

            return 'false';
        }

        DB::table('users')->insert(
            [
                'name' => '' . $request->input('first-name-input') . '',
                'surname' => '' . $request->input('last-name-input') . '',
                'passw' => '' . $this->makeHash($request->input('password-input')) . '',
                'email' => '' . $request->input('email-input') . '',
                'recruiter' => '' . $request->input('profile') . '',
                'facebook' => '0',
                'pic' => '0']
        );

        if ($request->input('profile') == '0') {

            return '0';
        }

        return '1';
    }

    /**
     * Check email
     * @param $email
     * @return bool
     */
    private function emailExists($email)
    {

        $row = DB::select('SELECT id FROM `users` WHERE `email` = \'' . $email . '\' limit 1;');

        if (isset($row[0]->id)) {

            return true;
        }

        return false;
    }


    public function check()
    {

        if (session('user_id')) {

            return 'true';
        }

        return 'false';
    }

    public function logout()
    {

        Session::flush();

        return redirect('/');
    }

    private function makeHash($text)
    {

        return hash('sha512', hash('sha512', trim($text)) . '_^*&');
    }

    public function forgot_email(Request $request){


        $row = DB::select('SELECT id, email FROM users WHERE email = ? limit 1;', [$request->input('email')]);


        if (isset($row[0]->email)) {

            echo 'true';

            // to do : send email

            // send link

            // set key
            $this->key_for_new_pass($row[0]->id);

            return;

        } else {

            echo 'doesnt_exist';
        }

        return;
    }

    private function key_for_new_pass($user_id){

        // to do : mail to

        $key = substr($this->makeHash(date("d-Y-m").'8a*'.$user_id), 0, 100);

        return DB::table('recovery_account')->insert(
            [
                'id_user' => '' . $user_id . '',
                'akey' => '' . $key . '',
                'k_expired' => '' .date('Y-m-d H:i:s', strtotime('60 minute')). ''
            ]
        );

        return $key;

    }

    public function updatePass(Request $request){


        if( ($request->input('p_1') == $request->input('p_2')) && strlen($request->input('p_2')) >= 8){

            //echo strlen($request->input('p_2'));


            if($this->passUpdate($request->input('p_2'), $request->input('k')) == true){

                echo 'true';

            } else {

                echo 'false';
            }

        }

    }

    private function passUpdate($pass, $recovery_key){

        $row = DB::select('SELECT id_user FROM recovery_account WHERE akey=? limit 1;', [$recovery_key]);


        if (isset($row[0]->id_user)) {

            DB::table('users')
                ->where(['id' => $row[0]->id_user])
                ->limit(1)
                ->update([
                    'passw' => $this->makeHash($pass)
                ]);

            // to do: delete record in - recovery_account - ?

            return true;
        }

        return false;
    }

}
