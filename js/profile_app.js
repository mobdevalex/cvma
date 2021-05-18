function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

$(document).on("change", '#attach_cv', function () {
  var formData = new FormData();
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
    success: function success(data) {
      // $('div.has-success div.form-control-feedback', me).text('Сообщение успешно отправлено! Мы обязательно свяжемся с Вами.').fadeOut(10000);
      // $(me).trigger("reset");
      //console.log('success up');
      $('.custom-file-cv').text('Attached!');
    },
    error: function error(e) {
      alert('Error: try right format: DOC / PDF / RTF'); // dsfsdfsdf
    }
  });
});
$uploadCrop = $('#upload-demo').croppie({
  enableExif: true,
  viewport: {
    width: 150,
    height: 150,
    type: 'circle'
  },
  boundary: {
    width: 280,
    height: 280
  }
});
$('#upload').on('change', function () {
  var reader = new FileReader();
  $('.upload-result').removeClass('d-none');

  reader.onload = function (e) {
    $uploadCrop.croppie('bind', {
      url: e.target.result
    }).then(function () {//console.log('jQuery bind complete');
    });
  };

  reader.readAsDataURL(this.files[0]);
});
$('.upload-result').on('click', function (ev) {
  $uploadCrop.croppie('result', {
    type: 'canvas',
    size: 'viewport'
  }).then(function (resp) {
    $.ajax({
      url: "/ajax/upload_photo",
      type: "POST",
      data: {
        "image": resp
      },
      headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
      },
      success: function success(data) {
        html = '<img class="mt-5" src="' + resp + '" />'; //$("#upload-demo-i").html(html);

        $('#profile_img').html(html);
        $('#photo_upload').modal('hide'); // next slide - new profile

        $('#Wbutton_next').click();
      }
    });
  });
});

var Education =
/*#__PURE__*/
function () {
  function Education() {
    _classCallCheck(this, Education);

    this.get();
    this.insert();
    this.update();
    this["delete"]();
  }

  _createClass(Education, [{
    key: "insert",
    value: function insert() {
      $(document).on("click hover", '#add_education', function () {
        $.ajax({
          type: "POST",
          url: "/ajax/add_education",
          async: true,
          headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
          },
          data: {
            education: $('#education').val()
          },
          //dataType: "json",
          success: function success(data) {
            $('#education_worker').modal('hide');
            $('#education_block').append('<div style="cursor: pointer" id="education_' + data + '" class="col-12 mt-4 p-3 border border-success rounded  wow fadeInUp text-primary edit_education" data-id="' + data + '">' + $('#education').val() + '</div>'); //$('#worker_experience').find('input:text, textarea').val('');

            $('#education').val('');
            quietScroll("education_" + data); //window.location.reload();
          },
          error: function error() {
            alert('Error');
          }
        });
      });
    }
  }, {
    key: "get",
    value: function get() {
      $(document).on("click hover", '.edit_education', function () {
        var id = $(this).attr('data-id');
        $.ajax({
          type: "POST",
          url: "/ajax/get_education",
          async: true,
          headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
          },
          data: {
            id: id //$(this).attr('data-id')

          },
          //dataType: "json",
          success: function success(data) {
            var obj = JSON.parse(JSON.stringify(data)); //console.log(obj[0]['company_name'])

            $('#education_edit').val(obj[0]['edesc']);
            $('#delete_education').attr('data-id', id);
            $('#update_education').attr('data-id', id);
            $('#edit_education').modal('show');
          },
          error: function error() {
            alert('Error');
          }
        });
      });
    }
  }, {
    key: "update",
    value: function update() {
      $(document).on("click hover", '#update_education', function () {
        var click_id = $(this).attr('data-id');
        $.ajax({
          type: "POST",
          url: "/ajax/update_education",
          async: true,
          headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
          },
          data: {
            id: click_id,
            education: $('#education_edit').val()
          },
          //dataType: "json",
          success: function success() {
            $('#education_' + click_id).hide();
            $('#education_' + click_id).html($('#education_edit').val());
            $('#edit_education').modal('hide');
            $('#education').find('textarea').val('');
            $('#education_' + click_id).fadeIn('slow'); //console.log(click_id)
            //window.location.reload();
          },
          error: function error() {
            alert('Error');
          }
        });
        quietScroll('education_' + click_id);
      });
    }
  }, {
    key: "delete",
    value: function _delete() {
      $(document).on("click hover", '#delete_education', function () {
        var id = $(this).attr('data-id');
        console.log(id);
        $.ajax({
          type: "POST",
          url: "/ajax/del_education",
          async: true,
          headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
          },
          data: {
            id: id //$(this).attr('data-id')

          },
          //dataType: "json",
          success: function success(a) {
            $('#edit_education').modal('hide');
            $('#education_' + id).remove();
            quietScroll("education_block");
          },
          error: function error() {
            alert('Error');
          }
        });
      });
    }
  }]);

  return Education;
}();

new Education();

