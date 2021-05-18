class Hr_edit_vacancy {

    constructor() {

        this.fill_form();
        this.update_post();
        this.delete();
    }

    fill_form() {

        $(document).on("click hover", '.hrs_vacancy', function () {


            // show modal
            $('#vacancyModal').modal('show')

            // change text button
            $('#add_vacancy_button').text('Update')

            // clean style
            $('#vacancy_title').removeClass('is-invalid')
            $('#vacancy_description').removeClass('is-invalid')
            $('#vacancy_salary_from').removeClass('is-invalid')


            let id = $(this).attr('d-id');


            $.ajax({
                type: "POST",
                url: "/ajax/hr/get_vacancy",

                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },

                data: {id: id},

                dataType: "json",

                success: function (data) {

                    hr_edit_vacancy.fill_modal_form(data);
                },


                error: function () {

                }

            });
        });
    }

    fill_modal_form(data) {

        console.log(data[0].id)

        $('#add_vacancy_button').attr('data-id', data[0].id)

        $('#vacancy_title').val(data[0].title);
        $('#vacancy_description').val(data[0].description);

        (data[0].full_time === 1 ? $('#vacancy_fullTime').prop("checked", true) : $('#vacancy_fullTime').prop("checked", false));
        (data[0].part_time === 1 ? $('#vacancy_partTime').prop("checked", true) : $('#vacancy_partTime').prop("checked", false));
        (data[0].urgent === 1 ? $('#vacancy_urgent').prop("checked", true) : $('#vacancy_urgent').prop("checked", false));
        (data[0].immediate_start === 1 ? $('#vacancy_immediateStart').prop("checked", true) : $('#vacancy_immediateStart').prop("checked", false));
        (data[0].experience_not_required === 1 ? $('#vacancy_experienceNot').prop("checked", true) : $('#vacancy_experienceNot').prop("checked", false));

        $('#vacancy_shifts').val(data[0].shifts)
        $('#vacancy_salary_from').val(data[0].salary_from)
        $('#vacancy_salary_to').val(data[0].salary_to)
        $('#vacancy_period').val(data[0].period)
        $('#vacancy_extra').val(data[0].extra_options)
    }

    update_post() {

        $(document).on("click hover", '#add_vacancy_button', function () {

            // prevent for add
            if(!$(this).attr('data-id').trim()){

                return;
            }
            //console.log('post')


            $('#add_vacancy_button').attr("disabled", true);

            $.ajax({
                type: "POST",
                url: "/ajax/hr/update_vacancy",

                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },

                data: {
                    id: $('#add_vacancy_button').attr('data-id'),
                    title: $('#vacancy_title').val(),
                    description: $('#vacancy_description').val(),
                    full_time: ($('#vacancy_fullTime:checked').val() ? 1 : 0),
                    part_time: ($('#vacancy_partTime:checked').val() ? 1 : 0),
                    urgent: ($('#vacancy_urgent:checked').val() ? 1 : 0),
                    immediate_start: ($('#vacancy_immediateStart:checked').val() ? 1 : 0),
                    experience_not_required: ($('#vacancy_experienceNot:checked').val() ? 1 : 0),
                    shifts: $('#vacancy_shifts').val(),
                    salary_from: $('#vacancy_salary_from').val(),
                    salary_to: ($('#vacancy_salary_to').val() ? $('#vacancy_salary_to').val() : 0),
                    period: $('#vacancy_period').val(),
                    extra_options: $('#vacancy_extra').val()
                },

                //dataType: "json",
                success: function () {

                    // hide modal
                    $('#vacancyModal').modal('hide')

                    // clean form
                    document.getElementById("hr_vacancy_form").reset();

                    $('#add_vacancy_button').attr("disabled", false);

                    console.log('s post')

                    window.location.reload();

                },
                error: function () {

                    $('#add_vacancy_button').attr("disabled", false);
                    alert('Error');
                }
            });


        });
    }

    delete(){


        $(document).on("click hover", '.delete_hr_vacancy', function () {

            let id = $(this).attr('data-id');

            console.log(id)

            $('#hr_vacancy_' + id).fadeOut();

            $.ajax({
                url: "/ajax/hr/delete_vacancy",

                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },


                type: "post",
                data: {id: id},

                success: function() {

                }
            });
        });
    }
}


const hr_edit_vacancy = new Hr_edit_vacancy();
