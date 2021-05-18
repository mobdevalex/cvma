$(document).on("click hover", '#uploadVideo', function () {

    $('#spin_upload').html(' <br>uploading, please wait <img src="/img/spin.gif">').fadeIn();
    $("#uploadVideo").attr("disabled", true);
    $('.create_video_button').text('Try again')

    let formData = new FormData();
    formData.append('file', $('#recorder')[0].files[0]);

    $.ajax({
        type: "POST",
        url: "/ajax/upload_video",

        data : formData,

        processData: false,
        contentType: false,

        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },

        //dataType: "json",
        success: function (data) {

            //$('#spin_upload').html(' success! ');
            $("#spin_upload").html(' &nbsm; uploaded! '); // .delay("slow").fadeOut()


            $("#uploadVideo").attr("disabled", false);

            $("#uploadVideo").hide();

            let video = document.getElementById('profiles_video');
            video.src = '/storage/video/' + data;

            $('#profiles_video').removeClass('d-none');

            // video_upload
            $('#video_upload').modal('hide');

            // to do
            //console.log('success')

            // next slide - new profile
            $('#Wbutton_next').click();
        },

        error: function () {

            alert('Error: try again');
            $("#spin_upload").html(' fail, try again ').addClass('text-danger');

            $("#uploadVideo").attr("disabled", false);

            // to do detect - fail ...
        }
    });

    //console.log('click')
});
