<?php


namespace App\Http\Controllers;

use App\Public_profile as PP;
use App\Worker_profile as WP;
use Illuminate\Http\Request;
use Session;

class PortfolioPublicController extends Controller
{

    public function index($id)
    {

        $portfolio_id = PP::getPortfolioById($id);


        if (isset($portfolio_id[0]->id_user)) {

            return view('/profile_public/portfolio_item',
                [
                    'user' => PP::getProfile($portfolio_id[0]->id_user),
                    'portfolio' => $portfolio_id,
                    'count_likes' => PP::countLikeById($id),
                    'doYouLike' => PP::didYouLike($id),
                    'views' => PP::incrementView($id) // // view +1
                ]);
        } else {

            return redirect('/');
        }
    }

    public function like(Request $request){

        PP::like($request->input('id'));
        return;
    }

    public function like_remove(Request $request){

        PP::like_remove($request->input('id'));
        return;
    }

    public function portfolio_list(){

        // redirect if doesn't login
        if (!session('user_id')) {

            return redirect('/');
        }


        return view('/profile/portfolio/list',
            [

                'experience' => WP::getExperience(),
                'portfolio' => WP::getEmployeePortfolio()
            ]);
    }

}
