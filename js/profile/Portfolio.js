class Portfolio {

    constructor() {

        this.init();
        this._isTitleField();
        this.insert()
        this.load_portfolio()
        this.update()
        this.delete()
    }


    init() {

        $('#portfolioCustomFile').on('change', function () {

            portfolio._upload_image()
        });

        $('#portfolioCustomFile_edit').on('change', function () {

            portfolio._update_image()
        });
    }


    // if title more than 2 symbols
    _isTitleField() {


        $('#portfolio_title').on('input', function () {

            if ($('#portfolio_title').val().length > 2) {

                $('.portfolioImageBlock').fadeIn(800).removeClass('d-none')
                $('#add_portfolio').fadeIn(800).removeClass('d-none')

            } else {

                $('.portfolioImageBlock').fadeOut('slow');
                $('#add_portfolio').fadeOut();
            }

        });
    }

    _upload_image() {


        let formData = new FormData();
        formData.append('file', $('#portfolioCustomFile')[0].files[0]);
        //attach old one
        formData.append('ofile', $('#portfolio_attached').val());


        $.ajax({
            type: "POST",
            url: "/ajax/portfolio/upload_photo",

            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },

            data: formData,

            processData: false,  // tell jQuery not to process the data
            contentType: false,

            //dataType: "json",
            success: function (data) {

                $('.portfolioCustomFile').text('Attached: ' + $('#portfolioCustomFile')[0].files[0].name)
                //$('#portfolioCustomFile').attr('disabled', 'disabled');

                $('#portfolio_attached').val(data);

            },
            error: function () {

                alert('Error: ');
            }
        });
    }

    _update_image() {

        let formData = new FormData();
        formData.append('file', $('#portfolioCustomFile_edit')[0].files[0]);

        //attach old one
        formData.append('ofile', $('#portfolio_attached_edit').val());

        //attach id
        formData.append('id', $('#portfolio_edit_id').val());


        $.ajax({
            type: "POST",
            url: "/ajax/portfolio/upload_photo",

            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },

            data: formData,

            processData: false,  // tell jQuery not to process the data
            contentType: false,

            //dataType: "json",
            success: function (data) {

                $('.portfolioCustomFile_edit').text('Attached: ' + $('#portfolioCustomFile_edit')[0].files[0].name)
                //$('#portfolioCustomFile').attr('disabled', 'disabled');

                $('#portfolio_attached_edit').val(data);

                $('.portfolio_modal_footer').hide().html('<img class="img-fluid" src="/storage/portfolio/' + data + '">').fadeIn();

            },
            error: function () {

                alert('Error: ');
            }
        });
    }

    insert() {

        $('#add_portfolio').on('click', function () {


            $.ajax({
                type: "POST",
                url: "/ajax/portfolio/save",

                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },

                data: {
                    title: $('#portfolio_title').val(),
                    description: $('#portfolio_description').val(),
                    img: $('#portfolio_attached').val(),
                    experience_id: $('#experience_portfolio option:selected').val()
                },

                success: function (data) {

                    $("#portfolio_block").prepend('<div style="cursor: pointer" id="portfolio_' + data + '"'
                        + ' class="col-12 mt-4 p-3 border rounded  wow fadeInUp text-primary edit_portfolio" data-id="' + data + '">'
                        + $('#portfolio_title').val() + ':  ' + $('#portfolio_description').val() + '</div>');


                    $('#portfolio_worker').modal('hide');

                    $('#portfolio_title').val('')
                    $('#portfolio_description').val('')
                    $('#portfolio_attached').val('')
                    $('#experience_portfolio option:first').prop('selected', true);
                    $('.portfolioCustomFile').text('Choose file ...')


                    // hide el
                    $('.portfolioImageBlock').hide()
                    $('#add_portfolio').addClass('d-none')


                },
                error: function () {

                    alert('Error: ');
                }
            });

        });

    }

    load_portfolio() {


        $(document).on('click', '.edit_portfolio', function () {


            let id = $(this).attr('data-id')

            //console.log(id)

            $('#portfolio_edit').modal('show');

            $('#portfolio_edit_id').val(id)

            $('.portfolioCustomFile_edit').text('Update image ...');


            // load
            $.ajax({
                type: "POST",
                url: "/ajax/portfolio/load",

                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },

                data: {id: id},
                dataType: "json",

                success: function (data) {

                    $('#portfolio_title_edit').val(data[0].title)
                    $('#portfolio_description_edit').val(data[0].pdesc)
                    $('#portfolio_attached_edit').val(data[0].pfile)

                    $("#experience_portfolio_edit select").val(data[0].id_experience);


                    $("#experience_portfolio_edit").children('[value="' + data[0].id_experience + '"]').prop("selected", true);

                    // preview img
                    if (data[0].pfile.length > 3) {

                        $('.portfolio_modal_footer').html('<img class="img-fluid" src="/storage/portfolio/' + data[0].pfile + '">')
                    } else {

                        $('.portfolio_modal_footer').html('')
                    }
                },

                error: function () {

                    alert('Error: ');
                }
            });


        });
    }

    update() {


        // $('#update_portfolio')
        $(document).on('click', '#update_portfolio', function () {

            let id = $('#portfolio_edit_id').val();

            $.ajax({
                type: "POST",
                url: "/ajax/portfolio/update",

                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },

                data: {
                    id: id,
                    title: $('#portfolio_title_edit').val(),
                    description: $('#portfolio_description_edit').val(),
                    img: $('#portfolio_attached_edit').val(),
                    experience_id: $('#experience_portfolio_edit option:selected').val()
                },

                success: function (data) {

                    // remove old
                    $('#portfolio_' + $('#portfolio_edit_id').val()).remove()

                    // add new
                    $("#portfolio_block").prepend('<div style="cursor: pointer" id="portfolio_' + id + '"'
                        + ' class="col-12 mt-4 p-3 border rounded  wow fadeInUp text-primary edit_portfolio" data-id="' + id + '">'
                        + $('#portfolio_title_edit').val() + ':  ' + $('#portfolio_description_edit').val() + '</div>');


                    $('#portfolio_edit').modal('hide');

                },
                error: function () {

                    alert('Error: ');
                }
            });

        });

    }

    delete() {

        $('#delete_portfolio').on('click', function () {

                // to do ...
                //console.log($('#portfolio_edit_id').val() + ' - ' + $('#portfolio_attached_edit').val())


                $('#portfolio_' + $('#portfolio_edit_id').val()).fadeOut()


            $.ajax({
                type: "POST",
                url: "/ajax/portfolio/delete",

                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },

                data: {
                    id: $('#portfolio_edit_id').val(),
                    img: $('#portfolio_attached_edit').val(),
                },

                success: function (data) {


                    $('#portfolio_edit').modal('hide');




                    // hide el
                    $('.portfolioImageBlock').hide()
                    $('#add_portfolio').addClass('d-none')


                },
                error: function () {

                    alert('Error: ');
                }
            });



            });
    }

}

const portfolio = new Portfolio();
