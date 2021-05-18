<?php


namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Session;


class PortfolioController extends Controller
{

    public function photo_upload(Request $request)
    {

        // https://stackoverflow.com/questions/42755302/laravel-5-4-upload-image
        $this->validate(request(), [
            'file' => 'required|image|mimes:jpeg,png,jpg|max:10240',
        ]);

        $name = null;

        if ($request->hasFile('file')) {

            $image = $request->file('file');

            // uniqid().File::extension($image->getClientOriginalName());
            $name = session('user_id') . time() . '.' . $image->getClientOriginalExtension();
            $destinationPath = public_path('/storage/portfolio/');
            $image->move($destinationPath, $name);
        }


        //Is only one file uploaded so it ok to use it with $uploader_response[0].
        //$img_path = '/storage/portfolio/' . $name;

        $resize = new ResizeImage('storage/portfolio/' . $name);
        $resize->resizeTo(1024, 1024);
        $resize->saveImage('storage/portfolio/' . $name);


        // delete old
        $this->delete_photo($request->input('ofile'));


        //update img in DB
        if (!empty($request->input('id'))) {

            DB::table('portfolio')
                ->where('id', $request->input('id'))
                ->where('id_user', session('user_id'))
                ->limit(1)
                ->update([
                    'pfile' => $name,
                ]);
        }

        return $name;
    }

    private function delete_photo($fname)
    {

        if (isset($fname)) {

            Storage::delete('/public/portfolio/' . $fname);
        }
    }

    public function insert(Request $request)
    {

        DB::table('portfolio')->insert(
            [
                'id_user' => '' . session('user_id') . '',
                'id_experience' => '' . $request->input('experience_id') . '',
                'title' => '' . $request->input('title') . '',
                'pdesc' => '' . $request->input('description') . '',
                'pfile' => '' . $request->input('img') . ''
            ]
        );

        return DB::getPdo()->lastInsertId();
    }

    /**
     * Load
     *
     * @param Request $request
     * @return array
     */
    public function loadById(Request $request)
    {

        return DB::select('SELECT id_experience, title, pdesc, pfile  FROM portfolio
                                        WHERE id_user = ? and id=? ;', [session('user_id'), $request->input('id')]);
    }

    /**
     * Update by id
     *
     * @param Request $request
     */
    public function update(Request $request)
    {


        DB::table('portfolio')
            ->where('id', $request->input('id'))
            ->where('id_user', session('user_id'))
            ->limit(1)
            ->update([
                'title' => $request->input('title'),
                'id_experience' => $request->input('experience_id'),
                'pdesc' => $request->input('description'),
                'pfile' => $request->input('img'),
            ]);
    }

    public function delete(Request $request)
    {

        $affected = DB::table('portfolio')->where('id_user', session('user_id'))
            ->where('id', $request->input('id'))
            ->limit(1)
            ->delete();

        if ($affected == '1') {

            if (!empty($request->input('img'))) {

                Storage::delete('/public/portfolio/' . $request->input('img'));
            }

            return; // $affected
        }

        return;
    }
}


/**
 * Resize image class will allow you to resize an image
 *
 * Can resize to exact size
 * Max width size while keep aspect ratio
 * Max height size while keep aspect ratio
 * Automatic while keep aspect ratio
 */
class ResizeImage
{
    private $ext;
    private $image;
    private $newImage;
    private $origWidth;
    private $origHeight;
    private $resizeWidth;
    private $resizeHeight;

    /**
     * Class constructor requires to send through the image filename
     *
     * @param string $filename - Filename of the image you want to resize
     */
    public function __construct($filename)
    {
        if (file_exists($filename)) {
            $this->setImage($filename);
        } else {
            throw new Exception('Image ' . $filename . ' can not be found, try another image.');
        }
    }

