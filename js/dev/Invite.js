/*
Invite candidate (for recruiter)
 */
class Invite {

    constructor() {

        this.load_vacancies();
        this.send_invitation();
        this.load_invitation_of_this_dates()
        this.invitation_accept_decline()
    }

    load_vacancies() {

        $(document).on("click", '.invite_button', function () {

            //console.log('click');

            $('#list_vacancies').empty();

            // call: get vacancies
            $.getJSON("/hr/load_vacancies", function (res) {
                $.each(res, function (i, field) {

                    $("#list_vacancies").append('<option value="' + field.id + '">' + field.title + '</option>');
                });
            });

        });
    }

    send_invitation() {

        $(document).on("click", '.invite_btn_send', function () {

            // ajax call
            invite.invitation_send()
        });
    }

    invitation_send() {

        if(this.check_important_fields() == false){

            return;
        }

        $.ajax({
            type: "POST",
            url: "/hr/invitation_send",
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },

            data: {

                //msg: $('#chatInput').val(),
                job_id: $('#list_vacancies').val(),
                to: $('.invite_button').attr('invite'),
                msg: $('#invite_msg').val(),
                m_date: $('#m_date').val(),
                m_time: $('#m_time').val()
            },

            //dataType: "json",
            success: function (data) {

                $('#inviteModal').modal('hide')

                $('#invited').append($('#list_vacancies option:selected').text()+ ': ' + $('#m_date').val() + ' at ' + $('#m_time').val())

                $('#m_date').val('');
                $('#m_time').val('');


                // disable button
                $('.invite_button').text('Invited!');
                $('.invite_button').removeAttr("data-toggle");
                $('.invite_button').removeClass('invite_button')
            },
            error: function () {

                alert('Error');
            }
        });

    }

    check_important_fields(){

        // check date
        if($('#m_date').val().length == 0){

            $('#m_date').addClass('is-invalid')

            return false;
        } else{

            $('#m_date').removeClass('is-invalid')
        }

        // check time
        if($('#m_time').val().length == 0){

            $('#m_time').addClass('is-invalid')

            return false;

        } else{

            $('#m_time').removeClass('is-invalid')
        }
    }

    load_invitation_of_this_dates() {

        $("#inviteModal input").bind('keyup change', function () {

            invite.check_important_fields();
        });



        $("#m_date").bind('click change', function (e) {

            if ($('#m_date').val().length > 0) {

                //console.log('ch: ' + $('#m_date').val() + ' - ' + $('#m_date').val().length)


                // call: get invitations for chosen date
                $.ajax({
                    type: "POST",
                    url: "/hr/load_invitation_dates",
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    },

                    data: {
                        m_date: $('#m_date').val()
                    },

                    dataType: "json",
                    success: function (data) {

                        if(data){

                            // clean
                            $("#invitations_this_date").html('');
                        }

                        $.each(data, function (i, field) {

                            if(i > 0) {

                                $("#invitations_this_date").append(', ')
                            } else {

                                $("#invitations_this_date").append('your booked time slots: ')
                            }

                            $("#invitations_this_date").append(field.m_time.slice(0, -3));
                        });

                    }
                });
            }
        });
    }

    invitation_accept_decline(){


        // accept
        $(document).on("click", '.invitation_accept', function () {

            //console.log('a ' + $(this).attr('jid'));

            $(this).removeClass('btn-outline-primary invitation_accept').addClass('btn-success').text('ACCEPTED')

            $('.invitation_' + $(this).attr('jid') + ' .invitation_decline').fadeOut()

            //send ajax
            invite._accept_ajax($(this).attr('jid'))

        });



        // decline
        $(document).on("click", '.invitation_decline', function () {

            //console.log('d ' + $(this).attr('jid'));

            $('.invitation_'+ $(this).attr('jid')).fadeOut('slow')

            // to do remove ajax
            invite._decline_ajax($(this).attr('jid'))

        });
    }

    _decline_ajax(id){

        $.ajax({
            type: "POST",
            url: '/invitation/decline',
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            data: {jid: id},

            //contentType: "application/json"
        });
    }

    _accept_ajax(id){

        $.ajax({
            type: "POST",
            url: '/invitation/accept',
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            data: {jid: id},

            //contentType: "application/json"
        });
    }
}

const invite = new Invite;
