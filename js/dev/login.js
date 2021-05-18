// login
$(document).on("click hover", '#loginCmdButton', function () {

    var me = $('#' + $(this).closest("form").attr("id"));

    $("#loginCmdButton").attr("disabled", true);

    $.ajax({
        type: "POST",
        url: "/ajax/login",
        async: true,
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },

        data: me.serialize() + '&' + $.param({'Page': window.location.href}),  // $.post("page.php",( $('#myForm').serialize()+'&'+$.param({ 'wordlist': wordlist })));

        //dataType: "json",
        success: function (data) {

            $("#loginCmdButton").attr("disabled", false);

            if (data === 'false') {

                $('.form-login-error').hide().text('Error: fill form carefully').fadeIn();

                return;
            }


            //$('#formLogin').html(data + ', you have logged in <hr> <a href="/#postStuff" onClick="reloadAddStuff();" class="btn btn-block btn-primary">Would you like to post a stuff?</a> ');
            $('.form-login-error').text('');

            //$('#login_place').html('<button class="btn btn-light btn-sm">' + data + '</button>');

            // to do: link to profile
            let linkToProfile = ' <a id="profile_link" href="'+(data[1] == 0 ? '/profile' : '/hr') + '">📙</a>';

            $('#loginModal').modal('hide');
            $('#login_place').html('Hi ' + data[0] + '! ' + linkToProfile);
            $('#login_place').addClass('animated fadeInDown')

            $('#signUp_place').remove()

            $('.button_login').remove()

        },
        error: function () {

            alert('Error: try again');

            $("#loginCmdButton").attr("disabled", false);

        }
    });
});


function reloadAddStuff() {

    window.location.href = "/#postStuff";
    window.location.reload();
}

// PASS event
// Get the input
var input_password = document.getElementById("password-input");

// Execute a function when the user releases a key on the keyboard
input_password.addEventListener("keyup", function (event) {

    let code = false;

    if (event.key !== undefined) {

        code = event.key;

    } else if (event.keyIdentifier !== undefined) {

        code = event.keyIdentifier;

    } else if (event.keyCode !== undefined) {

        code = event.keyCode;
    }

    // Cancel the default action, if needed
    //event.preventDefault();

    // Number 13 is the "Enter" key on the keyboard
    if (code == 'Enter' || code === 13) {
        // Trigger the button element with a click

        document.getElementById("loginCmdButton").click();
    }
});

// end pass


// activate tab - sign Up
$(document).on("click hover", '#login_place', function () {

    //$('#loginModal').modal('show');
    $('.nav-link[href="#home"]' ).trigger('click');
});



function isLoggedIn() {



    let status;

    $.ajax({
        type: "POST",
        url: "/ajax/login/check",
        async: false,

        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },

        success: function (data) {


            if (data.toString() == 'false') {


                $('#loginModal').modal('show');

                // focus to email
                setTimeout(function () {

                    $('input[name=email-login-input]').focus();

                    //console.log('focused')
                }, 500);

                status = false;

            } else {

                status = true;
            }

        },

        error: function () {
            alert('Error: need to login');
        }

    });


    return status;
}


