class Portfolio_public {


    constructor() {

        this.like();
    }

    like() {

        $(document).on("click hover", '.like_portfolio', function () {

            if(isLoggedIn() === false){

                return;
            }


            if ($('span.like_portfolio.text-danger').length > 0) {

                //console.log('dddd');

                // remove class
                $('span.like_portfolio').removeClass('text-danger');
                portfolio_public._ajaxLikeRemove($(this).attr('data-id'))


            } else {

                // add class
                $('span.like_portfolio').addClass('text-danger');

                // add like
                portfolio_public._ajaxLike($(this).attr('data-id'))
            }

        });
    }


    // add like
    _ajaxLike(id) {

        $.ajax({
            type: "POST",
            url: "/ajax/portfolio/like",
            async: true,
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },

            data: {
                id: id
            },

            //dataType: "json",
            success: function () {

            },
            error: function () {

                //alert('Error');
            }
        });
    }

    // remove like
    _ajaxLikeRemove(id){

        $.ajax({
            type: "POST",
            url: "/ajax/portfolio/like_remove",
            async: true,
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },

            data: {
                id: id
            },

            //dataType: "json",
            success: function () {

            },
            error: function () {

                //alert('Error');
            }
        });
    }

    save() {


    }
}

const portfolio_public = new Portfolio_public(); //
