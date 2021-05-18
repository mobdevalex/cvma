class Shift {

    constructor() {

        this.save();
        this.show_partTime_block();
    }

    save() {

        $(document).on("change", '.save_employee_availability', function () {

            //console.log($(this).attr('data-weekday'))

            shift.saveToDb($(this).attr('data-weekday'), $(this).val());

            $(this).addClass('is-valid')


            //
            $(this).delay(1000).queue(function (next) {

                $(this).removeClass('is-valid')

                // remove focus
                $(this).blur()


                next();
            });


        });
    }

    saveToDb(day, availability) {

        //console.log(day + ' - ' + availability);


        $.ajax({
            type: "POST",
            url: "/ajax/employee_availability",
            async: true,
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },

            data: {
                day: day,
                availability: availability
            },

            //dataType: "json",
            success: function () {

                //$('#edit_experience').modal('hide');
                //$('#experience_' + click_id).remove();

                console.log('----')
            },

            error: function () {

                alert('Error');
            }
        });

    }

    show_partTime_block() {

        $(document).on("click", '.activate_part_time_block', function () {

            //console.log($('#availability_employee').val())

            $('#block_shift_part_time').removeClass('d-none')

            $("#block_shift_part_time").addClass("wow fadeInUp animated");

            // reset focus
            $('.activate_part_time_block').blur();

        });
    }
}

const shift = new Shift();
