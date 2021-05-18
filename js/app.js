function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function vacancy_apply(id) {
  $(".applyJob_button_" + id).dblclick(false);
  $.ajax({
    type: "POST",
    url: "/ajax/vacancy/apply",
    headers: {
      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    },
    data: {
      vid: id
    },
    success: function success(data) {
      //if (data.toString() == 'ok') {
      $(".applyJob_button_" + id).attr("disabled", true);
      $(this).removeClass("job_apply");
      $(".applyJob_button_" + id).removeClass("btn-outline-primary");
      $(".applyJob_button_" + id).addClass("btn-outline-success");
      $(".applyJob_button_" + id).text('applied'); //}
      // delete cookies - attempt_to_apply

      document.cookie = "attempt_to_apply=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    },
    error: function error() {
      $(".applyJob_button_" + id).attr("disabled", false);
      alert('Error');
    }
  });
}

function isVideoExists() {
  var status;
  $.ajax({
    type: "POST",
    url: "/ajax/check_vcv",
    async: false,
    headers: {
      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    },
    success: function success(data) {
      if (data.toString() == 'false') {
        alert('Could you create/upload CV');
        setTimeout(function () {
          window.location.href = "/new_profile";
        }, 500);
        status = false;
      } else {
        status = true;
      }
    },
    error: function error() {
      alert('Error');
    }
  });
  return status;
}

var Chat =
/*#__PURE__*/
function () {
  function Chat() {
    _classCallCheck(this, Chat);

    //this.eventSendByEnter();
    this.eventSendByEnter();
    this.loadChat();
    this.checkChat();
    this.check_new_msg();
  }

  _createClass(Chat, [{
    key: "eventSendByEnter",
    value: function eventSendByEnter() {
      // enter event
      $('#chatInput').on('keydown', '', function (e) {
        var key = e.which;

        if (key == 13) {
          // enter
          chat.chatClientQuestion();
        }
      });
    } // modal preparation & loading

  }, {
    key: "loadChat",
    value: function loadChat() {
      //
      $(document).on("click hover", '.start_chat', function () {
        //console.log('loading ... ' + $(this).attr('chat-with'))
        if (isLoggedIn() != true) {
          $('#loginModal').modal('show');
          return;
        } //console.log($('#full_name').text().length)
        //console.log($('#profile_pic').length)
        //console.log($(this).attr('full-name'))


        $(this).removeClass('btn-outline-danger').addClass('btn-outline-secondary'); // add name to chat modal

        if ($(this).attr('full-name').length > 0) {
          $('#titleModalChat').html('Chat > ' + $(this).attr('full-name'));
        } // add pic to chat modal if exists
        // if ($('#profile_pic').length > 0) {
        //
        //     $('#titleModalChat').prepend('<img src="' + $('#profile_pic').attr('src') + '" class="img-fluid float-left mr-3" width="50"> ')
        // }


        $('#chatModal').modal('show');
        $('#chatInput').attr('data-to', $(this).attr('chat-with'));
        chat.loadChatCall();
      });
    }
  }, {
    key: "loadChatCall",
    value: function loadChatCall() {
      $('#chat_messages').html('');
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
        success: function success(data) {
          var txt;
          var reed = []; //parse json

          $.each(data, function (i, field) {
            //console.log(field.msg + ' - '+ field.m_date )
            if (field.to_id == $('#chatInput').attr('data-to')) {
              txt = '<div class="col-12 alert alert-warning mr-1">' + '<small class="float-right text-muted mt-1">' + field.m_date + '</small>' + '' + field.msg + '</div>';
            } else {
              txt = '<div class="col-12 alert alert-success text-right mr-1">' + '<small class="float-left text-muted mt-1">' + field.m_date + '</small>' + '' + field.msg + '</div>'; // if doesn't reed

              if (field.mread == '0') {
                // add to array
                reed.push(field.id);
              }
            }

            $('#chat_messages').prepend(txt);
          }); //console.log(reed.length);

          if (reed.length > 0) {
            //mark reed
            chat.mReed(reed);
          }

          chat._goToBottomChatsDiv();
        },
        error: function error() {
          alert('Error: try again');
          $('#chat_messages div:last').fadeOut();

          chat._goToBottomChatsDiv();
        }
      });
    }
  }, {
    key: "chatClientQuestion",
    value: function chatClientQuestion() {
      if ($('#chatInput').val().length > 1) {
        var txt = '<div class="col-12 alert alert-warning  mr-1">' + '<sup class="float-right text-muted mt-1">now</sup>' + '' + $('#chatInput').val() + '</div>';
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
          success: function success(data) {
            // clean
            $('#chatInput').val('');
          },
          error: function error() {
            alert('Error: try again');
            $('#chat_messages div:last').fadeOut();
          }
        });
      }

      return;
    }
  }, {
    key: "_goToBottomChatsDiv",
    value: function _goToBottomChatsDiv() {
      // set div to bottom to see show last msg
      var div = document.getElementById('chat_container');
      div.scrollTop = div.scrollHeight - div.clientHeight;
    }
  }, {
    key: "checkChat",
    value: function checkChat() {
      setInterval(this.checkChatCall, 10000);
    }
  }, {
    key: "checkChatCall",
    value: function checkChatCall() {
      if ($('#chat_container').is(":visible")) {
        //console.log('vis')
        var txt;
        var reed = [];
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
          success: function success(data) {
            var txt; //parse json

            $.each(data, function (i, field) {
              //console.log(field.msg + ' - '+ field.m_date )
              txt = '<div class="col-12 alert alert-success text-right mr-1">' + '<small class="float-left text-muted mt-1">' + field.m_date + '</small>' + '' + field.msg + '</div>'; // if doesn't reed

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
            } //console.log(reed.length);

          },
          error: function error() {
            //alert('Error: try again');
            //$('#chat_messages div:last').fadeOut()
            chat._goToBottomChatsDiv();
          }
        });
      }
    }
  }, {
    key: "mReed",
    value: function mReed(arr) {
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
  }, {
    key: "check_new_msg",
    value: function check_new_msg() {
      //chat.check_new_msg_call();
      setInterval(this.check_new_msg_call, 5000);
    }
  }, {
    key: "check_new_msg_call",
    value: function check_new_msg_call() {
      if ($('#chat_logo').length > 0 || $('#profile_link').length > 0) {
        chat._check_new_msg_ajax(); //console.log('log')

      }
    }
  }, {
    key: "_check_new_msg_ajax",
    value: function _check_new_msg_ajax() {
      // to do ajax
      //console.log('call ajax')
      $.ajax({
        type: "GET",
        url: "/chat/check_msg",
        headers: {
          'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        dataType: "json",
        success: function success(data) {
          //console.log(data[0].from_id + ' - '+data[0].name + ' '+data[0].surname)
          //console.log(reed.length);
          if (data.length > 0) {
            $('.chat_bottom').fadeIn();
            $('.chat_bottom').popover('show');
            $('.chat_bottom').attr('full-name', '<a href="/profile/' + data[0].from_id + '">' + data[0].name + ' ' + data[0].surname + '</a>');
            $('.chat_bottom').attr('chat-with', data[0].from_id);
          } else {
            $('.chat_bottom').fadeOut();
            $('.chat_bottom').popover('hide');
          }
        }
      });
    }
  }]);

  return Chat;
}();