var Experience =
/*#__PURE__*/
function () {
  function Experience() {
    _classCallCheck(this, Experience);

    this.add();
    this.get();
    this.update();
    this["delete"]();
  }

  _createClass(Experience, [{
    key: "add",
    value: function add() {
      $(document).on("click hover", '#add_experience', function () {
        $.ajax({
          type: "POST",
          url: "/ajax/add_experience",
          async: true,
          headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
          },
          data: {
            job_category: $('#job_category').val(),
            workers_position: $('#workers_position').val(),
            company_name: $('#company_name').val(),
            years_of_work: $('#years_of_work').val(),
            year_start: $('#year_start').val(),
            currently_here: $('#currently_here').prop('checked') ? 1 : 0,
            responsibilities: $('#responsibilities').val()
          },
          //dataType: "json",
          success: function success(data) {
            $('#worker_experience').modal('hide');
            $('#experience_block').append('<div style="cursor: pointer" id="experience_' + data + '" class="col-12 mt-4 p-3 border border-success rounded  wow fadeInUp text-primary edit_experience" data-id="' + data + '">' + $('#workers_position').val() + ' / ' + $('#company_name').val() + ': ' + $('#years_of_work').val() + 'y</div>');
            $('#worker_experience').find('input:text, textarea').val('');
            quietScroll("experience_" + data); //window.location.reload();
          },
          error: function error() {
            alert('Error');
          }
        });
      });
    }
  }, {
    key: "get",
    value: function get() {
      $(document).on("click hover", '.edit_experience', function () {
        //console.log($(this).attr('data-id'));
        var id = $(this).attr('data-id');
        $.ajax({
          type: "POST",
          url: "/ajax/get_experience",
          async: true,
          headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
          },
          data: {
            id: id //$(this).attr('data-id')

          },
          //dataType: "json",
          success: function success(data) {
            var obj = JSON.parse(JSON.stringify(data)); //console.log(obj[0]['company_name'])

            $('#workers_position_edit').val(obj[0]['position']); // set select ...

            $('#job_category_edit').val(obj[0]['id_category_job']).change();
            $('#company_name_edit').val(obj[0]['company_name']);
            $('#years_of_work_edit').val(obj[0]['years']);
            $('#year_start_edit').val(obj[0]['year_start'] == 0 ? '' : obj[0]['year_start']);

            if (obj[0]['currently_here'] == '1') {
              $("#currently_here_edit").prop('checked', true);
            } else {
              $("#currently_here_edit").prop('checked', false);
            }

            $('#responsibilities_edit').val(obj[0]['responsibilities']);
            $('#delete_experience').attr('data-id', id);
            $('#update_experience').attr('data-id', id); // open modal

            $('#edit_experience').modal('show');
          },
          error: function error() {
            alert('Error');
          }
        });
      });
    }
  }, {
    key: "update",
    value: function update() {
      $(document).on("click hover", '#update_experience', function () {
        var click_id = $(this).attr('data-id');
        $.ajax({
          type: "POST",
          url: "/ajax/update_experience",
          async: true,
          headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
          },
          data: {
            id: click_id,
            job_category: $('#job_category_edit').val(),
            workers_position: $('#workers_position_edit').val(),
            company_name: $('#company_name_edit').val(),
            years_of_work: $('#years_of_work_edit').val(),
            year_start: $('#year_start_edit').val(),
            currently_here: $('#currently_here_edit').prop('checked') ? 1 : 0,
            responsibilities: $('#responsibilities_edit').val()
          },
          //dataType: "json",
          success: function success() {
            $('#experience_' + click_id).hide();
            $('#experience_' + click_id).html($('#workers_position_edit').val() + ' / ' + $('#company_name_edit').val());
            $('#edit_experience').modal('hide');
            $('#edit_experience').find('input:text, textarea').val('');
            $('#experience_' + click_id).fadeIn('slow'); //window.location.reload();
          },
          error: function error() {
            alert('Error');
          }
        });
        quietScroll("experience_" + click_id);
      });
    }
  }, {
    key: "delete",
    value: function _delete() {
      $(document).on("click hover", '#delete_experience', function () {
        var click_id = $(this).attr('data-id'); //console.log(id);

        $.ajax({
          type: "POST",
          url: "/ajax/delete_experience",
          async: true,
          headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
          },
          data: {
            id: click_id
          },
          //dataType: "json",
          success: function success() {
            $('#edit_experience').modal('hide');
            $('#experience_' + click_id).remove();
          },
          error: function error() {
            alert('Error');
          }
        });
      });
    }
  }]);

  return Experience;
}();

var experience = new Experience();

var Hr_add_vacancy =
/*#__PURE__*/
function () {
  function Hr_add_vacancy() {
    _classCallCheck(this, Hr_add_vacancy);

    this.add_vacancy();
    this.change_button_add();
  }

  _createClass(Hr_add_vacancy, [{
    key: "validation",
    value: function validation() {
      if (this.isEmpty('vacancy_title') == false) {
        return false;
      }

      if (this.isEmpty('vacancy_description') == false) {
        return false;
      }

      if (this.isEmpty('vacancy_salary_from') == false) {
        return false;
      }

      return true;
    }
  }, {
    key: "isEmpty",
    value: function isEmpty(id) {
      if ($('#' + id).val() == '') {
        $('#' + id).addClass('is-invalid'); //$.scrollTo($("#vacancy_title"))

        var elem = document.getElementById(id);
        elem.scrollIntoView();
        return false;
      }

      $('#' + id).removeClass('is-invalid');
      return true;
    }
    /**
     * edd vacancy
     * POST
     */

  }, {
    key: "add_vacancy",
    value: function add_vacancy() {
      $(document).on("click hover", '#add_vacancy_button', function () {
        // prevent for update
        if ($('#add_vacancy_button').text() !== 'Add') {
          return;
        }

        if (HR_add_vacancy.validation() == false) {
          return;
        }

        $('#add_vacancy_button').attr("disabled", true);
        $.ajax({
          type: "POST",
          url: "/ajax/hr/add_vacancy",
          headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
          },
          data: {
            title: $('#vacancy_title').val(),
            description: $('#vacancy_description').val(),
            full_time: $('#vacancy_fullTime:checked').val() ? 1 : 0,
            part_time: $('#vacancy_partTime:checked').val() ? 1 : 0,
            urgent: $('#vacancy_urgent:checked').val() ? 1 : 0,
            immediate_start: $('#vacancy_immediateStart:checked').val() ? 1 : 0,
            experience_not_required: $('#vacancy_experienceNot:checked').val() ? 1 : 0,
            shifts: $('#vacancy_shifts').val(),
            salary_from: $('#vacancy_salary_from').val(),
            salary_to: $('#vacancy_salary_to').val() ? $('#vacancy_salary_to').val() : 0,
            period: $('#vacancy_period').val(),
            extra_options: $('#vacancy_extra').val()
          },
          //dataType: "json",
          success: function success() {
            // hide modal
            $('#vacancyModal').modal('hide'); // clean form

            document.getElementById("hr_vacancy_form").reset();
            $('#add_vacancy_button').attr("disabled", false);
            setTimeout(function () {
              window.location.reload();
            }, 800);
          },
          error: function error() {
            $('#add_vacancy_button').attr("disabled", false);
            alert('Error');
          }
        });
      });
    }
  }, {
    key: "change_button_add",
    value: function change_button_add() {
      $(document).on("click hover", '#vacancy_add_button', function () {
        $('#add_vacancy_button').text('Add');
        document.getElementById("hr_vacancy_form").reset();
        $('#add_vacancy_button').attr('data-id', ''); // clean form (if was update)

        document.getElementById("hr_vacancy_form").reset();
      });
    }
  }]);

  return Hr_add_vacancy;
}();

