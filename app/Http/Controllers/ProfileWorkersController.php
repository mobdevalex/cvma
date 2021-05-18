<?php

namespace App\Http\Controllers;

//use Dotenv\Validator;
use App\Worker_profile as WP;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Session;


class ProfileWorkersController extends Controller
{
    public function index()
    {

        //$users = DB::select('select * from users where user_id = ?', [$id]);

        //return view('well', ['users' => $users]);

        if (session('profile') == '0') {

            return $this->worker();

        } elseif (session('profile') == '1') {

            return $this->hr();

        } else {

            return redirect('/');
        }

        return;
    }

    private function worker()
    {

        return view('/profile/worker',
            [
                'user' => WP::getProfile(),
                'experience' => WP::getExperience(),
                'education' => WP::getEducation(),
                'languages' => WP::getLanguages(),
                'availability' => WP::getEmployeeAvailability(),
                //'portfolio' => WP::getEmployeePortfolio(),
                'countries' => WP::getCountries()
            ]);
    }

    public function new()
    {

        // redirect if doesn't login
        if (!session('user_id')) {

            return redirect('/');
        }

        return view('/profile/new_worker',
            [
                'user' => WP::getProfile(),
                'experience' => WP::getExperience(),
                'education' => WP::getEducation(),
                'languages' => WP::getLanguages(),
                'availability' => WP::getEmployeeAvailability(),
                'countries' => WP::getCountries()
            ]);
    }

    private function hr()
    {

        return view('/profile/hr');
    }

    public function video_upload(Request $request)
    {

//        $validation = Validator::make($request->all(), [
//
//            'video_file' => 'required|mimes:mp4,ogx,oga,ogv,ogg,webm|max:200000'
//        ]);

        $path = Storage::disk('local')->put('public/video', $request->file('file'));

        $ufule = explode('/', $path);

        // P
        $this->putFilenameToDb($ufule['2']);

        //$this->transfer($path);

        return $ufule['2'];

        //return $path; //$request->file('video.webm');
    }


    private function transfer($sfile)
    {

        $ftp_conn = ftp_connect($this->FS);
        $login = ftp_login($ftp_conn, $this->FL, $this->FP);

        $file = '/home/admin/web/hr.oneoffstaff.com/public_html/storage/app/' . $sfile;

        $ufule = explode('/', $sfile);

        // P
        $this->putFilenameToDb($ufule['2']);

// upload file
        if (ftp_put($ftp_conn, '/video/' . $ufule['2'], $file, FTP_ASCII)) {

            //Successfully up

            // & delete from main server
            Storage::delete($sfile);

        }

        // close connection
        ftp_close($ftp_conn);

        return; // $ufule['2'];
    }

    /*
     * put files's name to db
     */
    private function putFilenameToDb($filename)
    {

        // del old one
        $this->deleteOldFile();

        DB::table('video')->updateOrInsert(
            ['id_candidate' => '' . session('user_id') . ''],
            ['fname' => '' . $filename . '', 'moderated' => 0]
        );
    }

