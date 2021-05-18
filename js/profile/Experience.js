class Experience {

    constructor() {

        this.add();
        this.get();
        this.update();
        this.delete();
    }

    add() {

        $(document).on("click hover", '#add_experience', function () {


            $.ajax({
                type: "POST",
                url: "/ajax/add_experience",
                async: true,
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },

                data: {
                    job_category: $('#job_category').val(),
                    workers_position: $('#workers_position').val(),
                    company_name: $('#company_name').val(),
                    years_of_work: $('#years_of_work').val(),
                    year_start: $('#year_start').val(),
                    currently_here: $('#currently_here').prop('checked') ? 1 : 0,
                    responsibilities: $('#responsibilities').val(),

                },

                //dataType: "json",
                success: function (data) {

                    $('#worker_experience').modal('hide');


                    $('#experience_block').append('<div style="cursor: pointer" id="experience_' + data + '" class="col-12 mt-4 p-3 border border-success rounded  wow fadeInUp text-primary edit_experience" data-id="' + data + '">' + $('#workers_position').val() + ' / ' + $('#company_name').val() + ': ' + $('#years_of_work').val() + 'y</div>')

                    $('#worker_experience').find('input:text, textarea').val('');


                    quietScroll("experience_" + data);

                    //window.location.reload();
                },
                error: function () {

                    alert('Error');

                }
            });

        });
    }

    get() {

        $(document).on("click hover", '.edit_experience', function () {

            //console.log($(this).attr('data-id'));

            let id = $(this).attr('data-id');

            $.ajax({
                type: "POST",
                url: "/ajax/get_experience",
                async: true,
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },

                data: {
                    id: id //$(this).attr('data-id')
                },

                //dataType: "json",
                success: function (data) {

                    let obj = JSON.parse(JSON.stringify(data));

                    //console.log(obj[0]['company_name'])

                    $('#workers_position_edit').val(obj[0]['position'])

                    // set select ...
                    $('#job_category_edit').val(obj[0]['id_category_job']).change();

                    $('#company_name_edit').val(obj[0]['company_name']);

                    $('#years_of_work_edit').val(obj[0]['years']);

                    $('#year_start_edit').val(obj[0]['year_start'] == 0 ? '' : obj[0]['year_start']);

                    if (obj[0]['currently_here'] == '1') {

                        $("#currently_here_edit").prop('checked', true);
                    } else {

                        $("#currently_here_edit").prop('checked', false);
                    }

                    $('#responsibilities_edit').val(obj[0]['responsibilities']);

                    $('#delete_experience').attr('data-id', id);
                    $('#update_experience').attr('data-id', id);


                    // open modal
                    $('#edit_experience').modal('show');
                },
                error: function () {

                    alert('Error');
                }
            });



        });

    }

    update() {

        $(document).on("click hover", '#update_experience', function () {

            let click_id = $(this).attr('data-id');


            $.ajax({
                type: "POST",
                url: "/ajax/update_experience",
                async: true,
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },

                data: {
                    id: click_id,
                    job_category: $('#job_category_edit').val(),
                    workers_position: $('#workers_position_edit').val(),
                    company_name: $('#company_name_edit').val(),
                    years_of_work: $('#years_of_work_edit').val(),
                    year_start: $('#year_start_edit').val(),
                    currently_here: ($('#currently_here_edit').prop('checked') ? 1 : 0),
                    responsibilities: $('#responsibilities_edit').val(),
                },

                //dataType: "json",
                success: function () {

                    $('#experience_' + click_id).hide();

                    $('#experience_' + click_id).html($('#workers_position_edit').val() + ' / ' + $('#company_name_edit').val())

                    $('#edit_experience').modal('hide');
                    $('#edit_experience').find('input:text, textarea').val('');

                    $('#experience_' + click_id).fadeIn('slow');

                    //window.location.reload();
                },
                error: function () {

                    alert('Error');
                }
            });

            quietScroll("experience_" + click_id);
        });
    }

    delete() {

        $(document).on("click hover", '#delete_experience', function () {

            let click_id = $(this).attr('data-id');

            //console.log(id);


            $.ajax({
                type: "POST",
                url: "/ajax/delete_experience",
                async: true,
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },

                data: {
                    id: click_id
                },

                //dataType: "json",
                success: function () {

                    $('#edit_experience').modal('hide');
                    $('#experience_' + click_id).remove();
                },

                error: function () {

                    alert('Error');
                }
            });



        });
    }
}

const experience = new Experience();