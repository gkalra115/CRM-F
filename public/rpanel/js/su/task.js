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

const getTaskFile = (id, type) => {
  $.ajax({
    url: `/api/solutionupload/get/taskfile/${type}/${id}`,
    method: 'GET',
    success: function (response) {
      console.log(response);
      toastr.success('Downloading File');
    },
    error(err) {
      console.log(err);
      toastr.error(err.responseJSON.msg);
    },
  });
};

const createTask = (id = undefined) => {
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
  if (id === undefined) {
    $.ajax({
      type: 'POST',
      url: '/api/task/create',
      data: {
        data: JSON.stringify({
          taskDetail: taskData,
          clientData: reqData,
        }),
      },
      success: function (data) {
        if (data.redirect) {
          return (window.location.href = data.redirect);
        }
        if (data.msg === 'error') {
          return showTaskErrorMsg(form, 'danger', data.errors);
        }
        $('#taskkey').empty().append('Task Details');
        $('#createTask').trigger('reset');
        displayFilteredTable($('#changePage').text(), $('#hideSelect').text());
        KTApp.unblock('#kt_modal_7');
        $('#kt_modal_7').modal('toggle');
        toastr.success('Task Added');
        if (data.task.length === 1) {
          window.open(`/su/task/${data.task[0]._id}`, '_blank');
        }
      },
      error: function (err) {
        KTApp.unblock('#kt_modal_7');
        // showTaskErrorMsg(form, "danger", err.responseJSON.error);
        $('#kt_modal_7').modal('toggle');
        toastr.error(err.responseJSON.error);
      },
    });
  } else {
    $.ajax({
      type: 'PUT',
      url: `/api/task/${id}`,
      data: {
        title: $('#createTask #title').val(),
        client: $('#createTask #selectclient').val(),
        wordcount: $('#createTask #wordcount').val(),
        soft_deadline: $('#createTask #softdeadline').val(),
        hard_deadline: $('#createTask #harddeadline').val(),
        description: $('#createTask #textdescription').summernote('code'),
      },
      success: function (data) {
        if (data.redirect) {
          return (window.location.href = data.redirect);
        }
        if (data.msg === 'error') {
          return showTaskErrorMsg(form, 'danger', data.errors);
        }
        $('#taskkey').empty().append('Task Details');
        $('#createTask').trigger('reset');
        displayFilteredTable($('#changePage').text(), $('#hideSelect').text());
        KTApp.unblock('#kt_modal_7');
        $('#kt_modal_7').modal('toggle');
        toastr.success('Task Edited');
      },
      error: function (err) {
        KTApp.unblock('#kt_modal_7');
        $('#kt_modal_7').modal('toggle');
        toastr.error(err.responseJSON.error);
      },
    });
  }
};