var chat = new Chat();
var vid = document.getElementById("player");

function checkDuration() {
  if (fileValidation() === false) {
    return;
  }

  setTimeout(function () {
    var msg;

    if ((vid.duration > 76 || vid.duration < 30) && vid.duration != 'Infinity') {
      msg = ' Duration should be 1 minute! Try again ... ';
      $('#player').css('display', '');
      $(".uploadToServer").addClass("d-none animated fadeInDown");
      alert(msg);
    } else if (vid.duration == 'Infinity') {
      msg = 'Just to be sure, we acceded video ~ 1 min length !';
      $(".uploadToServer").removeClass("d-none");
      alert(msg);
    } else {
      //msg = 'Duration is fine ';
      $(".uploadToServer").removeClass("d-none");
      $('.uploadToServer').hide().removeClass('animated fadeInDown');
      setTimeout(function () {
        $('.uploadToServer').addClass('animated fadeInDown').show();
      }, 200);
    } //alert( msg); // vid.duration + ' сек' +

  }, 500); //

  $('#player').show();
}
/**
 * https://www.codexworld.com/file-type-extension-validation-javascript/
 * @returns {boolean}
 */


function fileValidation() {
  var fileInput = document.getElementById('recorder');
  var filePath = fileInput.value;
  var allowedExtensions = /(\.mp4|\.qt|\.webm|\.avi|\.mov)$/i;

  if (!allowedExtensions.exec(filePath)) {
    alert('Please upload video file only.');
    fileInput.value = '';
    return false;
  }
}

$(document).on("click hover", '#cmd_creare_by_step', function () {
  //console.log('check')
  if (isLoggedIn() === true) {
    window.location.href = '/new_profile';
  }
});

var Hr_vacancy_add_unregistered =
/*#__PURE__*/
function () {
  function Hr_vacancy_add_unregistered() {
    _classCallCheck(this, Hr_vacancy_add_unregistered);

    this.show_date();
  }

  _createClass(Hr_vacancy_add_unregistered, [{
    key: "add",
    value: function add() {}
  }, {
    key: "show_date",
    value: function show_date() {
      $(document).on("click hover", '#vacancy_cmd_specific_date', function () {
        $('#vacancy_cmd_specific_date').hide(); //console.log('+-+-+-+-')

        $('.set_date_for_vacancy').removeClass('d-none');
        $('.set_date_for_vacancy').addClass('wow zoomIn animated');
      });
    }
  }]);

  return Hr_vacancy_add_unregistered;
}();

new Hr_vacancy_add_unregistered();
/*
Invite candidate (for recruiter)
 */

var Invite =
/*#__PURE__*/
function () {
  function Invite() {
    _classCallCheck(this, Invite);

    this.load_vacancies();
    this.send_invitation();
    this.load_invitation_of_this_dates();
    this.invitation_accept_decline();
  }

  _createClass(Invite, [{
    key: "load_vacancies",
    value: function load_vacancies() {
      $(document).on("click", '.invite_button', function () {
        //console.log('click');
        $('#list_vacancies').empty(); // call: get vacancies

        $.getJSON("/hr/load_vacancies", function (res) {
          $.each(res, function (i, field) {
            $("#list_vacancies").append('<option value="' + field.id + '">' + field.title + '</option>');
          });
        });
      });
    }
  }, {
    key: "send_invitation",
    value: function send_invitation() {
      $(document).on("click", '.invite_btn_send', function () {
        // ajax call
        invite.invitation_send();
      });
    }
  }, {
    key: "invitation_send",
    value: function invitation_send() {
      if (this.check_important_fields() == false) {
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
        success: function success(data) {
          $('#inviteModal').modal('hide');
          $('#invited').append($('#list_vacancies option:selected').text() + ': ' + $('#m_date').val() + ' at ' + $('#m_time').val());
          $('#m_date').val('');
          $('#m_time').val(''); // disable button

          $('.invite_button').text('Invited!');
          $('.invite_button').removeAttr("data-toggle");
          $('.invite_button').removeClass('invite_button');
        },
        error: function error() {
          alert('Error');
        }
      });
    }
  }, {
    key: "check_important_fields",
    value: function check_important_fields() {
      // check date
      if ($('#m_date').val().length == 0) {
        $('#m_date').addClass('is-invalid');
        return false;
      } else {
        $('#m_date').removeClass('is-invalid');
      } // check time


      if ($('#m_time').val().length == 0) {
        $('#m_time').addClass('is-invalid');
        return false;
      } else {
        $('#m_time').removeClass('is-invalid');
      }
    }
  }, {
    key: "load_invitation_of_this_dates",
    value: function load_invitation_of_this_dates() {
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
            success: function success(data) {
              if (data) {
                // clean
                $("#invitations_this_date").html('');
              }

              $.each(data, function (i, field) {
                if (i > 0) {
                  $("#invitations_this_date").append(', ');
                } else {
                  $("#invitations_this_date").append('your booked time slots: ');
                }

                $("#invitations_this_date").append(field.m_time.slice(0, -3));
              });
            }
          });
        }
      });
    }
  }, {
    key: "invitation_accept_decline",
    value: function invitation_accept_decline() {
      // accept
      $(document).on("click", '.invitation_accept', function () {
        //console.log('a ' + $(this).attr('jid'));
        $(this).removeClass('btn-outline-primary invitation_accept').addClass('btn-success').text('ACCEPTED');
        $('.invitation_' + $(this).attr('jid') + ' .invitation_decline').fadeOut(); //send ajax

        invite._accept_ajax($(this).attr('jid'));
      }); // decline

      $(document).on("click", '.invitation_decline', function () {
        //console.log('d ' + $(this).attr('jid'));
        $('.invitation_' + $(this).attr('jid')).fadeOut('slow'); // to do remove ajax

        invite._decline_ajax($(this).attr('jid'));
      });
    }
  }, {
    key: "_decline_ajax",
    value: function _decline_ajax(id) {
      $.ajax({
        type: "POST",
        url: '/invitation/decline',
        headers: {
          'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        data: {
          jid: id
        } //contentType: "application/json"

      });
    }
  }, {
    key: "_accept_ajax",
    value: function _accept_ajax(id) {
      $.ajax({
        type: "POST",
        url: '/invitation/accept',
        headers: {
          'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        data: {
          jid: id
        } //contentType: "application/json"

      });
    }
  }]);

  return Invite;
}();

