var currentTask;
var clients = ``;
var form = $('#createTask');
var paymentForm = $('#paymentForm');
var key = $(document).find('title').text();
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
          url: '/bdm/task/delivered/' + $('#taskkey').text(),
          data:{status:"Delivered"},
          success: function (data) {
              $('#taskstatus').empty().text("Delivered");
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
  $.ajax({
    type: 'PUT',
    url: `/bdm/task/${id}`,
    data: taskData,
    success: function (data) {
      if (data.redirect) {
        return (window.location.href = data.redirect);
      }
      KTApp.unblock('#kt_modal_4');
      $('#kt_modal_4').modal('toggle');
      toastr.success('Task Edited');
      location.reload();
    },
    error: function (err) {
      KTApp.unblock('#kt_modal_4');
      $('#kt_modal_4').modal('toggle');
      toastr.error(err.responseText);
    },
  });
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

function datesend(date) {
  aestTime = new Date(date);
  var day = aestTime.getDate();
  var year = aestTime.getFullYear();
  var month = aestTime.getMonth();
  if (month == 0) {
    return day + ' Jan ' + year;
  }
  if (month == 1) {
    return day + ' Feb ' + year;
  }
  if (month == 2) {
    return day + ' Mar ' + year;
  }
  if (month == 3) {
    return day + ' Apr ' + year;
  }
  if (month == 4) {
    return day + ' May ' + year;
  }
  if (month == 5) {
    return day + ' Jun ' + year;
  }
  if (month == 6) {
    return day + ' Jul ' + year;
  }
  if (month == 7) {
    return day + ' Aug ' + year;
  }
  if (month == 8) {
    return day + ' Sep ' + year;
  }
  if (month == 9) {
    return day + ' Oct ' + year;
  }
  if (month == 10) {
    return day + ' Nov ' + year;
  }
  if (month == 11) {
    return day + ' Dec ' + year;
  }
}
function timesend(date) {
  aestTime = new Date(date);
  var day = aestTime.getDate();
  var year = aestTime.getFullYear();
  var month = aestTime.getMonth();
  var hours = aestTime.toLocaleTimeString({ hour: 'numeric', hour12: true });
  if (month == 0) {
    return day + ' Jan ' + year + ' ' + hours;
  }
  if (month == 1) {
    return day + ' Feb ' + year + ' ' + hours;
  }
  if (month == 2) {
    return day + ' Mar ' + year + ' ' + hours;
  }
  if (month == 3) {
    return day + ' Apr ' + year + ' ' + hours;
  }
  if (month == 4) {
    return day + ' May ' + year + ' ' + hours;
  }
  if (month == 5) {
    return day + ' Jun ' + year + ' ' + hours;
  }
  if (month == 6) {
    return day + ' Jul ' + year + ' ' + hours;
  }
  if (month == 7) {
    return day + ' Aug ' + year + ' ' + hours;
  }
  if (month == 8) {
    return day + ' Sep ' + year + ' ' + hours;
  }
  if (month == 9) {
    return day + ' Oct ' + year + ' ' + hours;
  }
  if (month == 10) {
    return day + ' Nov ' + year + ' ' + hours;
  }
  if (month == 11) {
    return day + ' Dec ' + year + ' ' + hours;
  }
}

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
  form.find('#title').val(currentTask.title);
  form.find('#wordcount').val(currentTask.wordcount);
  form.find('#softdeadline').val(currentTask.soft_deadline.split('T')[0]);
  form.find('#harddeadline').val(currentTask.hard_deadline.split('T')[0]);
  form.find('#textdescription').summernote('code', currentTask.description);
  form.find('#selectclient').val(currentTask.client._id);
};

const paymentstatus = () => {
  $.ajax({
    method: 'PUT',
    url: '/api/payment/' + key,
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
      $('#budgettask')
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
      // $('a[data-target="#kt_modal_6"]').css({
      //   'background-color': '#f7f8fa',
      //   'pointer-events': 'none',
      // });
    },
    error: function (error) {
      console.log(error.responseJSON);
      //toastr.error(error.responseJSON.errors);
      showTaskErrorMsg($('#paymentForm'), 'danger', error.responseJSON.errors);
    },
  });
};