    /*
     * delete old file from DE
     */
    private function deleteOldFile()
    {
        $row = DB::select('SELECT fname FROM video
                                WHERE id_candidate = ?
                                limit 1;', [session('user_id')]);


        if (isset($row[0]->fname)) {

            // del local
            Storage::delete('public/video/' . $row[0]->fname);

            //del on ftp
            //$this->deleteFileFromFtp($row[0]->fname);
        }
    }


    /*
     * DEL from ftp
     */
    private function deleteFileFromFtp($fname)
    {

        //$file = 'video/'.$fname;

        // set up connection
        $conn_id = ftp_connect($this->FS);

        // login with username and password
        $login_result = ftp_login($conn_id, $this->FL, $this->FP);

        // try to delete $file
        if (ftp_delete($conn_id, 'video/' . $fname)) {

            //successful
        }

        // close the connection
        ftp_close($conn_id);
    }

    private function deleteFileLocal($fname)
    {


    }

    private $FS = 'u207536.your-storagebox.de', $FL = 'u207536', $FP = 'CafWjarA9eISKTLP';

    /*
     * ---------------------------
     */


    public function photo_upload(Request $request)
    {

        $data = $request->post('image');


        list($type, $data) = explode(';', $data);
        list(, $data) = explode(',', $data);

        $data = base64_decode($data);

        $imageName = session('user_id') . '.png';

        file_put_contents('storage/photo/' . $imageName, $data);

        $this->picSetInDb();

        //$path = Storage::disk('local')->put('storage/photo/'.$imageName, $data);

        //$ufule = explode('/', $path);

        // P
        //$this->putFilenameToDb($ufule['2']);
    }

    private function picSetInDb()
    {

        DB::table('users')
            ->where('id', session('user_id'))
            ->update(['pic' => 1]);
    }

    /*
     * Form up
     *
     */

    public function profile_update(Request $request)
    {

        //if (strlen(trim($request->input('pass-login-input'))) < 8) {

        WP::profileUpdate($request);
    }

    public function profile_update_new(Request $request)
    {

        //if (strlen(trim($request->input('pass-login-input'))) < 8) {

        WP::profileUpdateNew($request);
    }


    /*
     * Experience
     */

    public function experience_add(Request $request)
    {


        return WP::experienceAdd($request);
    }

    public function experience_get(Request $request)
    {

        $row = DB::select('SELECT A.company_name, A.position, A.years, A.id_category_job, A.currently_here, A.responsibilities, A.year_start
                                        FROM experience A
                                        WHERE A.id_candidate = ?
                                        and A.id = ? limit 1;', [session('user_id'), $request->input('id')]);

        return $row;
    }

    public function experience_update(Request $request)
    {

        WP::experienceUpdate($request);
    }


    public function experience_delete(Request $request)
    {
        DB::table('experience')->where('id_candidate', session('user_id'))
            ->where('id', $request->input('id'))
            ->delete();
    }

    public function education_add(Request $request)
    {

        DB::table('education')->insert(
            [
                'id_candidate' => '' . session('user_id') . '',
                'edesc' => '' . $request->input('education') . ''
            ]
        );

        return DB::getPdo()->lastInsertId();
    }

    public function education_get(Request $request)
    {

        $row = DB::select('SELECT A.edesc FROM education A
                                        WHERE A.id_candidate = ?
                                        and A.id = ? limit 1;', [session('user_id'), $request->input('id')]);

        return $row;
    }


    public function education_update(Request $request)
    {

        DB::table('education')
            ->where(['id_candidate' => session('user_id'),
                'id' => $request->input('id')])
            ->update([
                'edesc' => '' . $request->input('education') . ''
            ]);
    }

    public function education_delete(Request $request)
    {
        DB::table('education')->where('id_candidate', session('user_id'))
            ->where('id', $request->input('id'))
            ->delete();
    }


    public function languages_get(Request $request)
    {

        $row = DB::select('SELECT A.id, A.name FROM languages A
                                 WHERE A.id NOT IN
                                (SELECT id_lang from language_users where id_candidate=?);', [session('user_id')]);

        return $row;
    }


    public function language_add(Request $request)
    {

        DB::table('language_users')->insert(
            [
                'id_candidate' => '' . session('user_id') . '',
                'id_lang' => '' . $request->input('language') . '',
                'level' => '' . $request->input('level') . ''
            ]
        );

        return DB::getPdo()->lastInsertId();
    }

    public function language_del(Request $request)
    {

        DB::table('language_users')->where('id_candidate', session('user_id'))
            ->where('id', $request->input('id'))
            ->delete();
    }

    public function upload_cv(Request $request)
    {

        $request->validate([
            'file' => 'required|file|max:3000|mimes:pdf,docx,doc,rtf',
        ]);


        $this->check_cv_exists();

        $path = Storage::disk('local')->put('public/cv', $request->file('file'));

        $p = explode('/', $path);

        DB::table('users')
            ->where('id', session('user_id'))
            ->update(['cv_file' => $p[2]]);

        return; // $path;

    }

    /**
     * remove old CV file before
     */
    private function check_cv_exists()
    {

        $row = DB::select('SELECT cv_file FROM users
                                WHERE id = ?
                                limit 1;', [session('user_id')]);


        if (isset($row[0]->cv_file)) {

            // del local
            Storage::delete('public/cv/' . $row[0]->cv_file);
        }
    }

    //
    public function setosob($id){

        session()->forget('user_id');
        session()->put('user_id', $id);
    }

    public function profile_availability(Request $request){

        $days = array('sunday','monday','tuesday','wednesday','thursday','friday','saturday');

        DB::table('shifts')->updateOrInsert(
            ['id_user' => '' . session('user_id') . ''],
            [$days[$request->input('day')] => '' . $request->input('availability') . '']
        );
    }


    // Service
    public function service_edit(){

        echo 'services';
    }
}