var HR_add_vacancy = new Hr_add_vacancy();

var Hr_edit_vacancy =
/*#__PURE__*/
function () {
  function Hr_edit_vacancy() {
    _classCallCheck(this, Hr_edit_vacancy);

    this.fill_form();
    this.update_post();
    this["delete"]();
  }

  _createClass(Hr_edit_vacancy, [{
    key: "fill_form",
    value: function fill_form() {
      $(document).on("click hover", '.hrs_vacancy', function () {
        // show modal
        $('#vacancyModal').modal('show'); // change text button

        $('#add_vacancy_button').text('Update'); // clean style

        $('#vacancy_title').removeClass('is-invalid');
        $('#vacancy_description').removeClass('is-invalid');
        $('#vacancy_salary_from').removeClass('is-invalid');
        var id = $(this).attr('d-id');
        $.ajax({
          type: "POST",
          url: "/ajax/hr/get_vacancy",
          headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
          },
          data: {
            id: id
          },
          dataType: "json",
          success: function success(data) {
            hr_edit_vacancy.fill_modal_form(data);
          },
          error: function error() {}
        });
      });
    }
  }, {
    key: "fill_modal_form",
    value: function fill_modal_form(data) {
      console.log(data[0].id);
      $('#add_vacancy_button').attr('data-id', data[0].id);
      $('#vacancy_title').val(data[0].title);
      $('#vacancy_description').val(data[0].description);
      data[0].full_time === 1 ? $('#vacancy_fullTime').prop("checked", true) : $('#vacancy_fullTime').prop("checked", false);
      data[0].part_time === 1 ? $('#vacancy_partTime').prop("checked", true) : $('#vacancy_partTime').prop("checked", false);
      data[0].urgent === 1 ? $('#vacancy_urgent').prop("checked", true) : $('#vacancy_urgent').prop("checked", false);
      data[0].immediate_start === 1 ? $('#vacancy_immediateStart').prop("checked", true) : $('#vacancy_immediateStart').prop("checked", false);
      data[0].experience_not_required === 1 ? $('#vacancy_experienceNot').prop("checked", true) : $('#vacancy_experienceNot').prop("checked", false);
      $('#vacancy_shifts').val(data[0].shifts);
      $('#vacancy_salary_from').val(data[0].salary_from);
      $('#vacancy_salary_to').val(data[0].salary_to);
      $('#vacancy_period').val(data[0].period);
      $('#vacancy_extra').val(data[0].extra_options);
    }
  }, {
    key: "update_post",
    value: function update_post() {
      $(document).on("click hover", '#add_vacancy_button', function () {
        // prevent for add
        if (!$(this).attr('data-id').trim()) {
          return;
        } //console.log('post')


        $('#add_vacancy_button').attr("disabled", true);
        $.ajax({
          type: "POST",
          url: "/ajax/hr/update_vacancy",
          headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
          },
          data: {
            id: $('#add_vacancy_button').attr('data-id'),
            title: $('#vacancy_title').val(),
            description: $('#vacancy_description').val(),
            full_time: $('#vacancy_fullTime:checked').val() ? 1 : 0,
            part_time: $('#vacancy_partTime:checked').val() ? 1 : 0,
            urgent: $('#vacancy_urgent:checked').val() ? 1 : 0,
            immediate_start: $('#vacancy_immediateStart:checked').val() ? 1 : 0,
            experience_not_required: $('#vacancy_experienceNot:checked').val() ? 1 : 0,
            shifts: $('#vacancy_shifts').val(),
            salary_from: $('#vacancy_salary_from').val(),
            salary_to: $('#vacancy_salary_to').val() ? $('#vacancy_salary_to').val() : 0,
            period: $('#vacancy_period').val(),
            extra_options: $('#vacancy_extra').val()
          },
          //dataType: "json",
          success: function success() {
            // hide modal
            $('#vacancyModal').modal('hide'); // clean form

            document.getElementById("hr_vacancy_form").reset();
            $('#add_vacancy_button').attr("disabled", false);
            console.log('s post');
            window.location.reload();
          },
          error: function error() {
            $('#add_vacancy_button').attr("disabled", false);
            alert('Error');
          }
        });
      });
    }
  }, {
    key: "delete",
    value: function _delete() {
      $(document).on("click hover", '.delete_hr_vacancy', function () {
        var id = $(this).attr('data-id');
        console.log(id);
        $('#hr_vacancy_' + id).fadeOut();
        $.ajax({
          url: "/ajax/hr/delete_vacancy",
          headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
          },
          type: "post",
          data: {
            id: id
          },
          success: function success() {}
        });
      });
    }
  }]);

  return Hr_edit_vacancy;
}();

