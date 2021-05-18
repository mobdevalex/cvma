class Chat {

    constructor() {

        //this.eventSendByEnter();

        this.eventSendByEnter();

        this.loadChat()

        this.checkChat()

        this.check_new_msg();
    }

    eventSendByEnter() {

        // enter event
        $('#chatInput').on('keydown', '', function (e) {

            let key = e.which;

            if (key == 13) { // enter

                chat.chatClientQuestion()
            }
        });
    }


    // modal preparation & loading
    loadChat() {

        //
        $(document).on("click hover", '.start_chat', function () {

            //console.log('loading ... ' + $(this).attr('chat-with'))

            if (isLoggedIn() != true) {


                $('#loginModal').modal('show')

                return;
            }

            //console.log($('#full_name').text().length)
            //console.log($('#profile_pic').length)
            //console.log($(this).attr('full-name'))

            $(this).removeClass('btn-outline-danger').addClass('btn-outline-secondary')

            // add name to chat modal
            if ($(this).attr('full-name').length > 0) {

                $('#titleModalChat').html('Chat > ' + $(this).attr('full-name'))
            }

            // add pic to chat modal if exists
            // if ($('#profile_pic').length > 0) {
            //
            //     $('#titleModalChat').prepend('<img src="' + $('#profile_pic').attr('src') + '" class="img-fluid float-left mr-3" width="50"> ')
            // }


            $('#chatModal').modal('show')


            $('#chatInput').attr('data-to', $(this).attr('chat-with'))

            chat.loadChatCall()

        });

    }

    loadChatCall() {

        $('#chat_messages').html('')

        $.ajax({
            type: "POST",
            url: "/chat/load",
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },

            data: {

                //msg: $('#chatInput').val(),
                chat_with: $('#chatInput').attr('data-to')
            },

            dataType: "json",
            success: function (data) {

                let txt;
                let reed = [];

                //parse json
                $.each(data, function (i, field) {

                    //console.log(field.msg + ' - '+ field.m_date )

                    if (field.to_id == $('#chatInput').attr('data-to')) {


                        txt = '<div class="col-12 alert alert-warning mr-1">' +
                            '<small class="float-right text-muted mt-1">' + field.m_date + '</small>' +
                            '' + field.msg + '</div>';

                    } else {

                        txt = '<div class="col-12 alert alert-success text-right mr-1">' +
                            '<small class="float-left text-muted mt-1">' + field.m_date + '</small>' +
                            '' + field.msg + '</div>';


                        // if doesn't reed
                        if (field.mread == '0') {

                            // add to array
                            reed.push(field.id);
                        }
                    }


                    $('#chat_messages').prepend(txt);
                });


                //console.log(reed.length);

                if (reed.length > 0) {
                    //mark reed
                    chat.mReed(reed);
                }

                chat._goToBottomChatsDiv();
            },
            error: function () {

                alert('Error: try again');

                $('#chat_messages div:last').fadeOut()

                chat._goToBottomChatsDiv();
            }
        });
    }

    chatClientQuestion() {


        if ($('#chatInput').val().length > 1) {

            let txt = '<div class="col-12 alert alert-warning  mr-1">' +
                '<sup class="float-right text-muted mt-1">now</sup>' +
                '' + $('#chatInput').val() + '</div>';

            $('#chat_messages').append(txt);

            chat._goToBottomChatsDiv();


            $.ajax({
                type: "POST",
                url: "/chat/send",
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },

                data: {

                    msg: $('#chatInput').val(),
                    to: $('#chatInput').attr('data-to')
                },

                //dataType: "json",
                success: function (data) {

                    // clean
                    $('#chatInput').val('');
                },
                error: function () {

                    alert('Error: try again');

                    $('#chat_messages div:last').fadeOut()


                }
            });
        }

        return;
    }

    _goToBottomChatsDiv() {

        // set div to bottom to see show last msg
        let div = document.getElementById('chat_container');
        div.scrollTop = div.scrollHeight - div.clientHeight;
    }

    checkChat() {

        setInterval(this.checkChatCall, 10000);
    }

    checkChatCall() {

        if ($('#chat_container').is(":visible")) {

            //console.log('vis')

            let txt;
            let reed = [];

            $.ajax({
                type: "POST",
                url: "/chat/check",
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },

                data: {
                    chat_with: $('#chatInput').attr('data-to')
                },

                dataType: "json",
                success: function (data) {

                    let txt;

                    //parse json
                    $.each(data, function (i, field) {

                        //console.log(field.msg + ' - '+ field.m_date )

                        txt = '<div class="col-12 alert alert-success text-right mr-1">' +
                            '<small class="float-left text-muted mt-1">' + field.m_date + '</small>' +
                            '' + field.msg + '</div>';

                        // if doesn't reed
                        if (field.mread == '0') {

                            // add to array
                            reed.push(field.id);
                        }


                        $('#chat_messages').append(txt);


                    });

                    if (reed.length > 0) {

                        //mark reed
                        chat.mReed(reed);

                        chat._goToBottomChatsDiv();
                    }


                    //console.log(reed.length);


                },
                error: function () {

                    //alert('Error: try again');

                    //$('#chat_messages div:last').fadeOut()

                    chat._goToBottomChatsDiv();
                }
            });


        }
    }

    mReed(arr) {

        $.ajax({
            type: "POST",
            url: '/chat/reed',
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            data: JSON.stringify(arr),
            contentType: "application/json"
        });
    }

    check_new_msg() {

        //chat.check_new_msg_call();

        setInterval(this.check_new_msg_call, 5000);
    }

    check_new_msg_call() {

        if ($('#chat_logo').length > 0 || $('#profile_link').length > 0) {

            chat._check_new_msg_ajax()
            //console.log('log')
        }
    }

    _check_new_msg_ajax() {

        // to do ajax
        //console.log('call ajax')


        $.ajax({
            type: "GET",
            url: "/chat/check_msg",
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },

            dataType: "json",
            success: function (data) {

                //console.log(data[0].from_id + ' - '+data[0].name + ' '+data[0].surname)
                //console.log(reed.length);

                if (data.length > 0) {

                    $('.chat_bottom').fadeIn()
                    $('.chat_bottom').popover('show')


                    $('.chat_bottom').attr('full-name', '<a href="/profile/' + data[0].from_id + '">' + data[0].name + ' ' + data[0].surname + '</a>')
                    $('.chat_bottom').attr('chat-with', data[0].from_id)

                } else {

                    $('.chat_bottom').fadeOut()
                    $('.chat_bottom').popover('hide')
                }

            }
        });
    }


}


const chat = new Chat();


