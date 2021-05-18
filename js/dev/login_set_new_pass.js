class Login_set_new_pass {

    constructor() {

        this.check_first_pass();

        this.save();
    }

    check_first_pass() {

        let check = false;

        $(".passFormControlInput").bind('input', function (e) {



            let p_1 = $("#passFormControlInput1").val()
            let p_2 = $("#passFormControlInput2").val()

            //console.log(p_1.localeCompare(p_2))

            // p_1.localeCompare(p_2) == 0

            if ( p_1 == p_2 && (p_1.length >= 8 && p_1.length <= 20) ) {

                check = true;

            } else {

                check = false
            }



            if (check == true) {

                $('#save_recover_pass').removeAttr("disabled").fadeIn()

                $('#save_recover_pass').removeClass('d-none')

            } else {

                $('#save_recover_pass').attr("disabled", true).fadeOut()
            }


        });

        return check;
    }

    save() {

        $(document).on("click hover", '#save_recover_pass', function () {

            //console.log('sdfsdf + 1')

            login_set_new_pass.save_call()
        });


    }

    save_call() {

        // send ajax
        $.ajax({
            type: "POST",
            url: "/ajax/save-new-pass",

            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },

            data: {
                p_1: $("#passFormControlInput1").val(),
                p_2: $("#passFormControlInput2").val(),
                k: $('#recovery_key').val()
            },

            success: function (data) {

                if (data == 'true') {

                    $('.recovery_save_form').text('Saved!')


                } else if (data == 'false') {

                    //
                }
            },

            error: function () {

            }
        });
    }

}

const login_set_new_pass = new Login_set_new_pass();