var hr_edit_vacancy = new Hr_edit_vacancy();

var Portfolio =
/*#__PURE__*/
function () {
  function Portfolio() {
    _classCallCheck(this, Portfolio);

    this.init();

    this._isTitleField();

    this.insert();
    this.load_portfolio();
    this.update();
    this["delete"]();
  }

  _createClass(Portfolio, [{
    key: "init",
    value: function init() {
      $('#portfolioCustomFile').on('change', function () {
        portfolio._upload_image();
      });
      $('#portfolioCustomFile_edit').on('change', function () {
        portfolio._update_image();
      });
    } // if title more than 2 symbols

  }, {
    key: "_isTitleField",
    value: function _isTitleField() {
      $('#portfolio_title').on('input', function () {
        if ($('#portfolio_title').val().length > 2) {
          $('.portfolioImageBlock').fadeIn(800).removeClass('d-none');
          $('#add_portfolio').fadeIn(800).removeClass('d-none');
        } else {
          $('.portfolioImageBlock').fadeOut('slow');
          $('#add_portfolio').fadeOut();
        }
      });
    }
  }, {
    key: "_upload_image",
    value: function _upload_image() {
      var formData = new FormData();
      formData.append('file', $('#portfolioCustomFile')[0].files[0]); //attach old one

      formData.append('ofile', $('#portfolio_attached').val());
      $.ajax({
        type: "POST",
        url: "/ajax/portfolio/upload_photo",
        headers: {
          'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        data: formData,
        processData: false,
        // tell jQuery not to process the data
        contentType: false,
        //dataType: "json",
        success: function success(data) {
          $('.portfolioCustomFile').text('Attached: ' + $('#portfolioCustomFile')[0].files[0].name); //$('#portfolioCustomFile').attr('disabled', 'disabled');

          $('#portfolio_attached').val(data);
        },
        error: function error() {
          alert('Error: ');
        }
      });
    }
  }, {
    key: "_update_image",
    value: function _update_image() {
      var formData = new FormData();
      formData.append('file', $('#portfolioCustomFile_edit')[0].files[0]); //attach old one

      formData.append('ofile', $('#portfolio_attached_edit').val()); //attach id

      formData.append('id', $('#portfolio_edit_id').val());
      $.ajax({
        type: "POST",
        url: "/ajax/portfolio/upload_photo",
        headers: {
          'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        data: formData,
        processData: false,
        // tell jQuery not to process the data
        contentType: false,
        //dataType: "json",
        success: function success(data) {
          $('.portfolioCustomFile_edit').text('Attached: ' + $('#portfolioCustomFile_edit')[0].files[0].name); //$('#portfolioCustomFile').attr('disabled', 'disabled');

          $('#portfolio_attached_edit').val(data);
          $('.portfolio_modal_footer').hide().html('<img class="img-fluid" src="/storage/portfolio/' + data + '">').fadeIn();
        },
        error: function error() {
          alert('Error: ');
        }
      });
    }
  }, {
    key: "insert",
    value: function insert() {
      $('#add_portfolio').on('click', function () {
        $.ajax({
          type: "POST",
          url: "/ajax/portfolio/save",
          headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
          },
          data: {
            title: $('#portfolio_title').val(),
            description: $('#portfolio_description').val(),
            img: $('#portfolio_attached').val(),
            experience_id: $('#experience_portfolio option:selected').val()
          },
          success: function success(data) {
            $("#portfolio_block").prepend('<div style="cursor: pointer" id="portfolio_' + data + '"' + ' class="col-12 mt-4 p-3 border rounded  wow fadeInUp text-primary edit_portfolio" data-id="' + data + '">' + $('#portfolio_title').val() + ':  ' + $('#portfolio_description').val() + '</div>');
            $('#portfolio_worker').modal('hide');
            $('#portfolio_title').val('');
            $('#portfolio_description').val('');
            $('#portfolio_attached').val('');
            $('#experience_portfolio option:first').prop('selected', true);
            $('.portfolioCustomFile').text('Choose file ...'); // hide el

            $('.portfolioImageBlock').hide();
            $('#add_portfolio').addClass('d-none');
          },
          error: function error() {
            alert('Error: ');
          }
        });
      });
    }
  }, {
    key: "load_portfolio",
    value: function load_portfolio() {
      $(document).on('click', '.edit_portfolio', function () {
        var id = $(this).attr('data-id'); //console.log(id)

        $('#portfolio_edit').modal('show');
        $('#portfolio_edit_id').val(id);
        $('.portfolioCustomFile_edit').text('Update image ...'); // load

        $.ajax({
          type: "POST",
          url: "/ajax/portfolio/load",
          headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
          },
          data: {
            id: id
          },
          dataType: "json",
          success: function success(data) {
            $('#portfolio_title_edit').val(data[0].title);
            $('#portfolio_description_edit').val(data[0].pdesc);
            $('#portfolio_attached_edit').val(data[0].pfile);
            $("#experience_portfolio_edit select").val(data[0].id_experience);
            $("#experience_portfolio_edit").children('[value="' + data[0].id_experience + '"]').prop("selected", true); // preview img

            if (data[0].pfile.length > 3) {
              $('.portfolio_modal_footer').html('<img class="img-fluid" src="/storage/portfolio/' + data[0].pfile + '">');
            } else {
              $('.portfolio_modal_footer').html('');
            }
          },
          error: function error() {
            alert('Error: ');
          }
        });
      });
    }
  }, {
    key: "update",
    value: function update() {
      // $('#update_portfolio')
      $(document).on('click', '#update_portfolio', function () {
        var id = $('#portfolio_edit_id').val();
        $.ajax({
          type: "POST",
          url: "/ajax/portfolio/update",
          headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
          },
          data: {
            id: id,
            title: $('#portfolio_title_edit').val(),
            description: $('#portfolio_description_edit').val(),
            img: $('#portfolio_attached_edit').val(),
            experience_id: $('#experience_portfolio_edit option:selected').val()
          },
          success: function success(data) {
            // remove old
            $('#portfolio_' + $('#portfolio_edit_id').val()).remove(); // add new

            $("#portfolio_block").prepend('<div style="cursor: pointer" id="portfolio_' + id + '"' + ' class="col-12 mt-4 p-3 border rounded  wow fadeInUp text-primary edit_portfolio" data-id="' + id + '">' + $('#portfolio_title_edit').val() + ':  ' + $('#portfolio_description_edit').val() + '</div>');
            $('#portfolio_edit').modal('hide');
          },
          error: function error() {
            alert('Error: ');
          }
        });
      });
    }
  }, {
    key: "delete",
    value: function _delete() {
      $('#delete_portfolio').on('click', function () {
        // to do ...
        //console.log($('#portfolio_edit_id').val() + ' - ' + $('#portfolio_attached_edit').val())
        $('#portfolio_' + $('#portfolio_edit_id').val()).fadeOut();
        $.ajax({
          type: "POST",
          url: "/ajax/portfolio/delete",
          headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
          },
          data: {
            id: $('#portfolio_edit_id').val(),
            img: $('#portfolio_attached_edit').val()
          },
          success: function success(data) {
            $('#portfolio_edit').modal('hide'); // hide el

            $('.portfolioImageBlock').hide();
            $('#add_portfolio').addClass('d-none');
          },
          error: function error() {
            alert('Error: ');
          }
        });
      });
    }
  }]);

  return Portfolio;
}();

