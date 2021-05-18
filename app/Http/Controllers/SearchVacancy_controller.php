<?php


namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Main_page_model as MP;
use Session;
use Cookie;

class SearchVacancy_controller extends Controller
{
    public function index(Request $request)
    {
        if(empty(session('user_id'))){

            return MP::searchIfNoLogin($request);
        }

        return MP::searchVacancy($request);
    }

}