var invite = new Invite(); //https://stackoverflow.com/questions/45007712/bootstrap-4-dropdown-with-search
//Initialize with the list of symbols
//let names_city = []

var names_city = [];
var typingTimer; //timer identifier

var doneTypingInterval = 200; //time in ms (2 seconds)

$('#city_dropdown').on('input', function () {
  clearTimeout(typingTimer);
  typingTimer = setTimeout(function () {
    // doSomething...
    loadCity();
  }, doneTypingInterval);
});

function loadCity() {
  $.post({
    // async: false,
    // global: false,
    dataType: 'json',
    url: "/ajax/city",
    data: {
      country: $('#countrySelect option:selected').val(),
      search: $('#city_dropdown').val()
    },
    headers: {
      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    },
    'success': function success(data) {
      buildDropDownCity(data);
    }
  });
} //Find the input search box


var search_city = document.getElementById("city_dropdown"); //Find every item inside the dropdown

var items_city = document.getElementsByClassName("dd-city");

function buildDropDownCity(values) {
  var contents = [];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = values[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var name = _step.value;
      var region = name.region ? ' (' + name.region + ')' : '';
      contents.push('<input type="button" class="dropdown-item dd-city" type="button" value="' + name.city + ' ' + region + '" data-city="' + name.city + '" data-region="' + name.region + '">');
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  $('#menuItems-city').html('');
  $('#menuItems-city').append(contents.join("")); //Hide the row that shows no items were found

  $('#empty-city').hide();
} //Capture the event when user types into the search box


window.addEventListener('input', function () {
  if (search_city) {
    filterCity(search_city.value.trim().toLowerCase());
  }
}); //For every word entered by the user, check if the symbol starts with that word
//If it does show the symbol, else hide it

function filterCity(word) {
  var length = items_city.length;
  var collection = [];
  var hidden = 0;

  for (var i = 0; i < length; i++) {
    if (items_city[i].value.toLowerCase().startsWith(word)) {
      $(items_city[i]).show();
    } else {
      $(items_city[i]).hide();
      hidden++;
    }
  } //If all items are hidden, show the empty view


  if (hidden === length) {
    $('#empty-city').show();
  } else {
    $('#empty-city').hide();
  }
} //If the user clicks on any item, set the title of the button as the text of the item


$('#menuItems-city').on('click', '.dd-city', function () {
  $('#dropdown_city').text($(this)[0].value);
  $("#dropdown_city").dropdown('toggle'); //add to hidden

  $('input[name=dropdown_region]').val($(this).attr('data-region'));
  $('input[name=dropdown_city]').val($(this).attr('data-city')); // set city  ( + region  if needed )

  setNewCityAndRegion($(this).attr('data-city'), $(this).attr('data-region')); // activate search

  if ($('#search_vacancy').length > 1) {
    $('#search_vacancy').trigger("input");
  } //console.log($(this).attr('data-city'));

});

function setNewCityAndRegion(city, region) {
  $.post({
    // async: false,
    // global: false,
    dataType: 'json',
    url: "/ajax/set-city-region",
    data: {
      //country: $('#countrySelect option:selected').val(),
      city: city,
      region: region,
      set_city: $('#dropdown_city_set').val()
    },
    headers: {
      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    },
    'success': function success(data) {
      //maybe alert?
      if ($('#city_id').length > 0) {
        $('#city_id').val(data).change();
        console.log('sdfds');
      }
    }
  });
}

var Login_Forgot =
/*#__PURE__*/
function () {
  function Login_Forgot() {
    _classCallCheck(this, Login_Forgot);

    this.check();
    this.submit_click();
  }

  _createClass(Login_Forgot, [{
    key: "check",
    value: function check() {
      $("#email-forgot-input").bind('input', function (e) {
        var valid = isEmail(this.value);

        if (valid == false) {
          $("#email-forgot-input").addClass('is-invalid');
        } else if (valid == true) {
          $("#email-forgot-input").removeClass('is-invalid');
          $('.email-forgot-mark').text(''); //console.log(valid)
        }

        return valid;
      }); // if right syntax
      // if exist
      // if ok - send
    }
  }, {
    key: "submit_click",
    value: function submit_click() {
      $(document).on("click hover", '#forgotCmdButton', function () {
        if (isEmail($("#email-forgot-input").val()) == true) {
          //console.log('clicked')
          // send request: true / false
          login_forgot.send_check();
        } else {
          $('.email-forgot-mark').text('error');
        }
      });
    }
  }, {
    key: "send_check",
    value: function send_check() {
      // send ajax
      $.ajax({
        type: "POST",
        url: "/ajax/send-forgot-email",
        headers: {
          'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        data: {
          email: $("#email-forgot-input").val()
        },
        success: function success(data) {
          if (data == 'doesnt_exist') {
            $('.email-forgot-mark').text('account with this email does not exist');
            $("#email-forgot-input").val('');
          } else if (data == 'true') {
            $('.email-forgot-mark').text('check email');
            $('input[name="email-login-input"]').val($("#email-forgot-input").val());
          }
        },
        error: function error() {}
      });
    }
  }]);

  return Login_Forgot;
}();

var login_forgot = new Login_Forgot();

var Login_set_new_pass =
/*#__PURE__*/
function () {
  function Login_set_new_pass() {
    _classCallCheck(this, Login_set_new_pass);

    this.check_first_pass();
    this.save();
  }

  _createClass(Login_set_new_pass, [{
    key: "check_first_pass",
    value: function check_first_pass() {
      var check = false;
      $(".passFormControlInput").bind('input', function (e) {
        var p_1 = $("#passFormControlInput1").val();
        var p_2 = $("#passFormControlInput2").val(); //console.log(p_1.localeCompare(p_2))
        // p_1.localeCompare(p_2) == 0

        if (p_1 == p_2 && p_1.length >= 8 && p_1.length <= 20) {
          check = true;
        } else {
          check = false;
        }

        if (check == true) {
          $('#save_recover_pass').removeAttr("disabled").fadeIn();
          $('#save_recover_pass').removeClass('d-none');
        } else {
          $('#save_recover_pass').attr("disabled", true).fadeOut();
        }
      });
      return check;
    }
  }, {
    key: "save",
    value: function save() {
      $(document).on("click hover", '#save_recover_pass', function () {
        //console.log('sdfsdf + 1')
        login_set_new_pass.save_call();
      });
    }
  }, {
    key: "save_call",
    value: function save_call() {
      // send ajax
      $.ajax({
        type: "POST",
        url: "/ajax/save-new-pass",
        headers: {
          'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        data: {
          p_1: $("#passFormControlInput1").val(),
          p_2: $("#passFormControlInput2").val(),
          k: $('#recovery_key').val()
        },
        success: function success(data) {
          if (data == 'true') {
            $('.recovery_save_form').text('Saved!');
          } else if (data == 'false') {//
          }
        },
        error: function error() {}
      });
    }
  }]);

  return Login_set_new_pass;
}();

var login_set_new_pass = new Login_set_new_pass(); // login

$(document).on("click hover", '#loginCmdButton', function () {
  var me = $('#' + $(this).closest("form").attr("id"));
  $("#loginCmdButton").attr("disabled", true);
  $.ajax({
    type: "POST",
    url: "/ajax/login",
    async: true,
    headers: {
      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    },
    data: me.serialize() + '&' + $.param({
      'Page': window.location.href
    }),
    // $.post("page.php",( $('#myForm').serialize()+'&'+$.param({ 'wordlist': wordlist })));
    //dataType: "json",
    success: function success(data) {
      $("#loginCmdButton").attr("disabled", false);

      if (data === 'false') {
        $('.form-login-error').hide().text('Error: fill form carefully').fadeIn();
        return;
      } //$('#formLogin').html(data + ', you have logged in <hr> <a href="/#postStuff" onClick="reloadAddStuff();" class="btn btn-block btn-primary">Would you like to post a stuff?</a> ');


      $('.form-login-error').text(''); //$('#login_place').html('<button class="btn btn-light btn-sm">' + data + '</button>');
      // to do: link to profile

      var linkToProfile = ' <a id="profile_link" href="' + (data[1] == 0 ? '/profile' : '/hr') + '">📙</a>';
      $('#loginModal').modal('hide');
      $('#login_place').html('Hi ' + data[0] + '! ' + linkToProfile);
      $('#login_place').addClass('animated fadeInDown');
      $('#signUp_place').remove();
      $('.button_login').remove();
    },
    error: function error() {
      alert('Error: try again');
      $("#loginCmdButton").attr("disabled", false);
    }
  });
});

function reloadAddStuff() {
  window.location.href = "/#postStuff";
  window.location.reload();
} // PASS event
// Get the input


var input_password = document.getElementById("password-input"); // Execute a function when the user releases a key on the keyboard

input_password.addEventListener("keyup", function (event) {
  var code = false;

  if (event.key !== undefined) {
    code = event.key;
  } else if (event.keyIdentifier !== undefined) {
    code = event.keyIdentifier;
  } else if (event.keyCode !== undefined) {
    code = event.keyCode;
  } // Cancel the default action, if needed
  //event.preventDefault();
  // Number 13 is the "Enter" key on the keyboard


  if (code == 'Enter' || code === 13) {
    // Trigger the button element with a click
    document.getElementById("loginCmdButton").click();
  }
}); // end pass
// activate tab - sign Up

$(document).on("click hover", '#login_place', function () {
  //$('#loginModal').modal('show');
  $('.nav-link[href="#home"]').trigger('click');
});

function isLoggedIn() {
  var status;
  $.ajax({
    type: "POST",
    url: "/ajax/login/check",
    async: false,
    headers: {
      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    },
    success: function success(data) {
      if (data.toString() == 'false') {
        $('#loginModal').modal('show'); // focus to email

        setTimeout(function () {
          $('input[name=email-login-input]').focus(); //console.log('focused')
        }, 500);
        status = false;
      } else {
        status = true;
      }
    },
    error: function error() {
      alert('Error: need to login');
    }
  });
  return status;
}

$(function () {
  $('[data-toggle="popover"]').popover();
});
$(function () {
  $('[data-toggle="tooltip"]').tooltip();
});
$(document).on("keyup", '.numbersOnly', function () {
  this.value = this.value.replace(/[^0-9\.]/g, '');
}); // slow scroll for programs

function quietScroll(block) {
  // if block doesn't exists
  if ($("#" + block).length == 0) {
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
  var param = 'fbclid';

  if (location.search.indexOf(param + '=') !== -1) {
    var replace = '';

    try {
      var url = new URL(location);
      url.searchParams["delete"](param);
      replace = url.href;
    } catch (ex) {
      var regExp = new RegExp('[?&]' + param + '=.*$');
      replace = location.search.replace(regExp, '');
      replace = location.pathname + replace + location.hash;
    }

    history.replaceState(null, '', replace);
  }
})(); // href to vacancy


$(document).on("click", '.job_offer', function () {
  var t = $(this),
      id = t.attr('data-id');
  var win = window.open('/vacancy/' + id, '_blank');
  win.focus();
}); // job apply

$(document).on("click", '.job_apply', function () {
  var t = $(this),
      id = t.attr('data-id'); // set cook for return users to apply after finish profile

  document.cookie = "attempt_to_apply=/vacancy/" + id + '; path=/'; // FB lead
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
}); // facebook login

function facebook() {
  $.ajax({
    type: "POST",
    url: "/facebook/fpp",
    async: true,
    headers: {
      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    },
    data: {
      'page': window.location.pathname
    },
    success: function success() {
      window.location.href = 'https://www.facebook.com/dialog/oauth?client_id=623450304729917&redirect_uri=https://cvmatograph.com/facebook&scope=email&response_type=code';
    } //
    // error: function () {
    //     alert('Error: try again');
    // }

  });
}

function LinkedIn() {
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
    data: {
      'name': $('.support_name').val(),
      'email': $('.support_email').val(),
      'question': $('.support_question').val()
    },
    success: function success() {
      //console.log('sent')
      $('.support_email').val('');
      $('.support_question').val('');
      $('.send_to_support').attr("disabled", true);
      $('.send_to_support').text('Sent');
    },
    error: function error() {
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
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}

var Portfolio_public =
/*#__PURE__*/
function () {
  function Portfolio_public() {
    _classCallCheck(this, Portfolio_public);

    this.like();
  }

  _createClass(Portfolio_public, [{
    key: "like",
    value: function like() {
      $(document).on("click hover", '.like_portfolio', function () {
        if (isLoggedIn() === false) {
          return;
        }

        if ($('span.like_portfolio.text-danger').length > 0) {
          //console.log('dddd');
          // remove class
          $('span.like_portfolio').removeClass('text-danger');

          portfolio_public._ajaxLikeRemove($(this).attr('data-id'));
        } else {
          // add class
          $('span.like_portfolio').addClass('text-danger'); // add like

          portfolio_public._ajaxLike($(this).attr('data-id'));
        }
      });
    } // add like

  }, {
    key: "_ajaxLike",
    value: function _ajaxLike(id) {
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
        success: function success() {},
        error: function error() {//alert('Error');
        }
      });
    } // remove like

  }, {
    key: "_ajaxLikeRemove",
    value: function _ajaxLikeRemove(id) {
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
        success: function success() {},
        error: function error() {//alert('Error');
        }
      });
    }
  }, {
    key: "save",
    value: function save() {}
  }]);

  return Portfolio_public;
}();

