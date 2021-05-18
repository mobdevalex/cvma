function profile_save_form(){

    $.ajax({
        type: "POST",
        url: "/ajax/update_profile",
        async: true,
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },

        data: {
            name: $('#profile_first_name').val(),
            surname: $('#profile_second_name').val(),
            phone: $('#phone_number').val(),
            email : $('#profile_email').val(),
            availability: $('#profile_availability').val(),
            about_you: $('#profile_about_you').val(),
            business_name: $('#profile_business_name').val(),
            address: $('#profile_address').val(),
            postcode: $('#profile_postcode').val()
        },

        //dataType: "json",
        success: function () {

        },
        error: function () {

            alert('Error');
        }
    });
}
