// login
$(document).on("click hover", '#signupCmdButton', function () {

    //$('#english_courses_full').addClass("animated slideOutRight");

    let me = $('#' + $(this).closest("form").attr("id")) //$("#form-first");


    $.ajax({
        type: "POST",
        url: "/ajax/signup",
        async: true,
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },

        data:  me.serialize() + '&' + $.param({'Page': window.location.href}),  // $.post("page.php",( $('#myForm').serialize()+'&'+$.param({ 'wordlist': wordlist })));

        //dataType: "json",
        success: function (data) {

            if(data==='false'){


                $('.form-signup-error').hide().text('Error: fill form carefully').fadeIn();
                return;
            }

            if(data == 'email_exists'){

                $('.form-signup-error').hide().text('Error: email exists').fadeIn();
                return;
            }

            //$('#formSignup').html('success, now you can login');
            $('#signupCmdButton').attr("disabled", true);

            $('.form-signup-error').text('');

            signup.fillLogin();

            /*
             relocete to worker's profile
             */
            if(data == '0'){

                signup.relocateToWorkerProfile();

            } else {

                signup.relocateToHrProfile()
            }

        }
        ,
        error: function () {
            alert('Error: try again'); // dsfsdfsdf
        }
    });
});

// activate tab forgotten_account
$(document).on("click hover", '.forgotten_account', function () {

    $('.nav-link[href="#forgot"]' ).trigger('click').show();
});


// activate tab - sign Up
$(document).on("click hover", '#signUp_place', function () {


    $('#loginModal').modal('show');
    $('.nav-link[href="#profile"]' ).trigger('click');
});

class signUp{

    // after susses registration we will fill form and after login
    fillLogin(){

        $('#formLogin input[name=email-login-input]').val( $('input[name=email-input]').val() );
        $('#formLogin input[name=pass-login-input]').val( $('input[name=password-input]').val() );

        $('#loginCmdButton').click();
    }

    relocateToWorkerProfile(){

        setTimeout(function () {

            window.location.href = '/new_profile';

        }, 500);
    }

    relocateToHrProfile(){

        setTimeout(function () {

            window.location.href = '/hr';

        }, 500);
    }
}

const signup = new signUp();
