<?php


namespace App\Http\Controllers;


use App\Service_model as SM;
use Illuminate\Http\Request;
use Session;

class ProfileServiceController extends Controller
{

    public function list()
    {

        // redirect if doesn't login
        if (!session('user_id')) {

            return redirect('/');
        }

        return view('/profile/service/list_edit',
            [
                'list' => SM::list()
            ]);

    }

    public function add(Request $request)
    {


        return SM::add($request);
    }

    public function edit()
    {


    }

    public function update(Request $request)
    {

        SM::updateService($request);
    }

    public function delete(Request $request)
    {

        SM::deleteService($request);
    }

    public function get(Request $request)
    {

        return SM::get($request->input('id'));
    }

    public function loadPortfolio(Request $request)
    {

        return SM::loadPortfolio($request);

    }

    public function portfolioServiceAttach(Request $request)
    {

        SM::portfolioServiceAttach($request);
    }

    public function portfolioServiceRemove(Request $request){

        SM::portfolioServiceRemove($request);
    }

}
