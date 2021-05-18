<?php


namespace App\Http\Controllers;

use App\Invitation_model as IM;
use Illuminate\Http\Request;
use Session;

class InvitationController extends Controller
{

    public function index()
    {
        if (empty(session('user_id'))) {

            return redirect('/');
        }


        if (session('profile') == '0') {

            //$this->invitations = IM::worker();

            return view('/invitation/worker',
                [
                    'invitations' => IM::worker()
                ]);

        } else {

            return view('/invitation/hr',
                [
                    'invitations' => IM::hr()
                ]);
        }


    }

    public function decline(Request $request){

        return IM::decline($request);
    }

    public function accept(Request $request){

        return IM::accept($request);
    }


}
