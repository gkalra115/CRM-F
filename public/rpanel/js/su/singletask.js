var currentTask;
var clients = ``;
var form = $('#createTask');
form.validate({
  rules: {
    title: {
      required: true,
    },
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
    selectclient: {
      required: true,
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
    url: `/api/task/${id}`,
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
          url: '/api/task/status/' + key,
          data: {
            type: type,
          },
          success: function (data) {
            if (data.redirect) {
              return (window.location.href = data.redirect);
            }
            $('#harddeadline').text(data.status);
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
            location.reload();
          },
          error: function (error) {
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
      location.reload();
    },
    error: (err) => {
      KTApp.unblock('body');
      toastr.error(err.responseText);
    },
  });
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
var key = $(document).find('title').text();
$(document).ready(async function () {
  $.ajax({
    type: 'GET',
    url: '/api/client/view',
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
  $.ajax({
    type: 'GET',
    url: '/api/employee/getTeam',
    success: function (responseData) {
      let teamDropdown = `<option value ="">Select an Employee</option>`;
      responseData.forEach((obj) => {
        teamDropdown += `<option value="${obj.id}">${obj.name} - ${obj.role} [Team : ${obj.parent.name}]</option>`;
      });
      $('.getteam').empty().append(teamDropdown);
    },
    error: function (error) {
      toastr.error('Failed to load user team. ');
    },
  });
  KTApp.blockPage({
    overlayColor: '#000000',
    state: 'primary',
  });
  getTask(key);

  $('#milestoneview').on('click', function () {
    $('#milestonepanel').show('slow');
  });

  $('#closemilestone').on('click', function () {
    $('#milestonepanel').hide('slow');
  });

  getfiles(key);
  getsolution(key);
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
            url: '/api/task/' + key,
            success: function (data) {
              if (data.redirect) {
                return (window.location.href = data.redirect);
              }
              swal.fire('Deleted!', data, 'success').then(function () {
                window.location.href = '/su/task';
              });
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
    document.getElementById('attachemntFile').files.length > 0
      ? formData.append(
          'attachemntFile',
          document.getElementById('attachemntFile').files[0]
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
    var formData = new FormData();

    // Read selected files
    var totalfiles = document.getElementById('files').files.length;
    if (totalfiles === 0) {
      toastr.warning('Select a file to be uploaded');
      KTApp.unblock('#fileupload_portlet');
      return false;
    }
    var fileSize = 0;
    for (var index = 0; index < totalfiles; index++) {
      fileSize += document.getElementById('files').files[index].size;
      formData.append('files[]', document.getElementById('files').files[index]);
    }
    if (fileSize / 1024 / 1024 > 50 || totalfiles > 5) {
      KTApp.unblock('#fileupload_portlet');
      return toastr.warning(
        `File(s) ${totalfiles}, size is ${(fileSize / 1024 / 1024).toFixed(
          2
        )}MB.`
      );
    }

    $.ajax({
      type: 'POST',
      url: '/api/briefupload/brief/' + key,
      data: formData,
      contentType: false,
      processData: false,
      success: function (data) {
        if (data.redirect) {
          return (window.location.href = data.redirect);
        }
        getfiles(key);
        $('#files').val('');
        $("[for='customFile']").text('Choose file');
        toastr.success('file uploaded successfully');
        KTApp.unblock('#fileupload_portlet');
      },
      error: function (error) {
        if (!error.message) {
          getfiles(key);
        }
        toastr.error('something is wrong! Please check');
        KTApp.unblock('#fileupload_portlet');
      },
    });
  });

  $('.solutionuploadform').submit(function (e) {
    KTApp.block('#solutionupload_portlet', {
      overlayColor: '#000000',
      type: 'v2',
      state: 'success',
      message: 'Uploading files...',
    });
    e.preventDefault();
    var formData = new FormData();
    var totalfiles = document.getElementById('files1').files.length;
    if (totalfiles === 0) {
      toastr.warning('Select a file to be uploaded');
      KTApp.unblock('#solutionupload_portlet');
      return false;
    }
    var fileSize = 0;
    for (var index = 0; index < totalfiles; index++) {
      fileSize += document.getElementById('files1').files[index].size;
      formData.append(
        'files1[]',
        document.getElementById('files1').files[index]
      );
    }
    if (fileSize / 1024 / 1024 > 50 || totalfiles > 5) {
      KTApp.unblock('#solutionupload_portlet');
      return toastr.warning(
        `File(s) ${totalfiles}, size is ${(fileSize / 1024 / 1024).toFixed(
          2
        )}MB.`
      );
    }
    $.ajax({
      type: 'POST',
      url: '/api/solutionupload/solution/' + key,
      data: formData,
      contentType: false,
      processData: false,
      success: function (data) {
        if (data.redirect) {
          return (window.location.href = data.redirect);
        }
        getsolution(key);
        $('#files1').val('');
        $("[for='customFile']").text('Choose file');
        toastr.success('file uploaded successfully');
        KTApp.unblock('#solutionupload_portlet');
      },
      error: function (error) {
        if (!error.message) {
          getsolution(key);
        }
        toastr.error('something is wrong! Please check');
        KTApp.unblock('#solutionupload_portlet');
      },
    });
  });
  $.ajax({
    type: 'GET',
    url: '/su/list/taskeffort/' + key,
    success: function (data) {
      var table = $("#efforttable tbody");
    // $.each(data, function(idx, elem){
    //   console.log(elem)

    //     table.append("<tr><td>"+elem.doneby.name+"</td><td>"+elem.achived_wordcount+"</td>   <td>"+elem.approved+"</td></tr>");
    // });
    var taskdata = data.data
    for (var i = 0; i < taskdata.length; i++) {
      console.log(taskdata[i].doneby.name)
      table.append("<tr><td>"+taskdata[i].doneby.name+"</td><td>"+taskdata[i].achived_wordcount+"</td>   <td>"+taskdata[i].approved+"</td></tr>");
    }
    },
    error: function (error) {
    }
  })
  
});

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

const getTask = (key) => {
  $.ajax({
    type: 'GET',
    url: '/api/task/' + key,
    success: function (data) {
      if(data.payment.locked){
        $("#paymentalert").show();
        $("#paymentdetail").empty().text("Paid= "+data.payment.lockedData.amount_paid+data.payment.lockedData.currency+"& Budget="+data.payment.lockedData.budget+data.payment.lockedData.currency);
      }
      if(data.task.deleted){
        $("#deletedtask").show();
      }
      const { task } = data;
      currentTask = task;
      if (data.task == null) {
        KTApp.unblockPage();
        $('#errortask').fadeIn(2000);
      } else {
        KTApp.unblockPage();
        $('#tasktitle').text(data.task.title);
        $('#taskkey').html(
          "<i class='flaticon-add-label-button'></i>" + data.task._id
        );
        $('#sdeadline').html(
          "<i class='flaticon-calendar-with-a-clock-time-tools'></i> Soft date: " +
            datesend(data.task.soft_deadline)
        );
        $('#hdeadline').html(
          "<i class='flaticon-event-calendar-symbol'></i> Hard date: " +
            datesend(data.task.hard_deadline)
        );
        $('#wordcount').text('words: ' + data.task.wordcount);
        $('#timestampscreated').text(
          'created on: ' + datesend(data.task.createdAt)
        );
        $('#timestampsmodified').text(
          'modified on: ' + datesend(data.task.updatedAt)
        );
        $('#clientBdm')
          .empty()
          .append(
            '<strong>BDM: </strong>' +
              (data.task.client.assignedTo
                ? data.task.client.assignedTo.name
                : 'N/A')
          );
        if (data.payment.locked) {
          $('#requestApproval').show();
          $('#requestMessage')
            .empty()
            .append(
              `${data.task.client.assignedTo.name} asked for payment approval of `
            );
          $('#byBDMamount')
            .empty()
            .append(
              `${data.payment.lockedData.currency} ${data.payment.lockedData.amount_paid} Amount Paid `
            );
          $('#byBDMbudget')
            .empty()
            .append(
              `${data.payment.lockedData.currency} ${data.payment.lockedData.budget} Budget `
            );
        } else {
          $('#requestApproval').hide();
        }
        $('#taskstatus').text(data.status.status);
        $('#clientname').text(data.task.client.name);
        $('#clientname').attr('href', '/su/client/' + data.task.client._id);
        $('#createdby').text(data.task.createdby.name);
        $('#taskdesc').html(data.task.description);
        if (data.task.description == '') {
          $('.kt-widget__desc').hide();
        }
        $('#taskcreate').html(
          '<span class="kt-widget4__icon"><i class="flaticon2-next kt-font-danger"></i></span><a class="kt-widget4__title kt-widget4__title--light" href="#"><b>' +
            data.task.createdby.name +
            '</b> created this task on <b>' +
            timesend(data.task.createdAt) +
            '</b></a>'
        );
        if (data.payment.budget == undefined) {
          $('#budgettask').text('N/A');
          $('#paidamount').text('N/A');
        } else if (data.payment.budget != undefined) {
          $('#budgettask').text(
            data.payment.budget + ' ' + data.payment.currency
          );
          $('#paidamount').text(
            data.payment.amount_paid + ' ' + data.payment.currency
          );
          $('#selectcurrency').val(data.payment.currency);
          $('#totalpaidamount').val(data.payment.amount_paid);
          $('#taskamount').val(data.payment.budget);
        }
        $('.selecttaskuser').empty().append(`
        ${`<option value="${$(
          '.kt-subheader__main .kt-subheader__desc'
        ).text()}">Self - [${$(
          '.kt-subheader__main .kt-subheader__title'
        ).text()}]</option>`} 
        ${
          data.taskcomm.Admin
            ? `<option value="${data.taskcomm.Admin._id}">${data.taskcomm.Admin.name} - [Admin]</option>`
            : ''
        } 
        ${
          data.taskcomm.Manager
            ? `<option value="${data.taskcomm.Manager._id}">${data.taskcomm.Manager.name} - [Manager]</option>`
            : ''
        }
        ${
          data.taskcomm.TeamLead
            ? `<option value="${data.taskcomm.TeamLead._id}">${data.taskcomm.TeamLead.name} - [TeamLead]</option>`
            : ''
        }
        ${
          data.taskcomm.Expert
            ? `<option value="${data.taskcomm.Expert._id}">${data.taskcomm.Expert.name} - [Expert]</option>`
            : ''
        }
        `);
        if (data.taskcomm) {
          var lengthtaskcomm = data.taskcomm.tasklogs.length;
          for (i = 0; i < lengthtaskcomm; i++) {
            if (
              !!data.taskcomm.tasklogs[i].fileIds &&
              data.taskcomm.tasklogs[i].fileIds.length > 0
            ) {
              let filesNames = '';
              data.taskcomm.tasklogs[i].fileIds.forEach((element) => {
                filesNames += ` ${element.files}`;
              });
              $('#tasklogs').append(
                '<div class="kt-widget4__item"><span class="kt-widget4__icon"><i class="flaticon2-next kt-font-warning"></i></span><a class="kt-widget4__title kt-widget4__title--light" href="#"><b>' +
                  filesNames +
                  '</b> file(s) were sent to <b>' +
                  data.taskcomm.tasklogs[i].assignedto.name +
                  '</b> by <b>' +
                  data.taskcomm.tasklogs[i].assignedby.name +
                  '</b> on <b>' +
                  timesend(data.taskcomm.tasklogs[i].assignedon) +
                  '</b></a></div>'
              );
            } else {
              $('#tasklogs').append(
                !!data.taskcomm.tasklogs[i].assignedto
                  ? '<div class="kt-widget4__item"><span class="kt-widget4__icon"><i class="flaticon2-next kt-font-success"></i></span><a class="kt-widget4__title kt-widget4__title--light" href="#"><b>' +
                      data.taskcomm.tasklogs[i].assignedby.name +
                      '</b> assigned this task to <b>' +
                      data.taskcomm.tasklogs[i].assignedto.name +
                      '</b> on <b>' +
                      timesend(data.taskcomm.tasklogs[i].assignedon) +
                      '</b></a></div>'
                  : '<div class="kt-widget4__item"><span class="kt-widget4__icon"><i class="flaticon2-next kt-font-success"></i></span><a class="kt-widget4__title kt-widget4__title--light" href="#"><b>' +
                      data.taskcomm.tasklogs[i].assignedby.name +
                      '</b> completed the task on <b>' +
                      '</b> on <b>' +
                      timesend(data.taskcomm.tasklogs[i].assignedon) +
                      '</b></a></div>'
              );
            }
          }
        }

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
};

const getfiles = (key) => {
  $.ajax({
    type: 'GET',
    url: '/api/briefupload/' + key,
    success: function (data) {
      $('#briefupload').empty();

      for (var i = 0; i < data.length; i++) {
        $('#briefupload').append(
          `<div class="kt-widget4__item"><div class="kt-widget4__pic kt-widget4__pic--icon"><img src="
          ${data[i].fileUrl}
          " alt="" /></div><a class="kt-widget4__title" target="_blank" href="/api/solutionupload/get/taskfile/brief/${
            data[i]._id
          }" download>${
            data[i].files
          }</a><span style="text-align:right;">${timesend(
            data[i].createdAt
          )}</span></div>`
        );
      }
      KTApp.initTooltip($('a.kt-widget4__title'));
    },
  });
};
const getsolution = (key) => {
  $.ajax({
    type: 'GET',
    url: '/api/solutionupload/' + key,
    success: function (data) {
      $('#solutionupload').empty();
      for (var i = 0; i < data.length; i++) {
        // if (data[i].uploadedby.name == undefined) {
        //   var dataupload = null;
        // } else {
        //   var dataupload = data[i].uploadedby.name;
        // }

        $('#solutionupload').append(
          `<div class="kt-widget4__item" data-id='${data[i]._id}'>
          <label class="kt-checkbox kt-checkbox--brand">
            <input type="checkbox"><span></span>
          </label>
          <div class="kt-widget4__pic kt-widget4__pic--icon"><img src="
          ${data[i].fileUrl}
          " alt="" /></div><a class="kt-widget4__title" target="_blank" href="/api/solutionupload/get/taskfile/solution/${
            data[i]._id
          }" download>${data[i].files}
            </a><span style="text-align:right;">${timesend(
              data[i].createdAt
            )}</span></div>`
        );
      }
      KTApp.initTooltip($('a.kt-widget4__title'));
    },
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
    url: '/api/payment/' + key,
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
      $('#budgettask')
        .empty()
        .text(responseData.budget + ' ' + responseData.currency);
      $('#paidamount')
        .empty()
        .text(responseData.amount_paid + ' ' + responseData.currency);
      $('#selectcurrency').val(responseData.currency);
      $('#totalpaidamount').val(responseData.amount_paid);
      $('#taskamount').val(responseData.budget);
    },
    error: function (error) {
      toastr.error('Not able update payment');
    },
  });
};

const taskAssign = () => {
  $.ajax({
    method: 'PUT',
    url: '/api/taskcomm/' + key,
    data: {
      assignedto: $('.getteam').val(),
      softdeadline: $('#softDate').val(),
    },
    success: function (responseData) {
      if (responseData.redirect) {
        return (window.location.href = responseData.redirect);
      }
      getTask(key);
      $('#closeAssign').trigger('click');
      toastr.success('Assigned User Sucessfully');
      // $(".taskstatus")
      //   .empty()
      //   .append(responseData.updatestatus.status);
      // $("#tasklogs").append(
      //   '<div class="kt-widget4__item"><span class="kt-widget4__icon"><i class="flaticon2-next kt-font-success"></i></span><a class="kt-widget4__title kt-widget4__title--light" href="#"><b>' +
      //     responseData.updatecomm.assignedby +
      //     "</b> assigned this task to <b>" +
      //     responseData.updatecomm.assignedto +
      //     "</b> on <b>" +
      //     timesend(dresponseData.updatecomm.assignedon) +
      //     "</b></a></div>"
      // );
    },
    error: function (error) {
      toastr.error('Not able to assign the task to user');
    },
  });
};
