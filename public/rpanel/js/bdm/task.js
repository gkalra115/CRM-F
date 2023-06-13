var clients = ``;
var form = $('#createTask');
var paymentForm = $('#paymentForm');

paymentForm.validate({
  rules: {
    taskamount: 'required',
    paidamount: 'required',
    currency: 'required',
  },
  messages: {
    taskamount: 'task amount is required',
    paidamount: 'paid amount is required',
    currency: 'currency is required',
  },
});
form.validate({
  rules: {
    wordcount: {
      required: true,
    },
    softdeadline: {
      required: true,
      softdeadline_validation: true,
    },
    harddeadline: {
      required: true,
      harddeadline_validation: true,
    },
  },
  messages: {
    wordcount: {
      required: 'wordcount is required',
    },
    softdeadline: 'softdeadline is required',
    harddeadline: 'harddeadline is required',
  },
});

jQuery.validator.addMethod(
  'softdeadline_validation',
  (value, element) => {
    return value.length > 0;
  },
  'softdeadline is required'
);

jQuery.validator.addMethod(
  'harddeadline_validation',
  (value, element) => {
    return value.length > 0;
  },
  'harddeadline is required'
);
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
const createTask = (id = undefined) => {
  if (!form.valid()) {
    return;
  }
  KTApp.block('#kt_modal_4', {
    overlayColor: '#000000',
    type: 'v2',
    state: 'success',
    message: 'Please wait...',
  });
  var taskData = {
    title: $('#createTask #title').val(),
    wordcount: $('#createTask #wordcount').val(),
    soft_deadline: $('#createTask #softdeadline').val(),
    hard_deadline: $('#createTask #harddeadline').val(),
    client: $('#createTask #selectclient').val(),
    description: $('#createTask #textdescription').summernote('code'),
  };
  if (id === undefined) {
    $.ajax({
      type: 'POST',
      url: '/bdm/task/create',
      data: taskData,
      success: function (data) {
        $('#taskkey').empty().append('Task Details');
        $('#createTask').trigger('reset');
        displayFilteredTable($('#changePage').text(), $('#hideSelect').text());
        KTApp.unblock('#kt_modal_4');
        $('#kt_modal_4').modal('toggle');
        toastr.success('Task Added');
      },
      error: function (err) {
        KTApp.unblock('#kt_modal_4');
        $('#kt_modal_4').modal('toggle');
        toastr.error(err.responseText);
      },
    });
  } else {
    $.ajax({
      type: 'PUT',
      url: `/bdm/task/${id}`,
      data: taskData,
      success: function (data) {
        $('#taskkey').empty().append('Task Details');
        $('#createTask').trigger('reset');
        displayFilteredTable($('#changePage').text(), $('#hideSelect').text());
        KTApp.unblock('#kt_modal_4');
        $('#kt_modal_4').modal('toggle');
        toastr.success('Task Addedd');
      },
      error: function (err) {
        KTApp.unblock('#kt_modal_4');
        $('#kt_modal_4').modal('toggle');
        toastr.error(err.responseText);
      },
    });
  }
};
var showTaskErrorMsg = function (form, type, msg) {
  KTApp.unblock('#kt_modal_6');
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
const paymentstatus = () => {
  $.ajax({
    method: 'PUT',
    url: '/api/payment/' + $('#taskAssignId').text(),
    data: {
      budget: $('#taskamount').val(),
      amount_paid: $('#totalpaidamount').val(),
      currency: $('#selectcurrency').val(),
    },
    success: function (responseData) {
      if (responseData.redirect) {
        return (window.location.href = responseData.redirect);
      }
      $('#closeAssign1').trigger('click');
      toastr.success('Payment updated Sucessfully');
      $('#budget')
        .empty()
        .append(
          responseData.currency +
            ' ' +
            responseData.budget +
            ` ${
              responseData.locked
                ? '<i class="flaticon2-lock kt-font-danger"></i></span>'
                : ''
            }`
        );
      $('#paidamount')
        .empty()
        .append(
          responseData.currency +
            ' ' +
            responseData.amount_paid +
            ` ${
              responseData.locked
                ? '<i class="flaticon2-lock kt-font-success"></i></span>'
                : ''
            }`
        );
      $('a[data-target="#kt_modal_6"]').css({
        'background-color': '#f7f8fa',
        'pointer-events': 'none',
      });
    },
    error: function (error) {
      console.log(error.responseJSON);
      //toastr.error(error.responseJSON.errors);
      showTaskErrorMsg($('#paymentForm'), 'danger', error.responseJSON.errors);
    },
  });
};

// const toggleTaskCanvas = (id) => {
// KTApp.block("#taskDetail", {
//   overlayColor: "#ccc",
//   type: "v2",
//   state: "success",
//   message: "Please wait..."
// })

// setTimeout(function(){

//   KTApp.unblock("#taskDetail");
// },2000)

//   // KTApp.block("#kt_quick_panel", {
//   //   overlayColor: "#000",
//   //   type: "v2",
//   //   state: "success",
//   //   message: "Please wait...",
//   // });
//   // $.ajax({
//   //   type : "GET",
//   //   url : `/apis/v2/su/view/${id}`,
//   //   success : function(data){
//   //     console.log(data)
//   //     let { name, phone, email, is_active, employee} = data
//   //     $("#kt-widget__title").empty().append(name)
//   //     $("#kt-widget__desc").empty().append(email)
//   //     $("#kt-widget__label_status").empty().append((is_active ? `<span class="btn btn-label-success btn-sm btn-bold btn-upper">Active</span>` : `<span class="btn btn-label-success btn-sm btn-bold btn-upper">In-Active</span>`))
//   //     $("#kt-widget__label_phone").empty().append(phone)
//   //     $("#kt-widget__subtitle_salary").empty().append(`&#8377;`+employee.salary)
//   //     $("#kt-widget__subtitle_jDate").empty().append((employee.joiningDate).split("T")[0])
//   //   }
//   // })
//   // $("#kt_quick_panel_toggler_btn").trigger("click")
//   // setTimeout(function() {
//   //   KTApp.unblock("#kt_quick_panel");
//   // }, 2000)
// }

const clearForm = () => {
  $('#kt_modal_4').modal('toggle');
  $('#createTask').trigger('reset');
  $('#textdescription').summernote('code', '');
  $('#selectclient').empty().append(clients);
  $('#createTask #statusInput').hide('fast');
  $('#actionButton').attr(`onclick`, `createTask()`).empty().append('Create');
  $('#modalTitle').empty().append('Add Task');
};

const deletetask = () => {
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
          method: 'DELETE',
          url: '/bdm/task/' + $('#taskAssignId').text(),
          success: function (data) {
            if ($.fn.DataTable.isDataTable('#kt_table_3')) {
              $('#kt_table_3').DataTable().destroy();
            }
            $('#kt_table_3 tbody').empty();
            KTDatatablesExtensionButtons.init('201');
            $('#taskData').hide();
            $('#noTaskSelected').show();
            swal.fire('Deleted!', 'Your file has been deleted.', 'success');
            toastr.success('Task Deleted Sucessfully');
          },
          error: function (error) {
            toastr.error('Please try again');
          },
        });
      } else if (result.dismiss === 'cancel') {
        swal.fire('Cancelled', 'Your imaginary file is safe :)', 'error');
      }
    });
};

