$(function () {
    $('[data-toggle="popover"]').popover()
})

$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})

$(document).on("keyup", '.numbersOnly', function () {

    this.value = this.value.replace(/[^0-9\.]/g, '');
});


// slow scroll for programs
function quietScroll(block) {

    // if block doesn't exists
    if($("#" + block).length == 0) {

        return;
    }

    $('html,body').animate({
        scrollTop: $('#' + block).offset().top
    }, 800);
    return false;
}


/*
delete - fbclid - удаляем метку FB
 */
(function () {
    let param = 'fbclid';
    if (location.search.indexOf(param + '=') !== -1) {
        let replace = '';
        try {
            let url = new URL(location);
            url.searchParams.delete(param);
            replace = url.href;
        } catch (ex) {
            let regExp = new RegExp('[?&]' + param + '=.*$');
            replace = location.search.replace(regExp, '');
            replace = location.pathname + replace + location.hash;
        }
        history.replaceState(null, '', replace);
    }
})();


// href to vacancy
$(document).on("click", '.job_offer', function () {

    let t = $(this),
        id = t.attr('data-id');


    let win = window.open('/vacancy/' + id, '_blank');
    win.focus();

});

// job apply
$(document).on("click", '.job_apply', function () {

    let t = $(this),
        id = t.attr('data-id');


    // set cook for return users to apply after finish profile
    document.cookie = "attempt_to_apply=/vacancy/" + id + '; path=/';

    // FB lead
    // fbq('track', 'Lead', {
    //     value: 0.1,
    //     currency: 'GBP',
    // });



    if (isLoggedIn() == false) {

        return;
    }

    if (isVideoExists() == true) {

        vacancy_apply(id);

    }

});

// facebook login
function facebook() {

    $.ajax({
        type: "POST",
        url: "/facebook/fpp",
        async: true,
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },

        data: ({'page': window.location.pathname}),

        success: function () {

            window.location.href = 'https://www.facebook.com/dialog/oauth?client_id=623450304729917&redirect_uri=https://cvmatograph.com/facebook&scope=email&response_type=code';
        },
        //
        // error: function () {
        //     alert('Error: try again');
        // }

    });
}

function LinkedIn(){

    window.location.href = 'https://cvmatograph.com/linkedin';
}


$(document).on("click", '.send_to_support', function () {

    $.ajax({
        type: "POST",
        url: "/ajax/support",
        async: true,
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },

        data: ({
            'name': $('.support_name').val(),
            'email': $('.support_email').val(),
            'question': $('.support_question').val()
        }),

        success: function () {

            //console.log('sent')

            $('.support_email').val('')
            $('.support_question').val('')

            $('.send_to_support').attr("disabled", true);
            $('.send_to_support').text('Sent');

        },

        error: function () {
            alert('Error: try again');
        }

    });
});

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function isEmail(email) {

    let regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    return regex.test(email);
}

