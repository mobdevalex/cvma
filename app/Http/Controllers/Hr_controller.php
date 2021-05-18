<?php

namespace App\Http\Controllers;


use App\Hr_model as HR;
use App\Worker_profile as WP;
use App\Vacancy_model as V;
use Illuminate\Http\Request;
use Session;


class Hr_controller extends Controller
{

    public function index()
    {
        return view('/hr/index');
    }

    public function profile()
    {
        return view('/hr/profile',
            [
                //'user' => HR_add_vacancy::profile()
                'user' => WP::getProfile(),
                'countries' => WP::getCountries()
            ]);
    }

    public function vacancies()
    {
        return view('/hr/vacancies',
            [
                //'user' => HR_add_vacancy::profile()
                'user' => WP::getProfile(),
                'vacancies' => V::getAll()
            ]);
    }

    public function add_vacancy(Request $request)
    {

        return V::add($request);
    }

    public function get_hr_vacancy(Request $request)
    {

        return V::getById($request);
    }

    public function update_hr_vacancy(Request $request){

        return V::update_hr_vacancy($request);
    }

    public function delete_hr_vacancy(Request $request){

        return V::delete_hr_vacancy($request);
    }

    public function load_vacancies(){

        return V::load_vacancies();
    }

    public function load_invitation_dates(Request $request){

        return V::load_invitation_dates($request);
    }

    public function invitation_send(Request $request){

        return V::invitation_send($request);
    }

}