var portfolio = new Portfolio();

var Profile_form =
/*#__PURE__*/
function () {
  function Profile_form() {
    _classCallCheck(this, Profile_form);

    // first name
    this.edit_field('profile_first_name', 'first_name_saved'); // second name

    this.edit_field('profile_second_name', 'second_name_saved');
    this.edit_phone(); // email

    this.edit_field('profile_email', 'email_saved');
    this.edit_availability(); // about you

    this.edit_field('profile_about_you', 'aboutYou_saved'); // business name

    this.edit_field('profile_business_name', 'business_name_saved'); // address

    this.edit_field('profile_address', 'address_saved'); // postcode

    this.edit_field('profile_postcode', 'postcode_saved');
  }

  _createClass(Profile_form, [{
    key: "edit_phone",
    value: function edit_phone() {
      $('#phone_number').on('input', function () {
        // del letters
        var res = $('#phone_number').val().replace(/[^\d\+()\-]/g, '');
        $('#phone_number').val(res);
      });
      this.edit_field('phone_number', 'phone_saved');
    }
  }, {
    key: "edit_availability",
    value: function edit_availability() {
      $('#profile_availability').on('change', function () {
        // save
        profile_save_form();
        setTimeout(function () {
          $('#availability_saved').removeClass('d-none');
          $('#availability_saved').show().addClass('animated fadeInDown').fadeOut('slow');
        }, 500);
      });
    }
  }, {
    key: "edit_field",
    value: function edit_field(id, ids_save_mark) {
      var typingTimer; //timer identifier

      var doneTypingInterval = 2000; //time in ms (2 seconds)

      $('#' + id).on('input', function () {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(function () {
          // doSomething...
          // save
          profile_save_form();
          $('#' + ids_save_mark).removeClass('d-none');
          $('#' + ids_save_mark).show().addClass('animated bounceIn').fadeOut('slow');
        }, doneTypingInterval);
      });
    }
  }]);

  return Profile_form;
}();

new Profile_form();

function profile_save_form() {
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
      email: $('#profile_email').val(),
      availability: $('#profile_availability').val(),
      about_you: $('#profile_about_you').val(),
      business_name: $('#profile_business_name').val(),
      address: $('#profile_address').val(),
      postcode: $('#profile_postcode').val()
    },
    //dataType: "json",
    success: function success() {},
    error: function error() {
      alert('Error');
    }
  });
}

