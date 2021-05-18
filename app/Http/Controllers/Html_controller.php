<?php

namespace App\Http\Controllers;

/**
 * For content: privacy, T&C ...
 */

//use App\Hr_model as HR;
//use App\Worker_profile as WP;
//use App\Vacancy_model as V;
//use Illuminate\Http\Request;
use Session;

class Html_controller extends Controller
{

    public function index($file_name)
    {
        if(\View::exists('/html/' . $file_name)){

            return view('/html/' . $file_name);
        }

        return abort(404);
    }

}
