<?php

namespace App\Http\Controllers;

use App\Main_page_model as MP;
//use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Session;

class WellController extends Controller
{

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index($id)
    {
        return view('well', [
            'users' => MP::getUser($id)
        ]);
    }

    public function support(Request $request)
    {

        if (trim($request->input('question')) != '') {


            DB::table('support')->insert(

                [
                    'user_id' => '' . session('user_id') . '',
                    'name' => '' . trim($request->input('name')) . '',
                    'email' => '' . trim($request->input('email')) . '',
                    'question' => '' . trim($request->input('question')) . ''
                ]
            );
        }
    }

}
