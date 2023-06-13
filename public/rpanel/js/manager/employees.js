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

const clearForm = () => {
  $('#kt_modal_4').modal('toggle');
  $('#createEmployee').trigger('reset');
  $('#createEmployee #statusInput').hide('fast');
  $('#actionButton')
    .attr(`onclick`, `createEmployee()`)
    .empty()
    .append('Create');
  $('#modalTitle').empty().append('Add Employee');
};

const toggleEmployeeCanvas = (id) => {
  KTApp.block('#kt_quick_panel', {
    overlayColor: '#000',
    type: 'v2',
    state: 'success',
    message: 'Please wait...',
  });
  $.ajax({
    type: 'GET',
    url: `/manager/employee/${id}`,
    success: function (data) {
      let { name, phone, email, is_active, employee } = data;
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
      $('#kt-widget__subtitle_salary')
        .empty()
        .append(`&#8377;` + employee.salary);
      $('#kt-widget__subtitle_jDate')
        .empty()
        .append(employee.joiningDate ? employee.joiningDate.split('T')[0] : '');
    },
  });
  $('#kt_quick_panel_toggler_btn').trigger('click');
  setTimeout(function () {
    KTApp.unblock('#kt_quick_panel');
  }, 2000);
};

const openSendMailDialog = (mail, name) => {
  $('#sendEmailButton').attr('onclick', `sendMail("${mail}")`);
  $('#mailModalTitle').text(`Send mail to ${name}`);
};


$("*").click((e) => {
    if(e.target.innerHTML === $('#mailClose').html()){
      let subject = $('#e-subject');
      let message = $('#e-message');
      let type = $('#typeSelect');
      subject.val(" ");
      message.val(" ");
      type.val("termination");
    }
  }
)

var sendMail = (mail) => {
  let subject = $('#e-subject').val();
  let message = $('#e-message').val();
  let type = $('#typeSelect').val();

  $.ajax({
    type: 'POST',
    url: '/manager/employee/mail',
    data: {
      email: mail,
      subject: subject,
      message: message,
      type: type
    },
    success: function (data) {
      toastr.success(data.mailStatus);
    },
    error: function (err) {
      toastr.error("mail hasn't been sent");
      console.log(err);
    },
  });
};
