class Profile_form {

    constructor() {

        // first name
        this.edit_field('profile_first_name', 'first_name_saved');

        // second name
        this.edit_field('profile_second_name', 'second_name_saved');

        this.edit_phone();

        // email
        this.edit_field('profile_email', 'email_saved');

        this.edit_availability();

        // about you
        this.edit_field('profile_about_you', 'aboutYou_saved');

        // business name
        this.edit_field('profile_business_name', 'business_name_saved');

        // address
        this.edit_field('profile_address', 'address_saved');

        // postcode
        this.edit_field('profile_postcode', 'postcode_saved');
    }


    edit_phone() {

        $('#phone_number').on('input', function () {

            // del letters
            let res = $('#phone_number').val().replace(/[^\d\+()\-]/g, '');
            $('#phone_number').val(res);
        });


        this.edit_field('phone_number', 'phone_saved');
    }


    edit_availability() {

        $('#profile_availability').on('change', function () {

            // save
            profile_save_form();

            setTimeout(function () {


                $('#availability_saved').removeClass('d-none');

                $('#availability_saved').show().addClass('animated fadeInDown').fadeOut('slow');

            }, 500);
        });
    }


    edit_field(id, ids_save_mark) {

        let typingTimer;                //timer identifier
        let doneTypingInterval = 2000;  //time in ms (2 seconds)

        $('#' + id).on('input', function () {

            clearTimeout(typingTimer);

            typingTimer = setTimeout(function () {

                // doSomething...
                // save
                profile_save_form();

                $('#' + ids_save_mark).removeClass('d-none');
                $('#' + ids_save_mark).show().addClass('animated bounceIn').fadeOut('slow');

            }, doneTypingInterval);
        });

    }
}

new Profile_form();