var portfolio_public = new Portfolio_public(); //

var PrepareVacancy =
/*#__PURE__*/
function () {
  function PrepareVacancy() {
    _classCallCheck(this, PrepareVacancy);

    this.next();
    this.check_companies_email();
  }

  _createClass(PrepareVacancy, [{
    key: "next",
    value: function next() {
      $(document).on("click hover", '#next_prepare_vacancy_block', function () {
        var st = 0; // remove red mark-mistakes

        $('.is-invalid').removeClass('is-invalid');
        $('.btn').blur(); // remove focus from button

        $(prepare_vacancy_blocks).each(function (index, element) {
          if ($('#' + element).is(':visible')) {
            st = index;
          } // reset focus


          $('.btn').blur();
        });

        if (prepare_vacancy.stages_condition(st) != true) {
          return;
        } // show next slide


        $('#' + prepare_vacancy_blocks[st + 1]).removeClass('d-none');
        $('#' + prepare_vacancy_blocks[st + 1]).addClass('wow fadeInLeft animated'); // animate next

        $('#' + prepare_vacancy_blocks[st]).addClass('d-none'); // hide
        //set focus from top

        quietScroll(prepare_vacancy_blocks[st + 1]);
      });
    }
  }, {
    key: "stages_condition",
    value: function stages_condition(st) {
      //console.log('stage: ' + st)
      // check stage 1
      if (st == 0) {
        return prepare_vacancy.check_block_1();
      } // check stage 2


      if (st == 1) {
        return prepare_vacancy.check_block_2();
      } // condition for last stage


      if (st == 2) {
        return prepare_vacancy.last_stage();
      } //return true;

    }
  }, {
    key: "check_block_1",
    value: function check_block_1() {
      // Business name
      if ($('#business_name').val() == '') {
        $('#business_name').addClass('is-invalid');
        quietScroll('business_name');
        return false;
      } // email


      if ($('#business-email').val() == '') {
        $('#business-email').addClass('is-invalid');
        quietScroll('business-email');
        return false;
      }

      if (isEmail($('#business-email').val()) == false) {
        $('#business-email').addClass('is-invalid');
        quietScroll('business-email');
        return false;
      } //phone


      if ($('#business-phone').val() == '') {
        $('#business-phone').addClass('is-invalid');
        quietScroll('business-phone');
        return false;
      } //postcode


      if ($('#business-postcode').val() == '') {
        $('#business-postcode').addClass('is-invalid');
        quietScroll('business-postcode');
        return false;
      } // check vacancy description


      if ($('#company_description').val().length < 100) {
        //console.log($('#company_description').val().length)
        $('#company_description').addClass('is-invalid');
        quietScroll('company_description');
        return false;
      }

      return true;
    }
  }, {
    key: "check_companies_email",
    value: function check_companies_email() {
      $("#business-email").bind('keyup input change', function (e) {
        var valid = isEmail(this.value); //console.log('ccc: ' + valid)

        if (valid === true) {
          $('.business-email-feedback').html('');
          $('.business-email-feedback').removeClass('text-danger');
          $('#business-email').removeClass('is-invalid');

          prepare_vacancy._ajaxEmailCheck($('#business-email').val());
        } else {
          $('.business-email-feedback').html('It\'s' + (valid ? '' : ' not') + ' valid');
          $('.business-email-feedback').addClass('text-danger');
          $('#business-email').addClass('is-invalid');
        }
      });
    }
  }, {
    key: "_ajaxEmailCheck",
    value: function _ajaxEmailCheck(bemail) {
      //console.log('send ajax when email checked')
      // send ajax
      $.ajax({
        type: "POST",
        url: "/ajax/check-companies-email",
        headers: {
          'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        data: {
          email: bemail
        },
        success: function success(data) {
          if (data == 'exist') {
            $('#business-email').val('');
            $('.business-email-feedback').text('Email already used, try another one');
            $('.business-email-feedback').addClass('text-danger');
          } else if (data == 'can_use') {
            $('.business-email-feedback').text(' email is valid');
            $('.business-email-feedback').addClass('text-success');
            $('.business-email-feedback').removeClass('text-danger');
          }
        },
        error: function error() {}
      });
    }
  }, {
    key: "check_block_2",
    value: function check_block_2() {
      // check vacancy_title
      if ($('#vacancy_title').val().length < 4) {
        $('#vacancy_title').addClass('is-invalid');
        quietScroll('vacancy_title');
        return false;
      } // check salary from


      if ($('#vacancy_salary_from').val() == '') {
        $('#vacancy_salary_from').addClass('is-invalid');
        quietScroll('vacancy_salary_from');
        return false;
      }

      $('#next_prepare_vacancy_block').text('POST');
      $('.policy_vacancy').removeClass('d-none');
      return true;
    }
  }, {
    key: "last_stage",
    value: function last_stage() {
      // check vacancy description
      if ($('#vacancy_description').val().length < 100) {
        //console.log($('#vacancy_description').val().length)
        $('#vacancy_description').addClass('is-invalid');
        quietScroll('vacancy_description');
        return false;
      } // else {
      //
      //     $('#vacancy_description').removeClass('is-invalid')
      // }


      $('#next_prepare_vacancy_block').hide(); //$('#next_prepare_vacancy_block').addClass('d-none')

      $('.policy_vacancy').addClass('d-none');

      prepare_vacancy._ajaxSave();

      return true;
    }
  }, {
    key: "_ajaxSave",
    value: function _ajaxSave() {
      //let me = $('#create_companies_vacancy_public').find('input');
      var me = $('#create_companies_vacancy :input').serialize(); // .find('select, textarea, input')
      //console.log( me ); // .form-control

      $.ajax({
        type: "POST",
        url: "/ajax/save_companies_vacancy",
        async: true,
        headers: {
          'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        data: me,
        // + '&' + $.param({'Page': window.location.href}),  // $.post("page.php",( $('#myForm').serialize()+'&'+$.param({ 'wordlist': wordlist })));
        //dataType: "json",
        success: function success(data) {
          // clean form
          $('.form-control').val('');
        },
        error: function error() {
          alert('Error: try again');
        }
      });
    }
  }]);

  return PrepareVacancy;
}();

var prepare_vacancy_blocks = ['prepare_vacancy_1', 'prepare_vacancy_2', 'prepare_vacancy_3', 'prepare_vacancy_4'];
var prepare_vacancy = new PrepareVacancy(); // $(document).on("click", '#profiles_video', function () {
//
//     console.log('cl')
// });
// $('#profiles_video').bind('play', function (e) {
//     // Hide Middle Play button
//
//     console.log('cl +')
//
//     $('#profiles_video').attr('src', '/storage/app/public/video/6cY0LbAm7qHtBlFcpvKlSbcCFUC1I9zLF2meXq0O.mp4');
//
//     $('#profiles_video').get(0).play();
//
// });
// let pvid = document.getElementById("profiles_video");
// //
// pvid.onplaying = function() {
//
//     alert("The video is now playing");
//
//     console.log('cl ++')
// };

var SearchVacancy =
/*#__PURE__*/
function () {
  function SearchVacancy() {
    _classCallCheck(this, SearchVacancy);

    this.search();
  }

  _createClass(SearchVacancy, [{
    key: "search",
    value: function search() {
      var typingTimer; //timer identifier

      var doneTypingInterval = 1000; //time in ms (0.3 seconds)

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
            search_vacancy.search_request();
          }, 1200); //$('#' + ids_save_mark).show().addClass('animated bounceIn').fadeOut('slow');
        }, doneTypingInterval);
      });
    }
    /**
     * ajax request
     */

  }, {
    key: "search_request",
    value: function search_request() {
      $.ajax({
        type: "POST",
        url: "/ajax/search_vacancy",
        async: true,
        headers: {
          'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        data: {
          letters: $('#search_vacancy').val()
        },
        dataType: "json",
        success: function success(data) {
          // clean
          $('#search_vacancy_result').html(''); // if($("[name=dropdown_city]").val() == ''){
          //
          //     $('#search_vacancy_result').html(' &nbsp;  &nbsp;  &nbsp; chose city, ')
          // }

          if (data.length == 0) {
            //console.log("NO DATA!")
            $('#search_vacancy_result').append(' &nbsp;  &nbsp;  &nbsp; no records'); // clean

            $('#search_vacancy').val('');
          } else {
            // set focus on result
            quietScroll('search_vacancy_result');
            $.each(data, function (k, v) {
              /// do stuff
              //console.log(data[k].description)
              $('#search_vacancy_result').append(search_vacancy.template(data[k]));
            });
          }
        },
        error: function error() {
          alert('Error');
        }
      });
    }
  }, {
    key: "template",
    value: function template(arr) {
      var html = '<div class="card my_card_300 mt-5 job_offer" data-id="' + arr.id + '">\n' + '                <div class="card-header">\n' + '                    <div class="row">\n' + '                        <div class="col-8">\n' + '                            <strong class="card-title">' + arr.title + '</strong>\n' + '                        </div>\n' + '                        <div class="col-4 text-right">\n' + '                            <small class="text-capitalize text-dark text-right"> £' + (arr.salary_to !== '0.00' ? arr.salary_to : arr.salary_from) + ' \n' + '                                <span class="text-lowercase">' + arr.period + '</span></small>\n' + '                        </div>\n' + '                    </div>\n' + '                </div>\n' + '                <div class="card-body d-flex flex-column">\n' + '                    <p class="card-text text-justify">\n' + '                        ' + arr.description + '  ...\n' + '                    </p>\n' + '                    <div class="row mt-3">\n' + '                        <div class="col-6">\n' + '                            <small class="text-capitalize font-italic text-muted"> ' + arr.name_company + ' \n' + '                                <span class="text-lowercase"> ' + arr.employment_type + ' </span></small>\n' + '                        </div>' + '                        <div class="col-6 text-right">\n' + '                            <object type="image/svg+xml" data="/img/point.svg">' + '                            </object>' + '                            <small class="text-capitalize font-italic text-muted">\n' + '                                ' + arr.address + ' </small>\n' + '                        </div>\n' + '                    </div>\n' + '                </div>\n' + '                <div class="card-footer bg-transparent">\n' + '                    <a href="/vacancy/' + arr.id + '" target="_blank" class="btn btn-outline-primary  btn-block btn-sm applyJob_button_' + arr.id + '"> view </a>\n' + '                </div>\n' + '            </div>';
      return html;
    }
  }]);

  return SearchVacancy;
}();

