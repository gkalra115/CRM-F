var form = $('#createClient');
form.validate({
  rules: {
    email: {
      required: true,
      email: true,
    },
    name: {
      required: true,
    },
    phone: {
      required: true,
      number: true,
    },
    country: {
      required: true,
    },
    university: {
      required: true,
    },
    is_active: {
      required: true,
    },
  },
});
var showClientErrorMsg = function (form, type, msg) {
  KTApp.unblock('#kt_modal_4');
  var subj = ``;
  msg.forEach((obj) => {
    subj += `<li>${obj.msg}</li>`;
  });
  var alert = $(
    '<div class="alert alert-' +
      type +
      ' alert-dismissible" role="alert">\
    <div class="alert-text"><ul>' +
      subj +
      '</ul></div>\
    <div class="alert-close">\
              <i class="flaticon2-cross kt-icon-sm" data-dismiss="alert"></i>\
          </div>\
  </div>'
  );

  form.find('.alert').remove();
  alert.prependTo(form);
  //alert.animateClass('fadeIn animated');
  KTUtil.animateClass(alert[0], 'fadeIn animated');
  alert.find('span').html(msg);
};

const createClient = (id = undefined) => {
  toastr.options = {
    closeButton: false,
    debug: false,
    newestOnTop: false,
    progressBar: false,
    positionClass: 'toast-top-right',
    preventDuplicates: false,
    onclick: null,
    showDuration: '300',
    hideDuration: '1000',
    timeOut: '5000',
    extendedTimeOut: '1000',
    showEasing: 'swing',
    hideEasing: 'linear',
    showMethod: 'fadeIn',
    hideMethod: 'fadeOut',
  };
  if (!form.valid()) {
    return;
  }
  KTApp.block('#kt_modal_4', {
    overlayColor: '#000000',
    type: 'v2',
    state: 'success',
    message: 'Please wait...',
  });
  var clientData = {
    id: id,
    email: $('#createClient #email').val(),
    name: $('#createClient #name').val(),
    phone: $('#createClient #phone').val(),
    country: $('#createClient #country').val(),
    university: $('#createClient #university').val(),
    is_active: $('#createClient #status').val() === 'Active' ? true : false,
  };

  if (id === undefined) {
    $.ajax({
      type: 'POST',
      url: '/bdm/client/create',
      data: clientData, // serializes the form's elements.
      success: function (data) {
        if (data.msg === 'error') {
          return showClientErrorMsg(form, 'danger', data.errors);
        }
        setTimeout(function () {
          form.clearForm();
          if ($.fn.DataTable.isDataTable('#kt_table_3')) {
            $('#kt_table_3').DataTable().destroy();
          }
          $('#kt_table_3 tbody').empty();
          KTDatatablesExtensionButtons.init();
          KTApp.unblock('#kt_modal_4');
          $('#kt_modal_4').modal('toggle');
          toastr.success('New Client Added');
        }, 2000);
      },
      error: function (jqXHR, exception) {
        KTApp.unblock('#kt_modal_4');
        $('#kt_modal_4').modal('toggle');
        toastr.error(jqXHR.responseText);
      },
    });
  } else {
    $.ajax({
      type: 'PUT',
      url: '/bdm/client/' + clientData.id,
      data: clientData, // serializes the form's elements.
      success: function (data) {
        if (data.msg === 'error') {
          return showClientErrorMsg(form, 'danger', data.errors);
        }
        setTimeout(function () {
          // $("#editClient").trigger("reset");
          $('#kt_quick_panel_toggler_btn').trigger('click');
          if ($.fn.DataTable.isDataTable('#kt_table_3')) {
            $('#kt_table_3').DataTable().destroy();
          }
          $('#kt_table_3 tbody').empty();
          KTDatatablesExtensionButtons.init();
          KTApp.unblock('#kt_modal_4');
          $('#kt_modal_4').modal('toggle');
          toastr.success('Client Edited');
        }, 2000);
      },
      error: function (jqXHR, exception) {
        KTApp.unblock('#kt_modal_4');
        $('#kt_modal_4').modal('toggle');

        toastr.error(jqXHR.responseText);
      },
    });
  }
};

const deleteClient = (id) => {
  swal
    .fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true,
    })
    .then(function (result) {
      if (result.value) {
        $.ajax({
          type: 'DELETE',
          url: `/bdm/client/${id}`,
          success: function (data) {
            swal.fire('Deleted!', 'Your file has been deleted.', 'success');
            if ($.fn.DataTable.isDataTable('#kt_table_3')) {
              $('#kt_table_3').DataTable().destroy();
            }
            $('#kt_table_3 tbody').empty();
            KTDatatablesExtensionButtons.init();
          },
          error: function (err) {
            var obj = JSON.parse(err.responseText);
            swal.fire('Error', obj.error.message, 'error');
          },
        });

        // result.dismiss can be 'cancel', 'overlay',
        // 'close', and 'timer'
      } else if (result.dismiss === 'cancel') {
        swal.fire('Cancelled', 'Your imaginary file is safe :)', 'error');
      }
    });
};

