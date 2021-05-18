class stages_wProfile {

    constructor() {

        // this.contacts();
        //
        // this.availability();

        this.next();

        this.fuul_time_button();

    }


    next() {


        $(document).on("click hover", '#Wbutton_next', function () {


            let st = 0;


            $(new_users_blocks).each(function (index, element) {

                if ($('#' + element).is(':visible')) {

                    st = index
                }

                $('#' + new_users_blocks[index]).addClass('d-none');

                // reset focus
                $('.btn').blur();
            });

            // show next slide
            $('#' + new_users_blocks[st + 1]).removeClass('d-none');

            //console.log(st + ' - ' + new_users_blocks[st])


            // if (st == 0) {
            //
            //     $('#' + new_users_blocks[st]).removeClass('d-none');
            //
            // }


            // if CV loaded - go to stage photo
            if (st == 3 || st == 4) {

                if ($('.custom-file-cv').text() !== 'Attach CV') {

                    $('#Wbutton_next').click();
                }
            }


            if (st == 6) {

                $('#Wbutton_next').text('Almost finish >>> ')
            }


            if (st == '7') {

                $('#Wbutton_next').text('DONE!')
            }

            if (st == '8') {

                $('#Wbutton_next').text('Now you can start applying ... ').addClass('animated wow fadeInUp')

                //fbq('track', 'CompleteRegistration');
            }

            if (st == '9') {

                $('#Wbutton_next').hide();

                setTimeout(function () {

                    // if was attempt to apply vacancy
                    if (getCookie('attempt_to_apply') != '') {

                        window.location.href = getCookie('attempt_to_apply');

                    } else {

                        window.location.href = "/";
                    }

                }, 500);
            }

        });

    }

    next_ON() {

        $('#Wbutton_next').removeClass('d-none');
    }

    next_OFF() {

        $('#Wbutton_next').addClass('d-none')
    }

    fuul_time_button(){

        $(document).on("click hover", '.full_time_button', function () {

            $('#Wbutton_next').click();
        });
    }


}

//                      'block_contacts',
let new_users_blocks = ['block_availability', 'block_toDo_most', 'block_attach_cv', 'block_languages', 'block_experience', 'block_education', 'block_shift', 'block_photo', 'block_video', 'block_praise']

const new_profile_stages = new stages_wProfile();
