class search_CV {

    constructor() {

        this.addCity()

        this.search()
    }

    addCity() {


        //if ($('input #search_cv').val() == 'true') {

        $(document).on('change', '#city_id', function () {

            //console.log(' u '+ $('#city_id').val())

            window.location.href = '?city=' + $('#city_id').val();
        });
        //}

    }

    search() {

        $(document).on('change input', '#search_cvs', function () {


            //console.log('sdfdsf')

            let searchParams = new URLSearchParams(window.location.search)

            $.ajax({
                type: "GET",
                url: "/cv_tmp?search=" + $('#search_cvs').val() + (searchParams.get('city') ? '&city=' + searchParams.get('city') : ''),
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },

                dataType: "json",
                success: function (data) {

                    $('.card-deck').html('')


                    $.each(data['0']['CV']['data'], function (i, field) {

                        let pic = (field.pic === '1' ? '' : '<img class="wow fadeIn" src="/storage/photo/'+ field.id +'.png">')

                        let experience = '';

                        // add experience
                            $.each(data['0']['experiences'], function (ie, ef) {

                                if(ef.id_candidate == field.id){

                                    experience += (ef.position ? ef.position + ', ' : '')
                                }
                            });


                            // add card
                        $('.card-deck').append('' +
                            '<div class="card my_card_300 mb-4"> ' +
                                '<div class="card-header text-center"><a href="/profile/'+ field.id +'">'+ field.name +' '+ field.surname +'</div>' +

                                '<div class="card-body text-center">' + '<a href="/profile/' + field.id + '" target="_blank">' + pic + '</a> <br>'+ experience.slice(0,-2) +'</div>' +
                            ' </div>')

                    });

                    //console.log(data['0']['CV']['next_page_url'])


                    if(data['0']['CV']['next_page_url'] == null){

                        $('.page-link').hide()
                    } else {

                        $('.page-item').removeClass('disabled')

                        $('.page-link').show()

                        $('.page-link').attr('href', '/cv?page=2' + '&city=' + searchParams.get('city')+'&search='+$('#search_cvs').val())
                    }

                },
                error: function () {

                    //alert('Error');
                }
            });


        });

    }
}

new search_CV();
