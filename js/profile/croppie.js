$uploadCrop = $('#upload-demo').croppie({

    enableExif: true,

    viewport: {
        width: 150,
        height: 150,
        type: 'circle'
    },


    boundary: {
        width: 280,
        height: 280
    }

});


$('#upload').on('change', function () {

    let reader = new FileReader();

    $('.upload-result').removeClass('d-none')

    reader.onload = function (e) {

        $uploadCrop.croppie('bind', {

            url: e.target.result

        }).then(function () {

            //console.log('jQuery bind complete');
        });
    }

    reader.readAsDataURL(this.files[0]);
});


$('.upload-result').on('click', function (ev) {

    $uploadCrop.croppie('result', {

        type: 'canvas',
        size: 'viewport'

    }).then(function (resp) {


        $.ajax({

            url: "/ajax/upload_photo",

            type: "POST",

            data: {"image": resp},

            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },

            success: function (data) {

                html = '<img class="mt-5" src="' + resp + '" />';

                //$("#upload-demo-i").html(html);

                $('#profile_img').html(html);
                $('#photo_upload').modal('hide');

                // next slide - new profile
                $('#Wbutton_next').click();

            }
        });

    });

});