var search_vacancy = new SearchVacancy(); // login

$(document).on("click hover", '#signupCmdButton', function () {
  //$('#english_courses_full').addClass("animated slideOutRight");
  var me = $('#' + $(this).closest("form").attr("id")); //$("#form-first");

  $.ajax({
    type: "POST",
    url: "/ajax/signup",
    async: true,
    headers: {
      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    },
    data: me.serialize() + '&' + $.param({
      'Page': window.location.href
    }),
    // $.post("page.php",( $('#myForm').serialize()+'&'+$.param({ 'wordlist': wordlist })));
    //dataType: "json",
    success: function success(data) {
      if (data === 'false') {
        $('.form-signup-error').hide().text('Error: fill form carefully').fadeIn();
        return;
      }

      if (data == 'email_exists') {
        $('.form-signup-error').hide().text('Error: email exists').fadeIn();
        return;
      } //$('#formSignup').html('success, now you can login');


      $('#signupCmdButton').attr("disabled", true);
      $('.form-signup-error').text('');
      signup.fillLogin();
      /*
       relocete to worker's profile
       */

      if (data == '0') {
        signup.relocateToWorkerProfile();
      } else {
        signup.relocateToHrProfile();
      }
    },
    error: function error() {
      alert('Error: try again'); // dsfsdfsdf
    }
  });
}); // activate tab forgotten_account

