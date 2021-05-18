let vid = document.getElementById("player");

function checkDuration() {

    if(fileValidation() === false){

        return;
    }

    setTimeout(function () {

        let msg;

        if ((vid.duration > 76 || vid.duration < 30) && vid.duration != 'Infinity') {

            msg = ' Duration should be 1 minute! Try again ... ';

            $('#player').css('display', '');

            $(".uploadToServer").addClass("d-none animated fadeInDown");

            alert(msg);

        } else if (vid.duration == 'Infinity') {


            msg = 'Just to be sure, we acceded video ~ 1 min length !';

            $(".uploadToServer").removeClass("d-none");

            alert(msg);

        } else {

            //msg = 'Duration is fine ';

            $(".uploadToServer").removeClass("d-none");

            $('.uploadToServer').hide().removeClass('animated fadeInDown');

            setTimeout(function () {

                $('.uploadToServer').addClass('animated fadeInDown').show();

            }, 200);
        }

        //alert( msg); // vid.duration + ' сек' +

    }, 500);

    //
    $('#player').show();
}


/**
 * https://www.codexworld.com/file-type-extension-validation-javascript/
 * @returns {boolean}
 */
function fileValidation(){

    var fileInput = document.getElementById('recorder');
    var filePath = fileInput.value;
    var allowedExtensions = /(\.mp4|\.qt|\.webm|\.avi|\.mov)$/i;


    if(!allowedExtensions.exec(filePath)){

        alert('Please upload video file only.');

        fileInput.value = '';

        return false;

    }
}
