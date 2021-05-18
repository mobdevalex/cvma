<?php
namespace App\Http\Controllers;

//use Dotenv\Validator;
use App\Main_page_model as MP;
//use Illuminate\Http\Request;
//use Illuminate\Support\Facades\DB;
//use Illuminate\Support\Facades\Storage;
use Session;



class Main_controller extends Controller
{
    public function index()
    {
        return view('welcome', [
            'vacancies' => MP::getVacancy()
        ]);
    }
}