$(document).on("click hover", '.forgotten_account', function () {
  $('.nav-link[href="#forgot"]').trigger('click').show();
}); // activate tab - sign Up

$(document).on("click hover", '#signUp_place', function () {
  $('#loginModal').modal('show');
  $('.nav-link[href="#profile"]').trigger('click');
});

var signUp =
/*#__PURE__*/
function () {
  function signUp() {
    _classCallCheck(this, signUp);
  }

  _createClass(signUp, [{
    key: "fillLogin",
    // after susses registration we will fill form and after login
    value: function fillLogin() {
      $('#formLogin input[name=email-login-input]').val($('input[name=email-input]').val());
      $('#formLogin input[name=pass-login-input]').val($('input[name=password-input]').val());
      $('#loginCmdButton').click();
    }
  }, {
    key: "relocateToWorkerProfile",
    value: function relocateToWorkerProfile() {
      setTimeout(function () {
        window.location.href = '/new_profile';
      }, 500);
    }
  }, {
    key: "relocateToHrProfile",
    value: function relocateToHrProfile() {
      setTimeout(function () {
        window.location.href = '/hr';
      }, 500);
    }
  }]);

  return signUp;
}();

var signup = new signUp();
$(document).on("click hover", '#uploadVideo', function () {
  $('#spin_upload').html(' <br>uploading, please wait <img src="/img/spin.gif">').fadeIn();
  $("#uploadVideo").attr("disabled", true);
  $('.create_video_button').text('Try again');
  var formData = new FormData();
  formData.append('file', $('#recorder')[0].files[0]);
  $.ajax({
    type: "POST",
    url: "/ajax/upload_video",
    data: formData,
    processData: false,
    contentType: false,
    headers: {
      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    },
    //dataType: "json",
    success: function success(data) {
      //$('#spin_upload').html(' success! ');
      $("#spin_upload").html(' &nbsm; uploaded! '); // .delay("slow").fadeOut()

      $("#uploadVideo").attr("disabled", false);
      $("#uploadVideo").hide();
      var video = document.getElementById('profiles_video');
      video.src = '/storage/video/' + data;
      $('#profiles_video').removeClass('d-none'); // video_upload

      $('#video_upload').modal('hide'); // to do
      //console.log('success')
      // next slide - new profile

      $('#Wbutton_next').click();
    },
    error: function error() {
      alert('Error: try again');
      $("#spin_upload").html(' fail, try again ').addClass('text-danger');
      $("#uploadVideo").attr("disabled", false); // to do detect - fail ...
    }
  }); //console.log('click')
});