$(document).ready(async function () {
  $('#kt_select2_1').select2();
  KTApp.blockPage({
    overlayColor: '#000000',
    state: 'primary',
  });
  $.ajax({
    type: 'GET',
    url: '/bdm/task/' + key,
    success: function (data) {
      if (data.task == null) {
        KTApp.unblockPage();
        $('#errortask').fadeIn(2000);
      } else {
        currentTask = data.task;
        KTApp.unblockPage();
        $('#tasktitle').text(data.task.title);
        $('#taskkey').html(
          "<i class='flaticon-add-label-button'></i>" + data.task._id
        );
        $('#wordcount').text('words: ' + data.task.wordcount);
        $('#timestampscreated').text(
          'created on: ' + datesend(data.task.createdAt)
        );
        $('#timestampsmodified').text(
          'modified on: ' + datesend(data.task.updatedAt)
        );
        $('#softdeadline').text(datesend(data.task.soft_deadline));
        $('#harddeadline').text(datesend(data.task.hard_deadline));
        $('#taskstatus').text(data.status.status);
        if (data.payment.budget == undefined) {
          $('#budgettask').text('N/A');
          $('#paidamount').text('N/A');
        } else if (data.payment.budget != undefined) {
          $('#budgettask')
            .empty()
            .append(
              data.payment.currency +
                ' ' +
                data.payment.budget +
                ` ${
                  data.payment.locked
                    ? '<i class="flaticon2-lock kt-font-danger"></i></span>'
                    : ''
                }`
            );
          $('#paidamount')
            .empty()
            .append(
              data.payment.currency +
                ' ' +
                data.payment.amount_paid +
                ` ${
                  data.payment.locked
                    ? '<i class="flaticon2-lock kt-font-success"></i></span>'
                    : ''
                }`
            );
          $('#selectcurrency').val(data.payment.currency);
          $('#totalpaidamount').val(data.payment.amount_paid);
          $('#taskamount').val(data.payment.budget);
        }
        if (data.payment.locked) {
          $('a[data-target="#kt_modal_6"]').css({
            'background-color': '#f7f8fa',
            'pointer-events': 'none',
          });
        } else {
          $('a[data-target="#kt_modal_6"]').css({
            'background-color': 'transparent',
            'pointer-events': 'initial',
          });
        }
        $('#clientname').text(data.task.client.name);
        $('#clientname').attr('href', '/bd/clients/' + data.task.client._id);
        $('#createdby').text(data.task.createdby.name);
        $('#taskdesc').html(data.task.description);
        $('.selecttaskuser').empty().append(`
        ${`<option value="${$(
          '.kt-subheader__main .kt-subheader__desc'
        ).text()}">Self - [${$(
          '.kt-subheader__main .kt-subheader__title'
        ).text()}]</option>`} 
        ${`<option value="${data.task.createdby._id}">${data.task.createdby.name} - [Maker]</option>`} 
            `);
        $('#taskcreate').html(
          '<span class="kt-widget4__icon"><i class="flaticon2-next kt-font-danger"></i></span><a class="kt-widget4__title kt-widget4__title--light" href="#"><b>' +
            data.task.createdby.name +
            '</b> created this task on <b>' +
            timesend(data.task.createdAt) +
            '</b></a>'
        );

        var lengthcomments = data.comments.length;
        $('#commentslist').empty();
        for (var j = 0; j < lengthcomments; j++) {
          if (data.comments[j].commentFile) {
            $('#commentslist').append(
              `<div class="kt-widget3__item"><div class="kt-widget3__header"><div class="kt-widget3__user-img"><span class="kt-badge kt-badge--username kt-badge--unified-success kt-badge--lg kt-badge--rounded kt-badge--bold" style="margin-right:10px;">
                  ${data.comments[j].commentby.name.charAt(0)}
                  <div></div><div></div></span></div><div class="kt-widget3__info"><a class="kt-widget3__username" href="#">
                    ${data.comments[j].commentby.name}
                    </a> to <a class="kt-widget3__username" href="#">
                    ${
                      !!data.comments[j].commentto
                        ? data.comments[j].commentto.name
                        : ''
                    }
                    </a><br /><span class="kt-widget3__time">
                    ${timesend(data.comments[j].createdAt)}
                    </span></div><span class="kt-widget3__status kt-font-brand"></span></div><div class="kt-widget3__body"><p class="kt-widget3__text">
                    ${data.comments[j].comment}
                    </p><a target="_blank" href="/api/solutionupload/get/taskfile/comment/${
                      data.comments[j]._id
                    }">
                    ${data.comments[j].commentFile.files}
                    </a></div></div>`
            );
          } else {
            $('#commentslist').append(
              `<div class="kt-widget3__item"><div class="kt-widget3__header"><div class="kt-widget3__user-img"><span class="kt-badge kt-badge--username kt-badge--unified-success kt-badge--lg kt-badge--rounded kt-badge--bold" style="margin-right:10px;">
                  ${data.comments[j].commentby.name.charAt(0)}
                  <div></div><div></div></span></div><div class="kt-widget3__info"><a class="kt-widget3__username" href="#">
                    ${data.comments[j].commentby.name}
                    </a> to <a class="kt-widget3__username" href="#">
                    ${
                      !!data.comments[j].commentto
                        ? data.comments[j].commentto.name
                        : ''
                    }
                      </a><br /><span class="kt-widget3__time">
                     ${timesend(data.comments[j].createdAt)}
                        </span></div><span class="kt-widget3__status kt-font-brand"></span></div><div class="kt-widget3__body"><p class="kt-widget3__text">
                        ${data.comments[j].comment}
                          </p></div></div>`
            );
          }
        }
        $('#task_portlet').fadeIn('slow');
      }
    },
    error: function (err) {
      KTApp.unblockPage();
      $('#errortask').fadeIn(2000);
    },
  });
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

  $('#milestoneview').on('click', function () {
    $('#milestonepanel').show('slow');
  });

  $('#closemilestone').on('click', function () {
    $('#milestonepanel').hide('slow');
  });

  getfiles(key);
  $('#deletetask').on('click', function () {
    swal
      .fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
      })
      .then(function (result) {
        if (result.value) {
          $.ajax({
            type: 'DELETE',
            url: '/bdm/task/' + key,
            success: function (data) {
              swal.fire('Deleted!', data, 'success');
            },
          });
        }
      });
  });

  $('#commentreply').on('click', function () {
    if ($('#commenttext').val() === '') {
      return toastr.warning('Please enter a comment to reply');
    }
    KTApp.block('#comment_portlet', {
      overlayColor: '#000000',
      type: 'v2',
      state: 'success',
      message: 'Please wait...',
    });
    const formData = new FormData();
    document.getElementById('attachmentFile').files.length > 0
      ? formData.append(
          'attachemntFile',
          document.getElementById('attachmentFile').files[0]
        )
      : '';
    formData.append('commentto', $('.selecttaskuser').val());
    formData.append('comment', $('#commenttext').val());
    $.ajax({
      type: 'POST',
      url: '/api/comment/create/' + key,
      data: formData,
      contentType: false,
      processData: false,
      success: function (data) {
        $('#commenttext').val('');
        $('.selecttaskuser').val(null).trigger('change');
        $('#attachmentFile').val('');
        if (data.data.commentFile) {
          $('#commentslist').append(
            '<div class="kt-widget3__item"><div class="kt-widget3__header"><div class="kt-widget3__user-img"><span class="kt-badge kt-badge--username kt-badge--unified-success kt-badge--lg kt-badge--rounded kt-badge--bold" style="margin-right:10px;">' +
              data.data.commentby.name.charAt(0) +
              '<div></div><div></div></span></div><div class="kt-widget3__info"><a class="kt-widget3__username" href="#">' +
              data.data.commentby.name +
              '</a> to <a class="kt-widget3__username" href="#">' +
              data.data.commentto.hasOwnProperty('name')
              ? data.data.commentto.name
              : '' +
                  '</a><br /><span class="kt-widget3__time">' +
                  timesend(data.data.createdAt) +
                  '</span></div><span class="kt-widget3__status kt-font-brand"></span></div><div class="kt-widget3__body"><p class="kt-widget3__text">' +
                  data.data.comment +
                  ' </p><a target="_blank" href="/api/solutionupload/get/taskfile/comment/' +
                  data.data._id +
                  '">' +
                  data.data.commentFile.files +
                  '</a></div></div>'
          );
        } else {
          $('#commentslist').append(
            '<div class="kt-widget3__item"><div class="kt-widget3__header"><div class="kt-widget3__user-img"><span class="kt-badge kt-badge--username kt-badge--unified-success kt-badge--lg kt-badge--rounded kt-badge--bold" style="margin-right:10px;">' +
              data.data.commentby.name.charAt(0) +
              '<div></div><div></div></span></div><div class="kt-widget3__info"><a class="kt-widget3__username" href="#">' +
              data.data.commentby.name +
              '</a> to <a class="kt-widget3__username" href="#">' +
              data.data.commentto.hasOwnProperty('name')
              ? data.data.commentto.name
              : '' +
                  '</a><br /><span class="kt-widget3__time">' +
                  timesend(data.data.createdAt) +
                  '</span></div><span class="kt-widget3__status kt-font-brand"></span></div><div class="kt-widget3__body"><p class="kt-widget3__text">' +
                  data.data.comment +
                  '</p></div></div>'
          );
        }
        if (data.redirect) {
          return (window.location.href = data.redirect);
        }
        setTimeout(function () {
          KTApp.unblock('#comment_portlet');
        }, 2000);
      },
      error: function (err) {
        KTApp.unblock('#comment_portlet');
        let err_message = err.responseJSON.errors[0].msg;
        toastr.error(err_message);
      },
    });
  });

  $('.fileuploadform').submit(function (e) {
    KTApp.block('#fileupload_portlet', {
      overlayColor: '#000000',
      type: 'v2',
      state: 'success',
      message: 'Please wait...',
    });
    e.preventDefault();
    var file = document.getElementById('files').files[0];
    var formData = new FormData();
    formData.append('files[]', file);
    $.ajax({
      type: 'POST',
      url: '/api/briefupload/brief/' + key,
      data: formData,
      contentType: false,
      processData: false,
      success: function (data) {
        getfiles(key);
        toastr.success('file uploaded successfully');
        KTApp.unblock('#fileupload_portlet');
      },
      error: function (error) {
        getfiles(key);
        toastr.error('something is wrong! Please check');
        KTApp.unblock('#fileupload_portlet');
      },
    });
  });
});

const getfiles = (key) => {
  $.ajax({
    type: 'GET',
    url: '/api/briefupload/' + key,
    success: function (data) {
      $('#briefupload').empty();
      for (i = 0; i < data.length; i++) {
        $('#briefupload').append(
          `<div class="kt-widget4__item"><div class="kt-widget4__pic kt-widget4__pic--icon"><img src="
          ${data[i].fileUrl}
          " alt="" /></div><a class="kt-widget4__title" target="_blank" href="/api/solutionupload/get/taskfile/brief/${
            data[i]._id
          }" download data-toggle="kt-tooltip" data-original-title="${
            data[i].uploadedby ? data[i].uploadedby.name : ''
          }">${data[i].files}
            </a><span style="text-align:right;">${timesend(
              data[i].createdAt
            )}</span></div>`
        );
      }
      KTApp.initTooltip($('a.kt-widget4__title'));
    },
  });
};
