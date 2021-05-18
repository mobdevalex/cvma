

function phoneVideoButton(){//id

    $('#video_upload').modal('show')

    $('#add_video').html('<input type="file" class="btn btn-outline-primary" accept="video/*;image/*" onchange="checkDuration()" id="recorder" capture="environment" required>'); // ' + id + '

    // hide button + click
    $('#recorder').css('display', 'none');
    $('#recorder').click();

    // for check duration
    let recorder = document.getElementById('recorder');
    let player = document.getElementById('player');

    recorder.addEventListener('change', function(e) {

        let file = e.target.files[0];
        // Do something with the video file.
        player.src = URL.createObjectURL(file);

    });
}