const toggleTaskCanvas = () => {
  KTApp.block('#kt_quick_panel', {
    overlayColor: '#000',
    type: 'v2',
    state: 'success',
    message: 'Please wait...',
  });
  $('#kt_quick_panel_toggler_btn').trigger('click');
  KTApp.unblock('#kt_quick_panel');
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
const clearForm1 = () => {
  $('#kt_modal_7').modal('toggle');
  $('#createTask').trigger('reset');
  $('#textdescription').summernote('code', '');
  $('[data-repeater-item]').slice(1).remove();
  $('.kt_select2_1:last').select2({
    placeholder: 'Select a Client',
  });
  $('.selectclient').empty().append(clients);
  $('.title').val('');
  $('#kt_repeater_1').show();
  $('#showOnEdit').hide();
  $('#actionButton').attr(`onclick`, `createTask()`).empty().append('Create');
  $('#modalTitle').empty().append('Add Task');
};

// send files to client
const sendFilesToClient = () => {
  let filestoBeSent = [];
  $('#solutionupload .kt-widget4__item').each((index, el) => {
    if ($(el).find('input[type=checkbox]').is(':checked')) {
      filestoBeSent.push($(el).attr('data-id'));
    }
  });
  if (filestoBeSent.length < 1) {
    return toastr.warning('Please select files to be sent');
  }
  KTApp.block('body', {
    overlayColor: '#000000',
    type: 'v2',
    state: 'success',
    message: 'Please wait...',
  });
  $.ajax({
    method: 'POST',
    url: '/api/solutionupload/send-mail',
    data: {
      files: JSON.stringify(filestoBeSent),
      taskId: currentTask._id,
    },
    success: (data) => {
      if (data.redirect) {
        return (window.location.href = data.redirect);
      }
      KTApp.unblock('body');
      toastr.success(`${data.msg}`);
      displayFilteredTable($('#changePage').text(), $('#hideSelect').text());
      $('#taskkey').empty().append('Task Details');

      $('#taskData').hide();
      $('#noTaskSelected').show();
    },
    error: (data) => {
      KTApp.unblock('body');
      toastr.error(err.responseText);
    },
  });
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
          url: '/api/task/' + $('#taskAssignId').text(),
          success: function (data) {
            if (data.redirect) {
              return (window.location.href = data.redirect);
            }
            if ($.fn.DataTable.isDataTable('#kt_table_3')) {
              $('#kt_table_3').DataTable().destroy();
            }
            $('#kt_table_3 tbody').empty();
            KTDatatablesExtensionButtons.init('201', 'true');
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
const paymentstatus = (approved = false) => {
  let passData = {
    budget: 1,
    amount_paid: 0,
    currency: 'AUD',
  };
  if (!approved) {
    passData = {
      budget: $('#taskamount').val(),
      amount_paid: $('#totalpaidamount').val(),
      currency: $('#selectcurrency').val(),
    };
  }
  $.ajax({
    method: 'PUT',
    url: '/api/payment/' + $('#taskAssignId').text(),
    data: {
      ...passData,
      approved,
    },
    success: function (responseData) {
      if (responseData.redirect) {
        return (window.location.href = responseData.redirect);
      }
      $('#closeAssign1').trigger('click');
      toastr.success('Payment updated Sucessfully');
      $('#budget')
        .empty()
        .append(responseData.currency + ' ' + responseData.budget);
      $('#paidamount')
        .empty()
        .append(responseData.currency + ' ' + responseData.amount_paid);
    },
    error: function (error) {
      console.log(error.responseJSON);
      //toastr.error(error.responseJSON.errors);
      showTaskErrorMsg($('#paymentForm'), 'danger', error.responseJSON.errors);
    },
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
      if (responseData.redirect) {
        return (window.location.href = responseData.redirect);
      }
      displayFilteredTable($('#changePage').text(), $('#hideSelect').text());
      $('#taskkey').empty().append('Task Details');
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
  $('#modalTitle')
    .empty()
    .append('Edit ' + currentTask.title);
  $('#actionButton')
    .attr(`onclick`, `createTask('${currentTask._id}')`)
    .empty()
    .append('Edit');
  form.validate().resetForm();
  $('#selectclient').empty().append(clients);
  $('#kt_repeater_1').hide();
  $('#showOnEdit').show();
  form.find('#title').val(currentTask.title);
  form.find('#wordcount').val(currentTask.wordcount);
  form.find('#softdeadline').val(currentTask.soft_deadline.split('T')[0]);
  form.find('#harddeadline').val(currentTask.hard_deadline.split('T')[0]);
  form.find('#textdescription').summernote('code', currentTask.description);
  form.find('#selectclient').val(currentTask.client._id);
};

// mark a task complete
const completetask = (type) => {
  swal
    .fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: `Yes, ${type === 'complete' ? 'completed' : type}!`,
      cancelButtonText: 'No, cancel!',
      reverseButtons: true,
    })
    .then(function (result) {
      if (result.value) {
        $.ajax({
          method: 'PUT',
          url: '/api/task/status/' + $('#taskAssignId').text(),
          data: {
            type: type,
          },
          success: function (data) {
            if (data.redirect) {
              return (window.location.href = data.redirect);
            }
            displayFilteredTable(
              $('#changePage').text(),
              $('#hideSelect').text()
            );
            $('#taskkey').empty().append('Task Details');
            $('#closeAssign').trigger('click');
            $('#taskData').hide();
            $('#noTaskSelected').show();
            swal.fire(
              'Completed',
              `This task has marked as ${
                type === 'complete' ? 'completed' : type
              }`,
              'success'
            );
            toastr.success(
              `Task ${type === 'complete' ? 'completed' : type} Sucessfully`
            );
          },
          error: function (error) {
            console.log(error);
            toastr.error('Please try again');
          },
        });
      } else if (result.dismiss === 'cancel') {
        swal.fire(
          'Cancelled',
          `Please ${type === 'delivered' ? 'deliver' : type} it asap`,
          'error'
        );
      }
    });
};

const getTaskByWeek = (range) => {
  $('#appendTaskData').empty();
  let rangeArr = [range - 1, range, range + 1];
  var taskstatus = {
    Assigned: { title: 'Assigned', color: 'rgba(123,16,204,0.7)' },
    Unassigned: { title: 'Unassigned', color: 'rgba(219,9,9,0.7)' },
    'Assigned to Admin': {
      title: 'Assigned to Admin',
      color: 'rgba(204,129,16,0.7)',
    },
    'Assigned to Manager': {
      title: 'Assigned to Manager',
      color: 'rgba(201,204,16,0.7)',
    },
    'Assigned to TeamLead': {
      title: 'Assigned to TeamLead',
      color: 'rgba(123,16,204,0.7)',
    },
    Running: { title: 'Running', color: 'rgba(3,156,6,0.7)' },
    'Quality Check': {
      title: 'Quality Check',
      color: 'rgba(66,79,67,0.7)',
    },
    Completed: { title: 'Completed', color: 'rgba(128,64,0,0.7)' },
    Delivered: { title: 'Delivered', color: 'rgba(16,85,145,0.7)' },
  };
  KTApp.block('#kt_quick_panel', {
    overlayColor: '#000000',
    type: 'v2',
    state: 'success',
    message: 'Please wait...',
  });
  $.ajax({
    type: 'GET',
    url: `/api/task/by-week?range=${
      rangeArr[1] === 0 ? 'current' : rangeArr[1]
    }`,
    success: function (responseData) {
      if (responseData.redirect) {
        return (window.location.href = responseData.redirect);
      }
      const { data, firstDay, lastDay } = responseData;
      let taskData = ``;
      $('#weekDateRange').text(
        `${convertTableDate(firstDay)} - ${convertTableDate(lastDay)} [${
          data.length
        } task(s)]`
      );
      for (i = 0; i < data.length; i++) {
        taskData += `<div class="kt-widget4__item">
      <div class="kt-widget__media"><span class="kt-media kt-media--circle kt-media--danger kt-margin-r-5 kt-margin-t-5"><span id="initChar">${data[
        i
      ].title.charAt(0)}</span></span>
      </div>
      <div class="kt-widget4__info"><span class="kt-widget4__username">${
        data[i].title
      }</span>
          <p class="kt-widget4__text"><i class="flaticon-add-label-button"></i> ${
            data[i]._id
          } &nbsp;&nbsp; 
          <a class="kt-badge kt-badge--inline" style="color:#fff; font-weight:600;font-size:0.875rem;padding:0.15rem 0.75rem;background-color:${
            taskstatus[data[i].status].color
          };">
            ${data[i].status}
          </a> 
        <br/><i class="flaticon-event-calendar-symbol"></i> ${convertTableDate(
          data[i].soft_deadline
        )}
          </p>
      </div>
      <a class="btn btn-sm btn-label-success btn-bold" href='/su/task/${
        data[i]._id
      }' target="_blank">GO TO</a>
    </div>`;

        if (
          (i > 0 && data[i].soft_deadline !== data[i - 1].soft_deadline) ||
          data.length - 1 === i
        ) {
          let weekData = `<div class="kt-timeline-v1__item">
            <div class="kt-timeline-v1__item-circle">
                <div class="kt-bg-danger"></div>
            </div>
            <span class="kt-timeline-v1__item-time kt-font-brand">${convertTableDate(
              data[i - 1].soft_deadline
            )}</span>
            <div class="kt-timeline-v1__item-content">
                <div class="kt-timeline-v1__item-body">
                    <div class="kt-widget4">   
                      ${taskData}
                    </div>
                </div>
            </div>
        </div>`;
          $('#appendTaskData').append(weekData);
          taskData = ``;
        }
      }
      $('#beforeWeek').attr('onclick', `getTaskByWeek(${rangeArr[0]})`);
      $('#afterWeek').attr('onclick', `getTaskByWeek(${rangeArr[2]})`);
      KTApp.unblock('#kt_quick_panel');
    },
    error: function (err) {
      toastr.error('Error loading Timeline');
      KTApp.unblock('#kt_quick_panel');
    },
  });
};

$(document).ready(function () {
  getTaskByWeek(0);
  // Getting Clients for Add Task Form
  $.ajax({
    type: 'GET',
    url: '/api/client/view',
    success: function (responseData) {
      if (responseData.redirect) {
        return (window.location.href = responseData.redirect);
      }
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

  $.ajax({
    type: 'GET',
    url: '/api/employee/getTeam',
    success: function (responseData) {
      if (responseData.redirect) {
        return (window.location.href = responseData.redirect);
      }
      let teamDropdown = `<option value ="">Select an Employee</option>`;
      responseData.forEach((obj) => {
        teamDropdown += `<option value="${obj.id}">${obj.name} - ${obj.role} [Team : ${obj.parent.name}]</option>`;
      });
      $('#kt_select2_1').empty().append(teamDropdown);
    },
    error: function (error) {
      toastr.error('Failed to load user team. ');
    },
  });
});
