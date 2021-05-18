class Hr_vacancy_add_unregistered {


    constructor() {


        this.show_date()
    }


    add(){


    }

    show_date(){

        $(document).on("click hover", '#vacancy_cmd_specific_date', function () {

            $('#vacancy_cmd_specific_date').hide()

            //console.log('+-+-+-+-')

            $('.set_date_for_vacancy').removeClass('d-none')

            $('.set_date_for_vacancy').addClass('wow zoomIn animated')
        });
    }



}


new Hr_vacancy_add_unregistered();
