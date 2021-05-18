function vacancy_apply(id) {

    $(".applyJob_button_" + id).dblclick(false);

    $.ajax({
        type: "POST",
        url: "/ajax/vacancy/apply",

        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },

        data: {
            vid: id
        },

        success: function (data) {


            //if (data.toString() == 'ok') {

            $(".applyJob_button_" + id).attr("disabled", true);
            $(this).removeClass("job_apply");

            $(".applyJob_button_" + id).removeClass("btn-outline-primary");
            $(".applyJob_button_" + id).addClass("btn-outline-success");

            $(".applyJob_button_" + id).text('applied');
            //}

            // delete cookies - attempt_to_apply
            document.cookie = "attempt_to_apply=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

        },

        error: function () {

            $(".applyJob_button_" + id).attr("disabled", false);
            alert('Error');
        }

    });
}

function isVideoExists() {

    let status;

    $.ajax({
        type: "POST",
        url: "/ajax/check_vcv",
        async: false,

        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },

        success: function (data) {


            if (data.toString() == 'false') {

                alert('Could you create/upload CV');

                setTimeout(function () {
                    window.location.href = "/new_profile";
                }, 500);

                status = false;

            } else {

                status = true;
            }

        },

        error: function () {
            alert('Error');
        }

    });


    return status;
}
