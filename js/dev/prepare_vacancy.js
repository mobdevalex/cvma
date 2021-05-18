class PrepareVacancy {


    constructor() {

        this.next()
        this.check_companies_email()
    }

    next() {

        $(document).on("click hover", '#next_prepare_vacancy_block', function () {

            let st = 0;

            // remove red mark-mistakes
            $('.is-invalid').removeClass('is-invalid')
            $('.btn').blur(); // remove focus from button


            $(prepare_vacancy_blocks).each(function (index, element) {

                if ($('#' + element).is(':visible')) {

                    st = index
                }

                // reset focus
                $('.btn').blur();
            });

            if (prepare_vacancy.stages_condition(st) != true) {

                return;
            }

            // show next slide
            $('#' + prepare_vacancy_blocks[st + 1]).removeClass('d-none');
            $('#' + prepare_vacancy_blocks[st + 1]).addClass('wow fadeInLeft animated'); // animate next

            $('#' + prepare_vacancy_blocks[st]).addClass('d-none');// hide


            //set focus from top
            quietScroll(prepare_vacancy_blocks[st + 1]);


        });
    }


    stages_condition(st) {

        //console.log('stage: ' + st)

        // check stage 1
        if (st == 0) {

            return prepare_vacancy.check_block_1();
        }

        // check stage 2
        if (st == 1) {

            return prepare_vacancy.check_block_2()
        }

        // condition for last stage
        if (st == 2) {

            return prepare_vacancy.last_stage()
        }

        //return true;
    }

    check_block_1() {

        // Business name
        if ($('#business_name').val() == '') {


            $('#business_name').addClass('is-invalid')

            quietScroll('business_name');

            return false
        }

        // email
        if ($('#business-email').val() == '') {


            $('#business-email').addClass('is-invalid')
            quietScroll('business-email');

            return false
        }

        if(isEmail($('#business-email').val()) == false){

            $('#business-email').addClass('is-invalid')
            quietScroll('business-email');

            return false
        }

        //phone
        if ($('#business-phone').val() == '') {


            $('#business-phone').addClass('is-invalid')
            quietScroll('business-phone');

            return false
        }

        //postcode
        if ($('#business-postcode').val() == '') {


            $('#business-postcode').addClass('is-invalid')
            quietScroll('business-postcode');

            return false
        }


        // check vacancy description
        if ($('#company_description').val().length < 100) {

            //console.log($('#company_description').val().length)

            $('#company_description').addClass('is-invalid')
            quietScroll('company_description');

            return false
        }

        return true
    }

    check_companies_email() {


        $("#business-email").bind('keyup input change', function (e) {

            let valid = isEmail(this.value)

            //console.log('ccc: ' + valid)

            if (valid === true) {


                $('.business-email-feedback').html('');
                $('.business-email-feedback').removeClass('text-danger')
                $('#business-email').removeClass('is-invalid')

                prepare_vacancy._ajaxEmailCheck($('#business-email').val());

            } else {

                $('.business-email-feedback').html('It\'s' + (valid ? '' : ' not') + ' valid');
                $('.business-email-feedback').addClass('text-danger')
                $('#business-email').addClass('is-invalid')
            }

        });
    }


    _ajaxEmailCheck(bemail) {

        //console.log('send ajax when email checked')

        // send ajax
        $.ajax({
            type: "POST",
            url: "/ajax/check-companies-email",

            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },

            data: {
                email: bemail
            },

            success: function (data) {

                if (data == 'exist') {

                    $('#business-email').val('')
                    $('.business-email-feedback').text('Email already used, try another one')
                    $('.business-email-feedback').addClass('text-danger')

                } else if (data == 'can_use') {

                    $('.business-email-feedback').text(' email is valid')
                    $('.business-email-feedback').addClass('text-success')
                    $('.business-email-feedback').removeClass('text-danger')
                }
            },

            error: function () {

            }
        });


    }

    check_block_2() {


        // check vacancy_title
        if ($('#vacancy_title').val().length < 4) {

            $('#vacancy_title').addClass('is-invalid')
            quietScroll('vacancy_title');

            return false
        }

        // check salary from
        if ($('#vacancy_salary_from').val() == '') {

            $('#vacancy_salary_from').addClass('is-invalid')
            quietScroll('vacancy_salary_from');

            return false
        }



        $('#next_prepare_vacancy_block').text('POST')
        $('.policy_vacancy').removeClass('d-none')

        return true
    }

    last_stage() {


        // check vacancy description
        if ($('#vacancy_description').val().length < 100) {

            //console.log($('#vacancy_description').val().length)

            $('#vacancy_description').addClass('is-invalid')
            quietScroll('vacancy_description');

            return false

        }

        // else {
        //
        //     $('#vacancy_description').removeClass('is-invalid')
        // }


        $('#next_prepare_vacancy_block').hide();
        //$('#next_prepare_vacancy_block').addClass('d-none')
        $('.policy_vacancy').addClass('d-none')

        prepare_vacancy._ajaxSave()

        return true;
    }

    _ajaxSave() {

        //let me = $('#create_companies_vacancy_public').find('input');
        let me = $('#create_companies_vacancy :input').serialize(); // .find('select, textarea, input')

        //console.log( me ); // .form-control


        $.ajax({
            type: "POST",
            url: "/ajax/save_companies_vacancy",
            async: true,
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },

            data: me, // + '&' + $.param({'Page': window.location.href}),  // $.post("page.php",( $('#myForm').serialize()+'&'+$.param({ 'wordlist': wordlist })));

            //dataType: "json",
            success: function (data) {

                // clean form
                $('.form-control').val('')
            },
            error: function () {

                alert('Error: try again');
            }
        });

    }
}


let prepare_vacancy_blocks = ['prepare_vacancy_1', 'prepare_vacancy_2', 'prepare_vacancy_3', 'prepare_vacancy_4'];

const prepare_vacancy = new PrepareVacancy();