const delivertask = () => {
  swal
    .fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Deliver it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true,
    })
    .then(function (result) {
      if (result.value) {
        console.log(result.value)
        $.ajax({
          method: 'PUT',
          url: '/bdm/task/delivered/' + $('#taskAssignId').text(),
          data:{status:"Delivered"},
          success: function (data) {
            if ($.fn.DataTable.isDataTable('#kt_table_3')) {
              $('#kt_table_3').DataTable().destroy();
            }
            $('#kt_table_3 tbody').empty();
            KTDatatablesExtensionButtons.init('201');
            $('#taskData').hide();
            $('#noTaskSelected').show();
            toastr.success('Task delivered Sucessfully');
          },
          error: function (error) {
            toastr.error('Please try again');
          },
        });
      } else if (result.dismiss === 'cancel') {
        
        swal.fire('Cancelled', 'Your imaginary file is safe :)', 'error');
      }
    });
};

const taskAssign = () => {
  $.ajax({
    method: 'PUT',
    url: '/api/taskcomm/' + $('#taskAssignId').text(),
    data: {
      assignedto: $('#kt_select2_1').val(),
      softdeadline: $('#softDate').val(),
    },
    success: function (responseData) {
      $('#closeAssign').trigger('click');
      toastr.success('Assigned User Sucessfully');
      $('.taskstatus').empty().append(responseData.updatestatus.status);
      $('#tasklogs').append(
        '<div class="kt-widget4__item"><span class="kt-widget4__icon"><i class="flaticon2-next kt-font-success"></i></span><a class="kt-widget4__title kt-widget4__title--light" href="#"><b>' +
          responseData.updatecomm.assignedby +
          '</b> assigned this task to <b>' +
          responseData.updatecomm.assignedto +
          '</b> on <b>' +
          timesend(responseData.updatecomm.assignedon) +
          '</b></a></div>'
      );
    },
    error: function (error) {
      toastr.error('Not able to assign the task to user');
    },
  });
};

const editTaskFill = () => {
  form.clearForm();
  $('#actionButton')
    .attr(`onclick`, `createTask('${currentTask._id}')`)
    .empty()
    .append('Edit');
  form.validate().resetForm();
  $('#selectclient').empty().append(clients);
  form.find('#title').val(currentTask.title);
  form.find('#wordcount').val(currentTask.wordcount);
  form.find('#softdeadline').val(currentTask.soft_deadline.split('T')[0]);
  form.find('#harddeadline').val(currentTask.hard_deadline.split('T')[0]);
  form.find('#textdescription').summernote('code', currentTask.description);
  form.find('#selectclient').val(currentTask.client._id);
};

$(document).ready(function () {
  // Getting Clients for Add Task Form
  $.ajax({
    type: 'GET',
    url: '/bdm/client/view',
    success: function (responseData) {
      let { data } = responseData;
      clients += '<option value="">Select a Client</option>';
      for (i = 0; i < data.length; i++) {
        clients +=
          '<option value="' + data[i]._id + '">' + data[i].name + '</option>';
      }
    },
    error: function (err) {
      toastr.error('Error loading Clients');
    },
  });
});
