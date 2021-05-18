<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Session;
use Cookie;

class AreaController extends Controller
{
    public function index(Request $request)
    {
        if (!filter_var($request->input('email-login-input'), FILTER_VALIDATE_EMAIL)) {

            return 'false';
        }
    }

    //TO DO
    //State Abbreviations
    //https://www.50states.com/abbreviations.htm
    public function ip(Request $request)
    {

        /**
         *  Оставим в покое на dev - ipinfo
         */
        if ($request->getHost() == 'localhost') {

            session()->put('city', 'Edinburgh');
            session()->put('country', 'GB');

            return array('GB', 'Edinburgh', 'Scotland');
        }

        if ($request->ajax()) {

            $json = file_get_contents('http://ipinfo.io/' . $request->ip() . '/json'); // '.$this->get_ip().'  // ' . $this->input->ip_address() . '

        }

//        $json = '
//{
//  "ip": "206.225.134.122",
//  "city": "Manhattan",
//  "region": "California",
//  "country": "US",
//  "loc": "34.0584,-118.2780",
//  "postal": "90017",
//  "org": "AS63008 Contina"
//}';


        $a = json_decode($json);

        if (isset($a->city)) {

            if ($a->country == 'US') {

                $a->region = $this->regionUs($a->region);

                session()->put('region', $a->region);

                //cookie
                Cookie::make('region', $a->region);
            }


            session()->put('city', $a->city);
            session()->put('country', $a->country);

            //cookie
            Cookie::make('country', $a->city);

            return array($a->country, $a->city, $a->region);
        }

        return 'false';
    }

    /**
     * @param $region
     * @return string
     */
    private function regionUs($region)
    {

        $a = array("Alabama" => "AL",
            "Alaska" => "AK",
            "Arizona" => "AZ",
            "Arkansas" => "AR",
            "California" => "CA",
            "Colorado" => "CO",
            "Connecticut" => "CT",
            "Delaware" => "DE",
            "Florida" => "FL",
            "Georgia" => "GA",
            "Hawaii" => "HI",
            "Idaho" => "ID",
            "Illinois" => "IL",
            "Indiana" => "IN",
            "Iowa" => "IA",
            "Kansas" => "KS",
            "Kentucky" => "KY",
            "Louisiana" => "LA",
            "Maine" => "ME",
            "Maryland" => "MD",
            "Massachusetts" => "MA",
            "Michigan" => "MI",
            "Minnesota" => "MN",
            "Mississippi" => "MS",
            "Missouri" => "MO",
            "Montana" => "MT",
            "Nebraska" => "NE",
            "Nevada" => "NV",
            "New Hampshire" => "NH",
            "New Jersey" => "NJ",
            "New Mexico" => "NM",
            "New York" => "NY",
            "North Carolina" => "NC",
            "North Dakota" => "ND",
            "Ohio" => "OH",
            "Oklahoma" => "OK",
            "Oregon" => "OR",
            "Pennsylvania" => "PA",
            "Rhode Island" => "RI",
            "South Carolina" => "SC",
            "South Dakota" => "SD",
            "Tennessee" => "TN",
            "Texas" => "TX",
            "Utah" => "UT",
            "Vermont" => "VT",
            "Virginia" => "VA",
            "Washington" => "WA",
            "West Virginia" => "WV",
            "Wisconsin" => "WI",
            "Wyoming" => "WY");

        return $a[$region];
    }

    public function loadCity(Request $request)
    {

        session()->put('country', $request->input('country'));

        // US
        if (session('country') == 'US') {

            $rows = DB::select('SELECT DISTINCT city, region FROM `city`
                                        WHERE country=\'' . session('country') . '\' and city!=\'\' and city like \'' . $request->input('search') . '%\' limit 10;');

        } else {

            $rows = DB::select('SELECT DISTINCT city FROM `city`
                                      WHERE country=? and city!=\'\' and city like ? limit 10;', [$request->input('country'), $request->input('search').'%']);
        }

        return $rows;
    }

    public function setCityAndRegion(Request $request)
    {
        session()->put('city', $request->input('city'));

        // get city
        $id = DB::select('SELECT id FROM city WHERE country = ? and city =  ? limit 1;', [session('country'), $request->input('city')]);



        // update users profile
        if (session('user_id') > 0 && $request->input('set_city') != 'false') {

            session()->put('city_id', $id[0]->id);


            DB::table('users')
                ->where(['id' => session('user_id')])
                ->update([
                    'city_id' => '' . $id[0]->id . ''
                ]);
        }

        if (session('country') == 'US') {

            session()->put('region', $request->input('region'));
        }

        return $id[0]->id;
    }
}
