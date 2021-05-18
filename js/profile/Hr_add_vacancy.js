class Hr_add_vacancy {

    constructor() {

        this.add_vacancy();
        this.change_button_add();
    }

    validation() {


        if (this.isEmpty('vacancy_title') == false) {

            return false
        }

        if (this.isEmpty('vacancy_description') == false) {

            return false;
        }

        if (this.isEmpty('vacancy_salary_from') == false) {

            return false;
        }

        return true;
    }

    isEmpty(id) {


        if ($('#' + id).val() == '') {

            $('#' + id).addClass('is-invalid')

            //$.scrollTo($("#vacancy_title"))
            let elem = document.getElementById(id);
            elem.scrollIntoView();

            return false;
        }

        $('#' + id).removeClass('is-invalid')


        return true;
    }


    /**
     * edd vacancy
     * POST
     */
    add_vacancy() {


        $(document).on("click hover", '#add_vacancy_button', function () {

            // prevent for update
            if($('#add_vacancy_button').text() !== 'Add'){

                return;
            }

            if (HR_add_vacancy.validation() == false) {

                return;
            }

            $('#add_vacancy_button').attr("disabled", true);

            $.ajax({
                type: "POST",
                url: "/ajax/hr/add_vacancy",

                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },

                data: {
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

                    setTimeout(function () {

                        window.location.reload();
                    }, 800);
                },
                error: function () {

                    $('#add_vacancy_button').attr("disabled", false);
                    alert('Error');
                }
            });


        });
    }

    change_button_add(){

        $(document).on("click hover", '#vacancy_add_button', function () {

            $('#add_vacancy_button').text('Add')
            document.getElementById("hr_vacancy_form").reset();
            $('#add_vacancy_button').attr('data-id', '')

            // clean form (if was update)
            document.getElementById("hr_vacancy_form").reset();
        });
    }

}

const HR_add_vacancy = new Hr_add_vacancy();