    /**
     * Set the image variable by using image create
     *
     * @param string $filename - The image filename
     */
    private function setImage($filename)
    {
        $size = getimagesize($filename);
        $this->ext = $size['mime'];
        switch ($this->ext) {
            // Image is a JPG
            case 'image/jpg':
            case 'image/jpeg':
                // create a jpeg extension
                $this->image = imagecreatefromjpeg($filename);
                break;
            // Image is a GIF
            case 'image/gif':
                $this->image = @imagecreatefromgif($filename);
                break;
            // Image is a PNG
            case 'image/png':
                $this->image = @imagecreatefrompng($filename);
                break;
            // Mime type not found
            default:
                throw new Exception("File is not an image, please use another file type.", 1);
        }
        $this->origWidth = imagesx($this->image);
        $this->origHeight = imagesy($this->image);
    }

    /**
     * Save the image as the image type the original image was
     *
     * @param String[type] $savePath     - The path to store the new image
     * @param string $imageQuality - The qulaity level of image to create
     *
     * @return Saves the image
     */
    public function saveImage($savePath, $imageQuality = "70", $download = false)
    {
        switch ($this->ext) {
            case 'image/jpg':
            case 'image/jpeg':
                // Check PHP supports this file type
                if (imagetypes() & IMG_JPG) {
                    imagejpeg($this->newImage, $savePath, $imageQuality);
                }
                break;
            case 'image/gif':
                // Check PHP supports this file type
                if (imagetypes() & IMG_GIF) {
                    imagegif($this->newImage, $savePath);
                }
                break;
            case 'image/png':
                $invertScaleQuality = 9 - round(($imageQuality / 100) * 9);
                // Check PHP supports this file type
                if (imagetypes() & IMG_PNG) {
                    imagepng($this->newImage, $savePath, $invertScaleQuality);
                }
                break;
        }
        if ($download) {
            header('Content-Description: File Transfer');
            header("Content-type: application/octet-stream");
            header("Content-disposition: attachment; filename= " . $savePath . "");
            readfile($savePath);
        }
        imagedestroy($this->newImage);
    }

    /**
     * Resize the image to these set dimensions
     *
     * @param int $width - Max width of the image
     * @param int $height - Max height of the image
     * @param string $resizeOption - Scale option for the image
     *
     * @return Save new image
     */
    public function resizeTo($width, $height, $resizeOption = 'default')
    {
        switch (strtolower($resizeOption)) {
            case 'exact':
                $this->resizeWidth = $width;
                $this->resizeHeight = $height;
                break;
            case 'maxwidth':
                $this->resizeWidth = $width;
                $this->resizeHeight = $this->resizeHeightByWidth($width);
                break;
            case 'maxheight':
                $this->resizeWidth = $this->resizeWidthByHeight($height);
                $this->resizeHeight = $height;
                break;
            default:
                if ($this->origWidth > $width || $this->origHeight > $height) {
                    if ($this->origWidth > $this->origHeight) {
                        $this->resizeHeight = $this->resizeHeightByWidth($width);
                        $this->resizeWidth = $width;
                    } else if ($this->origWidth < $this->origHeight) {
                        $this->resizeWidth = $this->resizeWidthByHeight($height);
                        $this->resizeHeight = $height;
                    }
                } else {
                    $this->resizeWidth = $width;
                    $this->resizeHeight = $height;
                }
                break;
        }
        $this->newImage = imagecreatetruecolor($this->resizeWidth, $this->resizeHeight);
        imagecopyresampled($this->newImage, $this->image, 0, 0, 0, 0, $this->resizeWidth, $this->resizeHeight, $this->origWidth, $this->origHeight);
    }

    /**
     * Get the resized height from the width keeping the aspect ratio
     *
     * @param int $width - Max image width
     *
     * @return Height keeping aspect ratio
     */
    private function resizeHeightByWidth($width)
    {
        return floor(($this->origHeight / $this->origWidth) * $width);
    }

    /**
     * Get the resized width from the height keeping the aspect ratio
     *
     * @param int $height - Max image height
     *
     * @return Width keeping aspect ratio
     */
    private function resizeWidthByHeight($height)
    {
        return floor(($this->origWidth / $this->origHeight) * $height);
    }
}