const editClient = ({ _id, name, phone, email, is_active, client }) => {
  form.clearForm();
  form.validate().resetForm();
  $('#modalTitle')
    .empty()
    .append('Edit Client ' + _id);
  $('#createClient #statusInput').show('fast');
  $('#actionButton')
    .attr(`onclick`, `createClient("${_id}")`)
    .empty()
    .append('Edit');
  $('#editdetails').attr({
    'data-toggle': 'modal',
    'data-target': '#kt_modal_4',
  });
  $('#kt_modal_4 #email').val(email);
  $('#kt_modal_4 #name').val(name);
  $('#kt_modal_4 #phone').val(phone);
  $('#kt_modal_4 #country').val(client.country);
  $('#kt_modal_4 #university').val(client.university);
  $('#kt_modal_4 #status').val(is_active ? 'Active' : 'In-Active');
};

const clearForm = () => {
  $('#kt_modal_4').modal('toggle');
  form.clearForm();
  form.validate().resetForm();
  $('#createClient #statusInput').hide('fast');
  $('#actionButton').attr(`onclick`, `createClient()`).empty().append('Create');
  $('#modalTitle').empty().append('Add Client');
};

const toggleClientCanvas = (id) => {
  $('#kt-widget_clientid').empty().append(id);
  // $("#kt_modal_4 #status").val(is_active)
  KTApp.block('#kt_quick_panel', {
    overlayColor: '#000',
    type: 'v2',
    state: 'success',
    message: 'Please wait...',
  });
  // $.ajax({
  //   type: 'GET',
  //   url: `/bdm/client/finance/${id}`,
  //   success: function (data) {
  //     var datalength = data.length;
  //     var sum = 0;
  //     var count = 0;
  //     for (i = 0; i < datalength; i++) {
  //       sum += data[i].wordcount;
  //       count += data[i].totaltask;
  //       $('#revenuetotal')
  //         .empty()
  //         .append(data[i]._id + ' ' + data[i].totalamount + ' ');
  //     }
  //     $('#tasktotal').empty().append(count);
  //   },
  // });
  $.ajax({
    type: 'GET',
    url: `/bdm/client/${id}`,
    success: function (data) {
      let { _id, name, phone, email, is_active, client } = data.singleclient;
      $('#initialcharacter').empty().append(name.charAt(0));
      $('#kt-widget__title').empty().append(name);
      $('#kt-widget__desc').empty().append(email);
      $('#kt-widget__label_status')
        .empty()
        .append(
          is_active
            ? `<span class="btn btn-label-success btn-sm btn-bold btn-upper">Active</span>`
            : `<span class="btn btn-label-success btn-sm btn-bold btn-upper">In-Active</span>`
        );
      $('#kt-widget__label_phone').empty().append(phone);
      $('#kt-widget__label_chat').empty().append(phone);
      $('#kt-widget__subtitle_country').empty().append(client.country);
      $('#kt-widget__subtitle_university').empty().append(client.university);
      $('#clientdetails').attr(
        'href',
        'clients/' + $('#kt-widget_clientid').text()
      );
      $('#whatsappme').attr('href', 'https://wa.me/' + phone);
      var datalength = data.finance.length;
      var sum = 0;
      var count = 0;
      $('#taskpaid').empty();
      for (i = 0; i < datalength; i++) {
        sum += data.finance[i].wordcount;
        count += data.finance[i].totaltask;
        $('#revenuetotal')
          .empty()
          .append(
            data.finance[i]._id + ' ' + data.finance[i].totalamount + ' '
          );
        $('#taskpaid').append(
          `${data.finance[i]._id} ${data.finance[i].totalpaid}`
        );
      }
      $('#tasktotal').empty().append(count);

      $('#taskwordcount').empty().append(data.finance[0].wordcount);
      editClient(data);
    },
  });

  $('#kt_quick_panel_toggler_btn').trigger('click');
  KTApp.unblock('#kt_quick_panel');
  $('#deleteclient').click(function () {
    deleteClient(id);
    $('#kt_quick_panel_toggler_btn').trigger('click');
  });
};

$(document).ready(() => {
  $('#kt_table_3 tbody').on('click', 'tr', function () {
    var id = $(this).find('td').first().text();
    toggleClientCanvas(id);
  });
});
