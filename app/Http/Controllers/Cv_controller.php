<?php

namespace App\Http\Controllers;


use App\Hr_model as HR;
use App\Worker_profile as WP;
use App\Vacancy_model as V;
use Illuminate\Http\Request;
use Session;

class Cv_controller extends Controller
{

    public function index()
    {

        // exit - if not recruiter
        if(session('profile') != '1'){

            return redirect('/');
        }

        $cvs = HR::cvs_list();
        $experiences = HR::getUsersExperiences($cvs);

        return view('/cv/index',
            [
                'CV' => $cvs,
                'experiences' => $experiences,
                'countries' => WP::getCountries(),
                'user' => WP::getProfile(),
                'city_search' => HR::getCityById()
            ]);
    }


    public function index_tmp()
    {

        // exit - if not recruiter
        if(session('profile') != '1'){

            return redirect('/');
        }

        $cvs = HR::cvs_list();
        $experiences = HR::getUsersExperiences($cvs);

        return array(
            [
                'CV' => $cvs,
                'experiences' => $experiences,
            ]);
    }


    public function view($id)
    {
        return view('/cv/view',
            [
                'CV' => HR::profile($id)
            ]);
    }

}
