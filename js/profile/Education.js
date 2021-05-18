class Education {

    constructor() {

        this.get();
        this.insert()
        this.update();
        this.delete()
    }


    insert() {

        $(document).on("click hover", '#add_education', function () {


            $.ajax({
                type: "POST",
                url: "/ajax/add_education",
                async: true,
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },

                data: {
                    education: $('#education').val()
                },

                //dataType: "json",
                success: function (data) {

                    $('#education_worker').modal('hide');


                    $('#education_block').append('<div style="cursor: pointer" id="education_' + data + '" class="col-12 mt-4 p-3 border border-success rounded  wow fadeInUp text-primary edit_education" data-id="' + data + '">' + $('#education').val() + '</div>')

                    //$('#worker_experience').find('input:text, textarea').val('');
                    $('#education').val('');


                    quietScroll("education_" + data);

                    //window.location.reload();
                },
                error: function () {

                    alert('Error');
                }
            });

        });
    }

    get() {

        $(document).on("click hover", '.edit_education', function () {


            let id = $(this).attr('data-id');


            $.ajax({
                type: "POST",
                url: "/ajax/get_education",
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

                    $('#education_edit').val(obj[0]['edesc'])


                    $('#delete_education').attr('data-id', id);
                    $('#update_education').attr('data-id', id);


                    $('#edit_education').modal('show')

                },
                error: function () {

                    alert('Error');
                }
            });


        });
    }

    update() {

        $(document).on("click hover", '#update_education', function () {

            let click_id = $(this).attr('data-id');


            $.ajax({
                type: "POST",
                url: "/ajax/update_education",
                async: true,
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },

                data: {
                    id: click_id,
                    education: $('#education_edit').val()
                },

                //dataType: "json",
                success: function () {

                    $('#education_' + click_id).hide();

                    $('#education_' + click_id).html($('#education_edit').val())

                    $('#edit_education').modal('hide');
                    $('#education').find('textarea').val('');



                    $('#education_' + click_id).fadeIn('slow');

                    //console.log(click_id)
                    //window.location.reload();
                },
                error: function () {

                    alert('Error');
                }
            });

            quietScroll('education_' + click_id);
        });
    }

    delete() {

        $(document).on("click hover", '#delete_education', function () {


            let id = $(this).attr('data-id');

            console.log(id)

            $.ajax({
                type: "POST",
                url: "/ajax/del_education",
                async: true,
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },

                data: {
                    id: id //$(this).attr('data-id')
                },

                //dataType: "json",
                success: function (a) {

                    $('#edit_education').modal('hide')

                    $('#education_' + id).remove();
                    quietScroll("education_block");
                },
                error: function () {

                    alert('Error');
                }
            });


        });
    }
}

new Education();