function phoneVideoButton() {
  //id
  $('#video_upload').modal('show');
  $('#add_video').html('<input type="file" class="btn btn-outline-primary" accept="video/*;image/*" onchange="checkDuration()" id="recorder" capture="environment" required>'); // ' + id + '
  // hide button + click

  $('#recorder').css('display', 'none');
  $('#recorder').click(); // for check duration

  var recorder = document.getElementById('recorder');
  var player = document.getElementById('player');
  recorder.addEventListener('change', function (e) {
    var file = e.target.files[0]; // Do something with the video file.

    player.src = URL.createObjectURL(file);
  });
}
/*! WOW wow.js - v1.3.0 - 2016-10-04
* https://wowjs.uk
* Copyright (c) 2016 Thomas Grainger; Licensed MIT */


!function (a, b) {
  if ("function" == typeof define && define.amd) define(["module", "exports"], b);else if ("undefined" != typeof exports) b(module, exports);else {
    var c = {
      exports: {}
    };
    b(c, c.exports), a.WOW = c.exports;
  }
}(this, function (a, b) {
  "use strict";

  function c(a, b) {
    if (!(a instanceof b)) throw new TypeError("Cannot call a class as a function");
  }

  function d(a, b) {
    return b.indexOf(a) >= 0;
  }

  function e(a, b) {
    for (var c in b) {
      if (null == a[c]) {
        var d = b[c];
        a[c] = d;
      }
    }

    return a;
  }

  function f(a) {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(a);
  }

  function g(a) {
    var b = arguments.length <= 1 || void 0 === arguments[1] ? !1 : arguments[1],
        c = arguments.length <= 2 || void 0 === arguments[2] ? !1 : arguments[2],
        d = arguments.length <= 3 || void 0 === arguments[3] ? null : arguments[3],
        e = void 0;
    return null != document.createEvent ? (e = document.createEvent("CustomEvent"), e.initCustomEvent(a, b, c, d)) : null != document.createEventObject ? (e = document.createEventObject(), e.eventType = a) : e.eventName = a, e;
  }

  function h(a, b) {
    null != a.dispatchEvent ? a.dispatchEvent(b) : b in (null != a) ? a[b]() : "on" + b in (null != a) && a["on" + b]();
  }

  function i(a, b, c) {
    null != a.addEventListener ? a.addEventListener(b, c, !1) : null != a.attachEvent ? a.attachEvent("on" + b, c) : a[b] = c;
  }

  function j(a, b, c) {
    null != a.removeEventListener ? a.removeEventListener(b, c, !1) : null != a.detachEvent ? a.detachEvent("on" + b, c) : delete a[b];
  }

  function k() {
    return "innerHeight" in window ? window.innerHeight : document.documentElement.clientHeight;
  }

  Object.defineProperty(b, "__esModule", {
    value: !0
  });

  var l,
      m,
      n = function () {
    function a(a, b) {
      for (var c = 0; c < b.length; c++) {
        var d = b[c];
        d.enumerable = d.enumerable || !1, d.configurable = !0, "value" in d && (d.writable = !0), Object.defineProperty(a, d.key, d);
      }
    }

    return function (b, c, d) {
      return c && a(b.prototype, c), d && a(b, d), b;
    };
  }(),
      o = window.WeakMap || window.MozWeakMap || function () {
    function a() {
      c(this, a), this.keys = [], this.values = [];
    }

    return n(a, [{
      key: "get",
      value: function value(a) {
        for (var b = 0; b < this.keys.length; b++) {
          var c = this.keys[b];
          if (c === a) return this.values[b];
        }
      }
    }, {
      key: "set",
      value: function value(a, b) {
        for (var c = 0; c < this.keys.length; c++) {
          var d = this.keys[c];
          if (d === a) return this.values[c] = b, this;
        }

        return this.keys.push(a), this.values.push(b), this;
      }
    }]), a;
  }(),
      p = window.MutationObserver || window.WebkitMutationObserver || window.MozMutationObserver || (m = l = function () {
    function a() {
      c(this, a), "undefined" != typeof console && null !== console && (console.warn("MutationObserver is not supported by your browser."), console.warn("WOW.js cannot detect dom mutations, please call .sync() after loading new content."));
    }

    return n(a, [{
      key: "observe",
      value: function value() {}
    }]), a;
  }(), l.notSupported = !0, m),
      q = window.getComputedStyle || function (a) {
    var b = /(\-([a-z]){1})/g;
    return {
      getPropertyValue: function getPropertyValue(c) {
        "float" === c && (c = "styleFloat"), b.test(c) && c.replace(b, function (a, b) {
          return b.toUpperCase();
        });
        var d = a.currentStyle;
        return (null != d ? d[c] : void 0) || null;
      }
    };
  },
      r = function () {
    function a() {
      var b = arguments.length <= 0 || void 0 === arguments[0] ? {} : arguments[0];
      c(this, a), this.defaults = {
        boxClass: "wow",
        animateClass: "animated",
        offset: 0,
        mobile: !0,
        live: !0,
        callback: null,
        scrollContainer: null,
        resetAnimation: !0
      }, this.animate = function () {
        return "requestAnimationFrame" in window ? function (a) {
          return window.requestAnimationFrame(a);
        } : function (a) {
          return a();
        };
      }(), this.vendors = ["moz", "webkit"], this.start = this.start.bind(this), this.resetAnimation = this.resetAnimation.bind(this), this.scrollHandler = this.scrollHandler.bind(this), this.scrollCallback = this.scrollCallback.bind(this), this.scrolled = !0, this.config = e(b, this.defaults), null != b.scrollContainer && (this.config.scrollContainer = document.querySelector(b.scrollContainer)), this.animationNameCache = new o(), this.wowEvent = g(this.config.boxClass);
    }

    return n(a, [{
      key: "init",
      value: function value() {
        this.element = window.document.documentElement, d(document.readyState, ["interactive", "complete"]) ? this.start() : i(document, "DOMContentLoaded", this.start), this.finished = [];
      }
    }, {
      key: "start",
      value: function value() {
        var a = this;
        if (this.stopped = !1, this.boxes = [].slice.call(this.element.querySelectorAll("." + this.config.boxClass)), this.all = this.boxes.slice(0), this.boxes.length) if (this.disabled()) this.resetStyle();else for (var b = 0; b < this.boxes.length; b++) {
          var c = this.boxes[b];
          this.applyStyle(c, !0);
        }

        if (this.disabled() || (i(this.config.scrollContainer || window, "scroll", this.scrollHandler), i(window, "resize", this.scrollHandler), this.interval = setInterval(this.scrollCallback, 50)), this.config.live) {
          var d = new p(function (b) {
            for (var c = 0; c < b.length; c++) {
              for (var d = b[c], e = 0; e < d.addedNodes.length; e++) {
                var f = d.addedNodes[e];
                a.doSync(f);
              }
            }
          });
          d.observe(document.body, {
            childList: !0,
            subtree: !0
          });
        }
      }
    }, {
      key: "stop",
      value: function value() {
        this.stopped = !0, j(this.config.scrollContainer || window, "scroll", this.scrollHandler), j(window, "resize", this.scrollHandler), null != this.interval && clearInterval(this.interval);
      }
    }, {
      key: "sync",
      value: function value() {
        p.notSupported && this.doSync(this.element);
      }
    }, {
      key: "doSync",
      value: function value(a) {
        if ("undefined" != typeof a && null !== a || (a = this.element), 1 === a.nodeType) {
          a = a.parentNode || a;

          for (var b = a.querySelectorAll("." + this.config.boxClass), c = 0; c < b.length; c++) {
            var e = b[c];
            d(e, this.all) || (this.boxes.push(e), this.all.push(e), this.stopped || this.disabled() ? this.resetStyle() : this.applyStyle(e, !0), this.scrolled = !0);
          }
        }
      }
    }, {
      key: "show",
      value: function value(a) {
        return this.applyStyle(a), a.className = a.className + " " + this.config.animateClass, null != this.config.callback && this.config.callback(a), h(a, this.wowEvent), this.config.resetAnimation && (i(a, "animationend", this.resetAnimation), i(a, "oanimationend", this.resetAnimation), i(a, "webkitAnimationEnd", this.resetAnimation), i(a, "MSAnimationEnd", this.resetAnimation)), a;
      }
    }, {
      key: "applyStyle",
      value: function value(a, b) {
        var c = this,
            d = a.getAttribute("data-wow-duration"),
            e = a.getAttribute("data-wow-delay"),
            f = a.getAttribute("data-wow-iteration");
        return this.animate(function () {
          return c.customStyle(a, b, d, e, f);
        });
      }
    }, {
      key: "resetStyle",
      value: function value() {
        for (var a = 0; a < this.boxes.length; a++) {
          var b = this.boxes[a];
          b.style.visibility = "visible";
        }
      }
    }, {
      key: "resetAnimation",
      value: function value(a) {
        if (a.type.toLowerCase().indexOf("animationend") >= 0) {
          var b = a.target || a.srcElement;
          b.className = b.className.replace(this.config.animateClass, "").trim();
        }
      }
    }, {
      key: "customStyle",
      value: function value(a, b, c, d, e) {
        return b && this.cacheAnimationName(a), a.style.visibility = b ? "hidden" : "visible", c && this.vendorSet(a.style, {
          animationDuration: c
        }), d && this.vendorSet(a.style, {
          animationDelay: d
        }), e && this.vendorSet(a.style, {
          animationIterationCount: e
        }), this.vendorSet(a.style, {
          animationName: b ? "none" : this.cachedAnimationName(a)
        }), a;
      }
    }, {
      key: "vendorSet",
      value: function value(a, b) {
        for (var c in b) {
          if (b.hasOwnProperty(c)) {
            var d = b[c];
            a["" + c] = d;

            for (var e = 0; e < this.vendors.length; e++) {
              var f = this.vendors[e];
              a["" + f + c.charAt(0).toUpperCase() + c.substr(1)] = d;
            }
          }
        }
      }
    }, {
      key: "vendorCSS",
      value: function value(a, b) {
        for (var c = q(a), d = c.getPropertyCSSValue(b), e = 0; e < this.vendors.length; e++) {
          var f = this.vendors[e];
          d = d || c.getPropertyCSSValue("-" + f + "-" + b);
        }

        return d;
      }
    }, {
      key: "animationName",
      value: function value(a) {
        var b = void 0;

        try {
          b = this.vendorCSS(a, "animation-name").cssText;
        } catch (c) {
          b = q(a).getPropertyValue("animation-name");
        }

        return "none" === b ? "" : b;
      }
    }, {
      key: "cacheAnimationName",
      value: function value(a) {
        return this.animationNameCache.set(a, this.animationName(a));
      }
    }, {
      key: "cachedAnimationName",
      value: function value(a) {
        return this.animationNameCache.get(a);
      }
    }, {
      key: "scrollHandler",
      value: function value() {
        this.scrolled = !0;
      }
    }, {
      key: "scrollCallback",
      value: function value() {
        if (this.scrolled) {
          this.scrolled = !1;

          for (var a = [], b = 0; b < this.boxes.length; b++) {
            var c = this.boxes[b];

            if (c) {
              if (this.isVisible(c)) {
                this.show(c);
                continue;
              }

              a.push(c);
            }
          }

          this.boxes = a, this.boxes.length || this.config.live || this.stop();
        }
      }
    }, {
      key: "offsetTop",
      value: function value(a) {
        for (; void 0 === a.offsetTop;) {
          a = a.parentNode;
        }

        for (var b = a.offsetTop; a.offsetParent;) {
          a = a.offsetParent, b += a.offsetTop;
        }

        return b;
      }
    }, {
      key: "isVisible",
      value: function value(a) {
        var b = a.getAttribute("data-wow-offset") || this.config.offset,
            c = this.config.scrollContainer && this.config.scrollContainer.scrollTop || window.pageYOffset,
            d = c + Math.min(this.element.clientHeight, k()) - b,
            e = this.offsetTop(a),
            f = e + a.clientHeight;
        return d >= e && f >= c;
      }
    }, {
      key: "disabled",
      value: function value() {
        return !this.config.mobile && f(navigator.userAgent);
      }
    }]), a;
  }();

  b["default"] = r, a.exports = b["default"];
});
new WOW().init();
