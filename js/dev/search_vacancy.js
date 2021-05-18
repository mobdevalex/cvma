class SearchVacancy {

    constructor() {

        this.search();
    }

    search() {

        let typingTimer;                //timer identifier
        let doneTypingInterval = 1000;  //time in ms (0.3 seconds)

        $('#search_vacancy').on('input', function () {

            clearTimeout(typingTimer);

            typingTimer = setTimeout(function () {


                //
                $('#search_vacancy_result').removeClass('wow fadeInUp animated');


                setTimeout(function () {

                    // doSomething...
                    // save
                    //search_vacancy.search_form_update()

                    // is success
                    $('#search_vacancy_result').addClass('wow fadeInUp animated');

                    search_vacancy.search_request()

                }, 1200);


                //$('#' + ids_save_mark).show().addClass('animated bounceIn').fadeOut('slow');

            }, doneTypingInterval);
        });
    }


    /**
     * ajax request
     */
    search_request() {

        $.ajax({
            type: "POST",
            url: "/ajax/search_vacancy",
            async: true,
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },

            data: {
                letters: $('#search_vacancy').val(),
            },

            dataType: "json",

            success: function (data) {

                // clean
                $('#search_vacancy_result').html('');


                // if($("[name=dropdown_city]").val() == ''){
                //
                //     $('#search_vacancy_result').html(' &nbsp;  &nbsp;  &nbsp; chose city, ')
                // }

                if ( data.length == 0 ) {

                    //console.log("NO DATA!")

                    $('#search_vacancy_result').append(' &nbsp;  &nbsp;  &nbsp; no records')

                    // clean
                    $('#search_vacancy').val('')

                } else {


                    // set focus on result
                    quietScroll('search_vacancy_result')

                    $.each(data, function (k, v) {

                        /// do stuff
                        //console.log(data[k].description)

                        $('#search_vacancy_result').append(search_vacancy.template(data[k]))

                    });

                }

            },

            error: function () {

                alert('Error');
            }
        });

    }

    template(arr) {

        let html = '<div class="card my_card_300 mt-5 job_offer" data-id="' + arr.id + '">\n' +

            '                <div class="card-header">\n' +

            '                    <div class="row">\n' +

            '                        <div class="col-8">\n' +

            '                            <strong class="card-title">' + arr.title + '</strong>\n' +
            '                        </div>\n' +

            '                        <div class="col-4 text-right">\n' +

            '                            <small class="text-capitalize text-dark text-right"> £' + (arr.salary_to !== '0.00' ? arr.salary_to : arr.salary_from ) + ' \n' +
            '                                <span class="text-lowercase">' + arr.period + '</span></small>\n' +

            '                        </div>\n' +
            '                    </div>\n' +

            '                </div>\n' +

            '                <div class="card-body d-flex flex-column">\n' +

            '                    <p class="card-text text-justify">\n' +
            '                        ' + arr.description + '  ...\n' +
            '                    </p>\n' +

            '                    <div class="row mt-3">\n' +

            '                        <div class="col-6">\n' +

            '                            <small class="text-capitalize font-italic text-muted"> ' + arr.name_company + ' \n' +
            '                                <span class="text-lowercase"> ' + arr.employment_type + ' </span></small>\n' +

            '                        </div>' +

            '                        <div class="col-6 text-right">\n' +

            '                            <object type="image/svg+xml" data="/img/point.svg">' +
            '                            </object>' +

            '                            <small class="text-capitalize font-italic text-muted">\n' +
            '                                ' + arr.address + ' </small>\n' +
            '                        </div>\n' +

            '                    </div>\n' +

            '                </div>\n' +

            '                <div class="card-footer bg-transparent">\n' +

            '                    <a href="/vacancy/' + arr.id + '" target="_blank" class="btn btn-outline-primary  btn-block btn-sm applyJob_button_' + arr.id + '"> view </a>\n' +

            '                </div>\n' +

            '            </div>';

        return html;
    }
}

const search_vacancy = new SearchVacancy();
