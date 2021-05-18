class Workers_languages {

    constructor() {

        this.getList();
        this.add();
        this.delete();
    }


    getList() {

        $(document).on("click hover", '#get_languages', function () {

            // clean options
            document.getElementById("LangList").options.length = 0;

            let id = $(this).attr('data-id');


            $.ajax({
                type: "POST",
                url: "/ajax/get_languages",
                async: true,
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },

                //dataType: "json",
                success: function (data) {

                    let obj = JSON.parse(JSON.stringify(data));


                    $.each(obj, function (k, v) {

                        //console.log(v.id + " : " + v.name);

                        $('#LangList').append($('<option>', {
                            value: v.id,
                            text: v.name
                        }));
                    });

                },
                error: function () {

                    alert('Error');
                }
            });


        });
    }

    add() {

        $(document).on("click hover", '#add_language', function () {


            $.ajax({
                type: "POST",
                url: "/ajax/add_language",
                async: true,
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },

                data: {
                    language: $('#LangList').val(),
                    level: $('#LangLevel').val()
                },

                //dataType: "json",
                success: function (data) {

                    $('#languages_list').modal('hide');

                    $('#languages_block').append('<span class="bg-white btn-block text-success mr-3" id="lang_'+ data +'">'+ $('option:selected', '#LangList').text() +' - <small>'+ $('option:selected', '#LangLevel').text() +'</small> <button class="btn btn-outline-danger btn-sm del_language" data-id="'+ data +'">X</button> </span>');

                    console.log(data);

                    quietScroll("languages_block");
                },
                error: function () {

                    alert('Error');
                }
            });

        });
    }

    delete() {

        $(document).on("click hover", '.del_language', function () {

            // clean options
            document.getElementById("LangList").options.length = 0;

            let id = $(this).attr('data-id');

            console.log(id)

            $.ajax({
                type: "POST",
                url: "/ajax/del_language",
                async: true,
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },

                data: {
                    id: id //$(this).attr('data-id')
                },

                //dataType: "json",
                success: function (a) {

                    $('#lang_' + id).remove();
                    quietScroll("languages_block_top");
                },
                error: function () {

                    alert('Error');
                }
            });


        });
    }
}

new Workers_languages();