var search_CV =
/*#__PURE__*/
function () {
  function search_CV() {
    _classCallCheck(this, search_CV);

    this.addCity();
    this.search();
  }

  _createClass(search_CV, [{
    key: "addCity",
    value: function addCity() {
      //if ($('input #search_cv').val() == 'true') {
      $(document).on('change', '#city_id', function () {
        //console.log(' u '+ $('#city_id').val())
        window.location.href = '?city=' + $('#city_id').val();
      }); //}
    }
  }, {
    key: "search",
    value: function search() {
      $(document).on('change input', '#search_cvs', function () {
        //console.log('sdfdsf')
        var searchParams = new URLSearchParams(window.location.search);
        $.ajax({
          type: "GET",
          url: "/cv_tmp?search=" + $('#search_cvs').val() + (searchParams.get('city') ? '&city=' + searchParams.get('city') : ''),
          headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
          },
          dataType: "json",
          success: function success(data) {
            $('.card-deck').html('');
            $.each(data['0']['CV']['data'], function (i, field) {
              var pic = field.pic === '1' ? '' : '<img class="wow fadeIn" src="/storage/photo/' + field.id + '.png">';
              var experience = ''; // add experience

              $.each(data['0']['experiences'], function (ie, ef) {
                if (ef.id_candidate == field.id) {
                  experience += ef.position ? ef.position + ', ' : '';
                }
              }); // add card

              $('.card-deck').append('' + '<div class="card my_card_300 mb-4"> ' + '<div class="card-header text-center"><a href="/profile/' + field.id + '">' + field.name + ' ' + field.surname + '</div>' + '<div class="card-body text-center">' + '<a href="/profile/' + field.id + '" target="_blank">' + pic + '</a> <br>' + experience.slice(0, -2) + '</div>' + ' </div>');
            }); //console.log(data['0']['CV']['next_page_url'])

            if (data['0']['CV']['next_page_url'] == null) {
              $('.page-link').hide();
            } else {
              $('.page-item').removeClass('disabled');
              $('.page-link').show();
              $('.page-link').attr('href', '/cv?page=2' + '&city=' + searchParams.get('city') + '&search=' + $('#search_cvs').val());
            }
          },
          error: function error() {//alert('Error');
          }
        });
      });
    }
  }]);

  return search_CV;
}();

new search_CV();

var Shift =
/*#__PURE__*/
function () {
  function Shift() {
    _classCallCheck(this, Shift);

    this.save();
    this.show_partTime_block();
  }

  _createClass(Shift, [{
    key: "save",
    value: function save() {
      $(document).on("change", '.save_employee_availability', function () {
        //console.log($(this).attr('data-weekday'))
        shift.saveToDb($(this).attr('data-weekday'), $(this).val());
        $(this).addClass('is-valid'); //

        $(this).delay(1000).queue(function (next) {
          $(this).removeClass('is-valid'); // remove focus

          $(this).blur();
          next();
        });
      });
    }
  }, {
    key: "saveToDb",
    value: function saveToDb(day, availability) {
      //console.log(day + ' - ' + availability);
      $.ajax({
        type: "POST",
        url: "/ajax/employee_availability",
        async: true,
        headers: {
          'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        data: {
          day: day,
          availability: availability
        },
        //dataType: "json",
        success: function success() {
          //$('#edit_experience').modal('hide');
          //$('#experience_' + click_id).remove();
          console.log('----');
        },
        error: function error() {
          alert('Error');
        }
      });
    }
  }, {
    key: "show_partTime_block",
    value: function show_partTime_block() {
      $(document).on("click", '.activate_part_time_block', function () {
        //console.log($('#availability_employee').val())
        $('#block_shift_part_time').removeClass('d-none');
        $("#block_shift_part_time").addClass("wow fadeInUp animated"); // reset focus

        $('.activate_part_time_block').blur();
      });
    }
  }]);

  return Shift;
}();

var shift = new Shift();

var stages_wProfile =
/*#__PURE__*/
function () {
  function stages_wProfile() {
    _classCallCheck(this, stages_wProfile);

    // this.contacts();
    //
    // this.availability();
    this.next();
    this.fuul_time_button();
  }

  _createClass(stages_wProfile, [{
    key: "next",
    value: function next() {
      $(document).on("click hover", '#Wbutton_next', function () {
        var st = 0;
        $(new_users_blocks).each(function (index, element) {
          if ($('#' + element).is(':visible')) {
            st = index;
          }

          $('#' + new_users_blocks[index]).addClass('d-none'); // reset focus

          $('.btn').blur();
        }); // show next slide

        $('#' + new_users_blocks[st + 1]).removeClass('d-none'); //console.log(st + ' - ' + new_users_blocks[st])
        // if (st == 0) {
        //
        //     $('#' + new_users_blocks[st]).removeClass('d-none');
        //
        // }
        // if CV loaded - go to stage photo

        if (st == 3 || st == 4) {
          if ($('.custom-file-cv').text() !== 'Attach CV') {
            $('#Wbutton_next').click();
          }
        }

        if (st == 6) {
          $('#Wbutton_next').text('Almost finish >>> ');
        }

        if (st == '7') {
          $('#Wbutton_next').text('DONE!');
        }

        if (st == '8') {
          $('#Wbutton_next').text('Now you can start applying ... ').addClass('animated wow fadeInUp'); //fbq('track', 'CompleteRegistration');
        }

        if (st == '9') {
          $('#Wbutton_next').hide();
          setTimeout(function () {
            // if was attempt to apply vacancy
            if (getCookie('attempt_to_apply') != '') {
              window.location.href = getCookie('attempt_to_apply');
            } else {
              window.location.href = "/";
            }
          }, 500);
        }
      });
    }
  }, {
    key: "next_ON",
    value: function next_ON() {
      $('#Wbutton_next').removeClass('d-none');
    }
  }, {
    key: "next_OFF",
    value: function next_OFF() {
      $('#Wbutton_next').addClass('d-none');
    }
  }, {
    key: "fuul_time_button",
    value: function fuul_time_button() {
      $(document).on("click hover", '.full_time_button', function () {
        $('#Wbutton_next').click();
      });
    }
  }]);

  return stages_wProfile;
}(); //                      'block_contacts',


var new_users_blocks = ['block_availability', 'block_toDo_most', 'block_attach_cv', 'block_languages', 'block_experience', 'block_education', 'block_shift', 'block_photo', 'block_video', 'block_praise'];
var new_profile_stages = new stages_wProfile();

