class Login_Forgot{

    constructor() {

        this.check();
        this.submit_click();
    }

    check(){

        $("#email-forgot-input").bind('input', function (e) {

            let valid = isEmail(this.value)

            if(valid == false){

                $("#email-forgot-input").addClass('is-invalid')

            } else if (valid == true){

                $("#email-forgot-input").removeClass('is-invalid')
                $('.email-forgot-mark').text('')

                //console.log(valid)
            }

            return valid;
        });

        // if right syntax


        // if exist

        // if ok - send
    }

    submit_click(){

        $(document).on("click hover", '#forgotCmdButton', function () {

            if(isEmail($("#email-forgot-input").val()) == true){

                //console.log('clicked')

                // send request: true / false

                login_forgot.send_check();

            } else {

                $('.email-forgot-mark').text('error')
            }


        });
    }

    send_check(){

        // send ajax
        $.ajax({
            type: "POST",
            url: "/ajax/send-forgot-email",

            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },

            data: {
                email: $("#email-forgot-input").val()
            },

            success: function (data) {

                if (data == 'doesnt_exist') {

                    $('.email-forgot-mark').text('account with this email does not exist')
                    $("#email-forgot-input").val('')

                } else if (data == 'true') {

                    $('.email-forgot-mark').text('check email')

                    $('input[name="email-login-input"]').val($("#email-forgot-input").val())
                }
            },

            error: function () {

            }
        });
    }
}

const login_forgot = new Login_Forgot();
