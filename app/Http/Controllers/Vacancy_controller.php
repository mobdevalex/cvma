<?php

namespace App\Http\Controllers;

//use Dotenv\Validator;
use App\Vacancy_model as V;
use App\Worker_profile as WP;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Session;


class Vacancy_controller extends Controller
{

    /**
     * @param
     * POST
     *
     */
    public function apply(Request $request)
    {

        DB::table('jobs_applied')->insert(

            ['vid' => '' . trim($request->input('vid')) . '',
                'user_id' => '' . session('user_id') . '']
        );
    }

    public function vacancy($id)
    {
        $v = V::vacancyById($id);

        if (isset($v[0]->id)) {

            return view('/vacancy/by_id',
                [
                    'vacancy' => $v,
                    'suggestion_vacancy' => V::suggestionVacancy($v[0]->title, $v[0]->id)
                ]);

        } else {

            return abort(404);
        }
    }

    public function check_vcv(){

        return V::check_vcv();
    }

    public function offer_prepare(){

        if(session('profile') == '1'){

            return redirect('/hr/vacancies');
        }

        return view('/vacancy/offer_staff_prepare',
        [
            'countries' => WP::getCountries()
        ]);
    }

    public function check_companies_email_is_exists(Request $request){

        return V::companies_email_exists($request->input('email'));
    }

    public function save_public_vacancy_company(Request $request){

        V::save_vacancy($request);

        return;
    }
}