var Workers_languages =
/*#__PURE__*/
function () {
  function Workers_languages() {
    _classCallCheck(this, Workers_languages);

    this.getList();
    this.add();
    this["delete"]();
  }

  _createClass(Workers_languages, [{
    key: "getList",
    value: function getList() {
      $(document).on("click hover", '#get_languages', function () {
        // clean options
        document.getElementById("LangList").options.length = 0;
        var id = $(this).attr('data-id');
        $.ajax({
          type: "POST",
          url: "/ajax/get_languages",
          async: true,
          headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
          },
          //dataType: "json",
          success: function success(data) {
            var obj = JSON.parse(JSON.stringify(data));
            $.each(obj, function (k, v) {
              //console.log(v.id + " : " + v.name);
              $('#LangList').append($('<option>', {
                value: v.id,
                text: v.name
              }));
            });
          },
          error: function error() {
            alert('Error');
          }
        });
      });
    }
  }, {
    key: "add",
    value: function add() {
      $(document).on("click hover", '#add_language', function () {
        $.ajax({
          type: "POST",
          url: "/ajax/add_language",
          async: true,
          headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
          },
          data: {
            language: $('#LangList').val(),
            level: $('#LangLevel').val()
          },
          //dataType: "json",
          success: function success(data) {
            $('#languages_list').modal('hide');
            $('#languages_block').append('<span class="bg-white btn-block text-success mr-3" id="lang_' + data + '">' + $('option:selected', '#LangList').text() + ' - <small>' + $('option:selected', '#LangLevel').text() + '</small> <button class="btn btn-outline-danger btn-sm del_language" data-id="' + data + '">X</button> </span>');
            console.log(data);
            quietScroll("languages_block");
          },
          error: function error() {
            alert('Error');
          }
        });
      });
    }
  }, {
    key: "delete",
    value: function _delete() {
      $(document).on("click hover", '.del_language', function () {
        // clean options
        document.getElementById("LangList").options.length = 0;
        var id = $(this).attr('data-id');
        console.log(id);
        $.ajax({
          type: "POST",
          url: "/ajax/del_language",
          async: true,
          headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
          },
          data: {
            id: id //$(this).attr('data-id')

          },
          //dataType: "json",
          success: function success(a) {
            $('#lang_' + id).remove();
            quietScroll("languages_block_top");
          },
          error: function error() {
            alert('Error');
          }
        });
      });
    }
  }]);

  return Workers_languages;
}();

new Workers_languages();

