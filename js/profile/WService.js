class WService {


    constructor() {


        this.add();
        this.update();
        this.delete();
        this.load_portfolio();
        this.checkbox_service_portfolio();

    }

    add() {

        $(document).on("click", '.add_service', function () {

            if (wService.check() == true) {

                wService._add_ajax_call();
            }
        });
    }

    _add_ajax_call() {

        //console.log('ajax call')

        $.ajax({
            type: "POST",
            url: "/ajax/services/add",

            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },

            data: {
                title: $('#title_service').val(),
                price: $('#price_service').val(),
                price_type: $('#price_type_service option:selected').val(),
                requirement: $('#requirement_service').val(),
                how_long: $('#how_long_service').val()
            },

            //dataType: "json",
            success: function (data) {


                //console.log('success')

                $('#user_service_modal').modal('hide')

                wService.add_to_list_html(data)
            },

            error: function () {

                alert('Error');
            }
        });
    }

    add_to_list_html(id) {


        $('.card-deck').append('<div class="card border-success my_card_300 m-3" id="services_' + id + '">\n' +
            '                <div class="card-header"> ' + $('#title_service').val() + ' <small class="text-muted float-right">£' + $('#price_service').val() + '</small></div>\n' +

            '                <div class="card-body"> <p>' + $('#requirement_service').val() + '</p> \n' +

            '                    <p class="text-right"><small class="text-muted">' + $('#how_long_service').val() + 'd</small></p>\n' +

            '                 </div>\n' +

            '                    <div class="card-footer bg-transparent">\n' +

            '                        <span class="btn btn-outline-primary edit_service_btn" data-id="' + id + '" data-toggle="modal" data-target="#edit_service_modal">edit</span>\n' +

            '                           <span class="btn btn-sm btn-outline-secondary float-right service_attach_portfolio" data-id="' + id + '" data-toggle="modal" data-target="#attach_portfolio_modal">Attach example</span>'+

            '                    </div>\n' +
            '</div>')

        // set header
        $('.card-deck .card:last .card-header').text($('#title_service').val());

        // set body's text
        $('.card-deck .card:last .card-body').text($('#requirement_service').val());

        // set btn mark id
        $('.card-deck .card:last .edit_service_btn').attr('data-id', id)


        // clean form
        $('#user_service_modal').find('input:text, textarea').val('');


    }

    update() {

        // json load to form
        $(document).on("click", '.edit_service_btn', function () {


            //console.log($(this).attr('data-id'))

            // set id to btn
            $('.update_service_btn').attr('data-id', $(this).attr('data-id'))
            $('.delete_service_btn').attr('data-id', $(this).attr('data-id'))


            // ajax call - get json

            // get json by ID
            wService._get_by_id_ajax($(this).attr('data-id'));

        });

        //
        $(document).on("click", '.update_service_btn', function () {

            //console.log('up  - ' + $(this).attr("data-id"))

            wService._update_ajax_call();
        });

    }

    _get_by_id_ajax(id) {

        $.ajax({
            type: "POST",
            url: "/ajax/services/get",
            async: true,
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },

            data: {
                id: id
            },

            //dataType: "json",
            success: function (data) {


                //console.log(data)

                $('#edit_title_service').val(data[0].title)
                $('#edit_price_service').val(data[0].price)

                // to do
                //$('#edit_price_type_service option:selected').val(data[0].price_type)
                $('#edit_price_type_service').val(data[0].price_type);
                $('#edit_requirement_service').val(data[0].requirement)
                $('#edit_how_long_service').val(data[0].how_long)

            },

            error: function () {

                alert('Error');
            }
        });
    }

    _update_ajax_call(id) {

        $.ajax({
            type: "POST",
            url: "/ajax/services/update",

            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },

            data: {
                id: $('.update_service_btn').attr("data-id"),
                title: $('#edit_title_service').val(),
                price: $('#edit_price_service').val(),
                price_type: $('#edit_price_type_service option:selected').val(),
                requirement: $('#edit_requirement_service').val(),
                how_long: $('#edit_how_long_service').val()
            },

            //dataType: "json",
            success: function (data) {


                //console.log('success')

                $('#edit_service_modal').modal('hide')


                // update on list - header
                $('#services_' + $('.update_service_btn').attr("data-id") + ' .card-header').text($('#edit_title_service').val())

                //
                $('#services_' + $('.update_service_btn').attr("data-id") + ' .card-header').append('<small class="text-muted float-right">£' + $('#edit_price_service').val() + '</small>')

                // update on list - requirement
                $('#services_' + $('.update_service_btn').attr("data-id") + ' .card-body').text($('#edit_requirement_service').val())


            },

            error: function () {

                alert('Error');
            }
        });
    }

    delete() {


        $(document).on("click", '.delete_service_btn', function () {

            wService._delete_ajax_call();
        });

    }

    _delete_ajax_call() {

        $.ajax({
            type: "POST",
            url: "/ajax/services/delete",

            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },

            data: {
                id: $('.delete_service_btn').attr("data-id"),
            },

            //dataType: "json",
            success: function () {


                //console.log('success')

                $('#edit_service_modal').modal('hide')

                $('#services_' + $('.update_service_btn').attr("data-id")).fadeOut('slow');

            },

            error: function () {

                alert('Error');
            }
        });
    }

    check() {


        if ($('#title_service').val().length > 5) {


            return true;
        }

    }

    load_portfolio() {

        $(document).on("click", '.service_attach_portfolio', function () {

            //console.log($(this).attr('data-id'))

            $('#service_portfolio').val($(this).attr('data-id'))

            wService._load_portfolio_call($(this).attr('data-id'))
        });
    }

    _load_portfolio_call(id) {


        $.ajax({
            type: "POST",
            url: "/ajax/services/portfolio_load",

            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },

            data: {

                id_service: id
            },

            //dataType: "json",
            success: function (data) {

                //console.log(data)

                // clean body
                $('#attach_portfolio_modal .modal-body').html('');

                $.each(data, function(i, item) {
                    $('#attach_portfolio_modal .modal-body').append(

                        '<div class="col-6 mt-3"><img class="img-fluid rounded" src="/storage/portfolio/'+ data[i].pfile +'"></div>'+

                        '<div class="col-6 mt-3"><br><h5 class="text-muted">'+data[i].title+'</h5>' +
                        '<div class="custom-control custom-switch mt-3">' +
                        '  <input type="checkbox" class="custom-control-input checkbox_service_portfolio" '+

                        ( data[i].id == data[i].id_portfolio && data[i].id_service == $('#service_portfolio').val() ? ' checked ' : ''  ) +' p-id="'+data[i].id+'" id="checkbox_service_portfolio_'+data[i].id+'">' +

                        '  <label class="custom-control-label" for="checkbox_service_portfolio_'+data[i].id+'">Join</label>' +
                        '</div>' +

                        '<p class="mt-3">'+ data[i].pdesc +'</p>' +

                        '</div>' +

                        '<div class="col-12 mt-4"><hr></div>');
                });

            },

            error: function () {

                alert('Error');
            }
        });

    }


    checkbox_service_portfolio(){

        $(document).on("click", '.checkbox_service_portfolio', function () {

               //console.log($(this).attr('p-id') + ' - ' + $('#service_portfolio').val() )

            if($(this).prop("checked") == true){

                //console.log("checked");

                wService.portfolio_attach($('#service_portfolio').val(), $(this).attr('p-id'))

            } else {

                //console.log("unchecked");

                wService.portfolio_remove($('#service_portfolio').val(), $(this).attr('p-id'))
            }
        });
    }

    portfolio_attach(id_service, id_portfolio){


        $.ajax({
            type: "POST",
            url: "/ajax/services/portfolio_service_attach",

            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },

            data: {
                id_service: id_service,
                id_portfolio: id_portfolio
            },

            //dataType: "json",
            success: function () {

            },

            error: function () {

                alert('Error');
            }
        });
    }

    portfolio_remove(id_service, id_portfolio){

        $.ajax({
            type: "POST",
            url: "/ajax/services/portfolio_service_remove",

            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },

            data: {
                id_service: id_service,
                id_portfolio: id_portfolio
            },

            //dataType: "json",
            success: function () {

            },

            error: function () {

                alert('Error');
            }
        });
    }
}

const wService = new WService();
