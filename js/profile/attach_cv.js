$(document).on("change", '#attach_cv', function () {

    let formData = new FormData();
    formData.append('file', $('#attach_cv')[0].files[0]);


    $.ajax({
        type: "POST",
        url: "/ajax/upload_cv",
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },

        data: formData,

        processData: false,
        contentType: false,

        //dataType: "json",
        success: function (data) {


            // $('div.has-success div.form-control-feedback', me).text('Сообщение успешно отправлено! Мы обязательно свяжемся с Вами.').fadeOut(10000);
            // $(me).trigger("reset");

            //console.log('success up');

            $('.custom-file-cv').text('Attached!');
        },

        error: function (e) {
            alert('Error: try right format: DOC / PDF / RTF'); // dsfsdfsdf
        }
    });


});