var WService =
/*#__PURE__*/
function () {
  function WService() {
    _classCallCheck(this, WService);

    this.add();
    this.update();
    this["delete"]();
    this.load_portfolio();
    this.checkbox_service_portfolio();
  }

  _createClass(WService, [{
    key: "add",
    value: function add() {
      $(document).on("click", '.add_service', function () {
        if (wService.check() == true) {
          wService._add_ajax_call();
        }
      });
    }
  }, {
    key: "_add_ajax_call",
    value: function _add_ajax_call() {
      //console.log('ajax call')
      $.ajax({
        type: "POST",
        url: "/ajax/services/add",
        headers: {
          'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        data: {
          title: $('#title_service').val(),
          price: $('#price_service').val(),
          price_type: $('#price_type_service option:selected').val(),
          requirement: $('#requirement_service').val(),
          how_long: $('#how_long_service').val()
        },
        //dataType: "json",
        success: function success(data) {
          //console.log('success')
          $('#user_service_modal').modal('hide');
          wService.add_to_list_html(data);
        },
        error: function error() {
          alert('Error');
        }
      });
    }
  }, {
    key: "add_to_list_html",
    value: function add_to_list_html(id) {
      $('.card-deck').append('<div class="card border-success my_card_300 m-3" id="services_' + id + '">\n' + '                <div class="card-header"> ' + $('#title_service').val() + ' <small class="text-muted float-right">£' + $('#price_service').val() + '</small></div>\n' + '                <div class="card-body"> <p>' + $('#requirement_service').val() + '</p> \n' + '                    <p class="text-right"><small class="text-muted">' + $('#how_long_service').val() + 'd</small></p>\n' + '                 </div>\n' + '                    <div class="card-footer bg-transparent">\n' + '                        <span class="btn btn-outline-primary edit_service_btn" data-id="' + id + '" data-toggle="modal" data-target="#edit_service_modal">edit</span>\n' + '                           <span class="btn btn-sm btn-outline-secondary float-right service_attach_portfolio" data-id="' + id + '" data-toggle="modal" data-target="#attach_portfolio_modal">Attach example</span>' + '                    </div>\n' + '</div>'); // set header

      $('.card-deck .card:last .card-header').text($('#title_service').val()); // set body's text

      $('.card-deck .card:last .card-body').text($('#requirement_service').val()); // set btn mark id

      $('.card-deck .card:last .edit_service_btn').attr('data-id', id); // clean form

      $('#user_service_modal').find('input:text, textarea').val('');
    }
  }, {
    key: "update",
    value: function update() {
      // json load to form
      $(document).on("click", '.edit_service_btn', function () {
        //console.log($(this).attr('data-id'))
        // set id to btn
        $('.update_service_btn').attr('data-id', $(this).attr('data-id'));
        $('.delete_service_btn').attr('data-id', $(this).attr('data-id')); // ajax call - get json
        // get json by ID

        wService._get_by_id_ajax($(this).attr('data-id'));
      }); //

      $(document).on("click", '.update_service_btn', function () {
        //console.log('up  - ' + $(this).attr("data-id"))
        wService._update_ajax_call();
      });
    }
  }, {
    key: "_get_by_id_ajax",
    value: function _get_by_id_ajax(id) {
      $.ajax({
        type: "POST",
        url: "/ajax/services/get",
        async: true,
        headers: {
          'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        data: {
          id: id
        },
        //dataType: "json",
        success: function success(data) {
          //console.log(data)
          $('#edit_title_service').val(data[0].title);
          $('#edit_price_service').val(data[0].price); // to do
          //$('#edit_price_type_service option:selected').val(data[0].price_type)

          $('#edit_price_type_service').val(data[0].price_type);
          $('#edit_requirement_service').val(data[0].requirement);
          $('#edit_how_long_service').val(data[0].how_long);
        },
        error: function error() {
          alert('Error');
        }
      });
    }
  }, {
    key: "_update_ajax_call",
    value: function _update_ajax_call(id) {
      $.ajax({
        type: "POST",
        url: "/ajax/services/update",
        headers: {
          'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        data: {
          id: $('.update_service_btn').attr("data-id"),
          title: $('#edit_title_service').val(),
          price: $('#edit_price_service').val(),
          price_type: $('#edit_price_type_service option:selected').val(),
          requirement: $('#edit_requirement_service').val(),
          how_long: $('#edit_how_long_service').val()
        },
        //dataType: "json",
        success: function success(data) {
          //console.log('success')
          $('#edit_service_modal').modal('hide'); // update on list - header

          $('#services_' + $('.update_service_btn').attr("data-id") + ' .card-header').text($('#edit_title_service').val()); //

          $('#services_' + $('.update_service_btn').attr("data-id") + ' .card-header').append('<small class="text-muted float-right">£' + $('#edit_price_service').val() + '</small>'); // update on list - requirement

          $('#services_' + $('.update_service_btn').attr("data-id") + ' .card-body').text($('#edit_requirement_service').val());
        },
        error: function error() {
          alert('Error');
        }
      });
    }
  }, {
    key: "delete",
    value: function _delete() {
      $(document).on("click", '.delete_service_btn', function () {
        wService._delete_ajax_call();
      });
    }
  }, {
    key: "_delete_ajax_call",
    value: function _delete_ajax_call() {
      $.ajax({
        type: "POST",
        url: "/ajax/services/delete",
        headers: {
          'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        data: {
          id: $('.delete_service_btn').attr("data-id")
        },
        //dataType: "json",
        success: function success() {
          //console.log('success')
          $('#edit_service_modal').modal('hide');
          $('#services_' + $('.update_service_btn').attr("data-id")).fadeOut('slow');
        },
        error: function error() {
          alert('Error');
        }
      });
    }
  }, {
    key: "check",
    value: function check() {
      if ($('#title_service').val().length > 5) {
        return true;
      }
    }
  }, {
    key: "load_portfolio",
    value: function load_portfolio() {
      $(document).on("click", '.service_attach_portfolio', function () {
        //console.log($(this).attr('data-id'))
        $('#service_portfolio').val($(this).attr('data-id'));

        wService._load_portfolio_call($(this).attr('data-id'));
      });
    }
  }, {
    key: "_load_portfolio_call",
    value: function _load_portfolio_call(id) {
      $.ajax({
        type: "POST",
        url: "/ajax/services/portfolio_load",
        headers: {
          'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        data: {
          id_service: id
        },
        //dataType: "json",
        success: function success(data) {
          //console.log(data)
          // clean body
          $('#attach_portfolio_modal .modal-body').html('');
          $.each(data, function (i, item) {
            $('#attach_portfolio_modal .modal-body').append('<div class="col-6 mt-3"><img class="img-fluid rounded" src="/storage/portfolio/' + data[i].pfile + '"></div>' + '<div class="col-6 mt-3"><br><h5 class="text-muted">' + data[i].title + '</h5>' + '<div class="custom-control custom-switch mt-3">' + '  <input type="checkbox" class="custom-control-input checkbox_service_portfolio" ' + (data[i].id == data[i].id_portfolio && data[i].id_service == $('#service_portfolio').val() ? ' checked ' : '') + ' p-id="' + data[i].id + '" id="checkbox_service_portfolio_' + data[i].id + '">' + '  <label class="custom-control-label" for="checkbox_service_portfolio_' + data[i].id + '">Join</label>' + '</div>' + '<p class="mt-3">' + data[i].pdesc + '</p>' + '</div>' + '<div class="col-12 mt-4"><hr></div>');
          });
        },
        error: function error() {
          alert('Error');
        }
      });
    }
  }, {
    key: "checkbox_service_portfolio",
    value: function checkbox_service_portfolio() {
      $(document).on("click", '.checkbox_service_portfolio', function () {
        //console.log($(this).attr('p-id') + ' - ' + $('#service_portfolio').val() )
        if ($(this).prop("checked") == true) {
          //console.log("checked");
          wService.portfolio_attach($('#service_portfolio').val(), $(this).attr('p-id'));
        } else {
          //console.log("unchecked");
          wService.portfolio_remove($('#service_portfolio').val(), $(this).attr('p-id'));
        }
      });
    }
  }, {
    key: "portfolio_attach",
    value: function portfolio_attach(id_service, id_portfolio) {
      $.ajax({
        type: "POST",
        url: "/ajax/services/portfolio_service_attach",
        headers: {
          'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        data: {
          id_service: id_service,
          id_portfolio: id_portfolio
        },
        //dataType: "json",
        success: function success() {},
        error: function error() {
          alert('Error');
        }
      });
    }
  }, {
    key: "portfolio_remove",
    value: function portfolio_remove(id_service, id_portfolio) {
      $.ajax({
        type: "POST",
        url: "/ajax/services/portfolio_service_remove",
        headers: {
          'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        data: {
          id_service: id_service,
          id_portfolio: id_portfolio
        },
        //dataType: "json",
        success: function success() {},
        error: function error() {
          alert('Error');
        }
      });
    }
  }]);

  return WService;
}();

var wService = new WService();
