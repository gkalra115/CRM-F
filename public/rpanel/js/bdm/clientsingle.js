let clients = ``;
var showTaskErrorMsg = function (form, type, msg) {
  KTApp.unblock('#kt_modal_7');
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
var clientid = $(document).find('title').text();
$.ajax({
  type: 'GET',
  url: '/bdm/client/' + clientid,
  success: function ({ singleclient, finance }) {
    clients = `<option value="${singleclient._id}">${singleclient.name}</option>`;
    $('#whatsapp').on('click', function () {
      let taskurl = 'https://api.whatsapp.com/send?phone=' + singleclient.phone;
      window.open(taskurl, '_blank');
    });
    $('#clientinitials').empty().append(singleclient.name.charAt(0));
    $('#clientname').empty().append(singleclient.name);
    $('#clientemail')
      .empty()
      .html("<i class ='flaticon2-new-email'></i>" + singleclient.email);
    $('#clientphone')
      .empty()
      .html("<i class ='flaticon2-phone'></i>" + singleclient.phone);
    $('#clientuni')
      .empty()
      .html(
        "<i class ='flaticon2-shelter'></i>" + singleclient.client.university
      );
    $('#clientcountry')
      .empty()
      .html(
        "<i class ='flaticon2-placeholder'></i>" + singleclient.client.country
      );
    $('#clientportlet').show('slow');
    $('#errorclient').hide('fast');
  },
  error: function (jqXHR, exception) {
    console.log(jqXHR.responseText);
    $('#errorclient').show('slow');
    $('#clientportlet').hide('fast');
  },
});
var clientfinancestats = function (value) {
  var cMonth = value
    ? value === 'EOT'
      ? 'EOT'
      : value.split('-')[0]
    : currentDate.getMonth() + 1;
  var gMonth = value
    ? value === 'EOT'
      ? 'EOT'
      : value.split('-')[0] - 1
    : currentDate.getMonth();
  var cYear = value
    ? value === 'EOT'
      ? 'EOT'
      : value.split('-')[1]
    : currentDate.getFullYear();
  var apiUrl;
  if ((cMonth === 'EOT', gMonth === 'EOT', cYear === 'EOT')) {
    apiUrl = `/bdm/client/finance/${clientid}`;
  } else {
    apiUrl = `/bdm/client/finance/${clientid}?month=${cMonth}&year=${cYear}`;
  }
  $.ajax({
    type: 'GET',
    url: apiUrl,
    success: function (data) {
      var datalength = data.length;
      var sum = 0;
      var count = 0;
      var totAmount = ``;
      var paidAmount = ``;
      var remAmount = ``;
      for (i = 0; i < datalength; i++) {
        sum += data[i].wordcount;
        count += data[i].totaltask;
        paidAmount += ` ${data[i]._id} ${data[i].totalpaid}`;
        totAmount += ` ${data[i]._id} ${data[i].totalamount}`;
        remAmount += `${data[i].totalamount - data[i].totalpaid}`;
        // console.log(data[i].totalamount ? `${data[i]._id} ${data[i].totalamount}` : `AUD 0`, data[i].totalamount, data[i].totalpaid)
      }
      $('#currencyremaining')
        .empty()
        .append(remAmount === '' ? 'AUD 0' : remAmount);
      $('#currencyrevenue')
        .empty()
        .append(totAmount === '' ? 'AUD 0' : totAmount);
      $('#currencypaid')
        .empty()
        .append(paidAmount === '' ? 'AUD 0' : paidAmount);
      $('#totalwordcount').empty().append(sum);
      $('#totaltasklen').empty().append(count);
    },
  });
};

var form = $('#createTask');
form.validate({
  rules: {
    wordcount: {
      required: true,
      number: true,
    },
    softdeadline: {
      required: true,
      date: true,
    },
    harddeadline: {
      required: true,
      date: true,
    },
  },
});

const createTask = () => {
  if (!form.valid()) {
    return;
  }
  if (
    !(
      new Date($('#createTask #softdeadline').val()).valueOf() <=
      new Date($('#createTask #harddeadline').val()).valueOf()
    )
  ) {
    toastr.warning('Soft Deadline should not be greater then Hard Deadline');
    return;
  }

  let clientData = $('#kt_repeater_1').repeaterVal();
  let reqData = [...clientData['']];

  KTApp.block('#kt_modal_7', {
    overlayColor: '#000000',
    type: 'v2',
    state: 'success',
    message: 'Please wait...',
  });
  var taskData = {
    wordcount: $('#createTask #wordcount').val(),
    soft_deadline: $('#createTask #softdeadline').val(),
    hard_deadline: $('#createTask #harddeadline').val(),
    description: $('#createTask #textdescription').summernote('code'),
  };
  $.ajax({
    type: 'POST',
    url: '/bdm/task/create',
    data: {
      ...taskData,
      client: reqData[0].client,
      title: reqData[0].title,
    },
    success: function (data) {
      if (data.msg === 'error') {
        return showTaskErrorMsg(form, 'danger', data.errors);
      }
      $('#createTask').trigger('reset');
      KTApp.unblock('#kt_modal_7');
      $('#kt_modal_7').modal('toggle');
      toastr.success('Task Added');
      $('#kt_datatable_reload').trigger('click');
    },
    error: function (err) {
      KTApp.unblock('#kt_modal_7');
      $('#kt_modal_7').modal('toggle');
      toastr.error(err.responseText);
    },
  });
};

const clearForm = () => {
  $('#kt_modal_4').modal('toggle');
  $('#createTask').trigger('reset');
  $('#textdescription').summernote('code', '');
  $('.selectclient').empty().append(clients);
  $('#createTask #statusInput').hide('fast');
  $('#actionButton').attr(`onclick`, `createTask()`).empty().append('Create');
  $('#modalTitle').empty().append('Add Task');
};

$(document).ready(async function () {
  var todayDate = new Date();
  var month = todayDate.getMonth() + 1;
  var year = todayDate.getFullYear();
  clientfinancestats(`${month}-${year}`);
  daterangepickerInit();
});
var daterangepickerInit = function () {
  var todayDate = new Date();
  var month = todayDate.getMonth() + 1;
  var year = todayDate.getFullYear();
  $('#kt_dashboard_daterangepicker_date_3').text(` ${month}-${year}`);
  $('#kt_dashboard_daterangepicker_3')
    .datepicker({
      direction: KTUtil.isRTL(),
      open: 'right',
      orientation: 'bottom right',
      format: 'mm-yyyy',
      startView: 'months',
      minViewMode: 'months',
      autoclose: true,
    })
    .on('changeDate', function (ev) {
      $('#kt_dashboard_daterangepicker_date_3').html(ev.format());
      var value = $('#kt_dashboard_daterangepicker_date_3').text();
      clientfinancestats(value);
    });
};
