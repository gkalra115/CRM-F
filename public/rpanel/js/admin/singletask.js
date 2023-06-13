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

$(document).ready(async function () {
  $('#kt_select2_1').select2();
  var key = $(document).find('title').text();
  KTApp.blockPage({
    overlayColor: '#000000',
    state: 'primary',
  });
  $.ajax({
    type: 'GET',
    url: '/admin/task/' + key,
    success: function (data) {
      if (data.task == null) {
        KTApp.unblockPage();
        $('#errortask').fadeIn(2000);
      } else {
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
        $('#taskExpert').text(
          data.taskcomm.Expert ? data.taskcomm.Expert.name : 'N/A'
        );
        $('#taskManager').text(
          data.taskcomm.Manager ? data.taskcomm.Manager.name : 'N/A'
        );
        $('#taskTeamlead').text(
          data.taskcomm.TeamLead ? data.taskcomm.TeamLead.name : 'N/A'
        );
        $('#clientname').text(data.task.client.name);
        $('#clientname').attr('href', '/su/client/' + data.task.client._id);
        $('#createdby').text(data.task.createdby.name);
        $('#taskdesc').html(data.task.description);
        $('.selecttaskuser').empty().append(`
            ${data.taskcomm.Admin
            ? `<option value="${data.taskcomm.Admin._id}">${data.taskcomm.Admin.name} - [Admin]</option>`
            : ''
          } 
            ${data.taskcomm.Manager
            ? `<option value="${data.taskcomm.Manager._id}">${data.taskcomm.Manager.name} - [Manager]</option>`
            : ''
          }
            ${data.taskcomm.TeamLead
            ? `<option value="${data.taskcomm.TeamLead._id}">${data.taskcomm.TeamLead.name} - [TeamLead]</option>`
            : ''
          }
            ${data.taskcomm.Expert
            ? `<option value="${data.taskcomm.Expert._id}">${data.taskcomm.Expert.name} - [Expert]</option>`
            : ''
          }
            `);
        $('#taskcreate').html(
          '<span class="kt-widget4__icon"><i class="flaticon2-next kt-font-danger"></i></span><a class="kt-widget4__title kt-widget4__title--light" href="#"><b>' +
          data.task.createdby.name +
          '</b> created this task on <b>' +
          timesend(data.task.createdAt) +
          '</b></a>'
        );
        if (data.taskcomm) {
          var lengthtaskcomm = data.taskcomm.tasklogs.length;
          for (i = 0; i < lengthtaskcomm; i++) {
            $('#tasklogs').append(
              '<div class="kt-widget4__item"><span class="kt-widget4__icon"><i class="flaticon2-next kt-font-success"></i></span><a class="kt-widget4__title kt-widget4__title--light" href="#"><b>' +
              data.taskcomm.tasklogs[i].assignedby.name +
              '</b> assigned this task to <b>' +
              data.taskcomm.tasklogs[i].assignedto.name +
              '</b> on <b>' +
              timesend(data.taskcomm.tasklogs[i].assignedon) +
              '</b></a></div>'
            );
          }
        }

        var lengthcomments = data.comments.length;
        for (j = 0; j < lengthcomments; j++) {
          if (data.comments[j].commentFile) {
            $('#commentslist').append(
              '<div class="kt-widget3__item"><div class="kt-widget3__header"><div class="kt-widget3__user-img"><span class="kt-badge kt-badge--username kt-badge--unified-success kt-badge--lg kt-badge--rounded kt-badge--bold" style="margin-right:10px;">' +
                data.comments[j].commentby.name.charAt(0) +
                '<div></div><div></div></span></div><div class="kt-widget3__info"><a class="kt-widget3__username" href="#">' +
                data.comments[j].commentby.name +
                '</a> to <a class="kt-widget3__username" href="#">' +
                !!data.comments[j].commentto ? data.comments[j].commentto.name : '' +
                '</a><br /><span class="kt-widget3__time">' +
                timesend(data.comments[j].createdAt) +
                '</span></div><span class="kt-widget3__status kt-font-brand"></span></div><div class="kt-widget3__body"><p class="kt-widget3__text">' +
                data.comments[j].comment +
                ' </p><a target="_blank" href="/api/solutionupload/get/taskfile/comment/' +
                data.comments[j]._id +
                '">' +
                data.comments[j].commentFile.files +
                '</a></div></div>'
            );
          } else {
            $('#commentslist').append(
              '<div class="kt-widget3__item"><div class="kt-widget3__header"><div class="kt-widget3__user-img"><span class="kt-badge kt-badge--username kt-badge--unified-success kt-badge--lg kt-badge--rounded kt-badge--bold" style="margin-right:10px;">' +
                data.comments[j].commentby.name.charAt(0) +
                '<div></div><div></div></span></div><div class="kt-widget3__info"><a class="kt-widget3__username" href="#">' +
                data.comments[j].commentby.name +
                '</a> to <a class="kt-widget3__username" href="#">' +
                !!data.comments[j].commentto ? data.comments[j].commentto.name : '' +
                '</a><br /><span class="kt-widget3__time">' +
                timesend(data.comments[j].createdAt) +
                '</span></div><span class="kt-widget3__status kt-font-brand"></span></div><div class="kt-widget3__body"><p class="kt-widget3__text">' +
                data.comments[j].comment +
                '</p></div></div>'
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
            url: '/admin/task/' + key,
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
              data.data.commentto.hasOwnProperty('name') ? data.data.commentto.name : '' +
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
              data.data.commentto.hasOwnProperty('name') ? data.data.commentto.name : '' +
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
    formData.append('files', file);
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

  $('.solutionuploadform').submit(function (e) {
    KTApp.block('#solutionupload_portlet', {
      overlayColor: '#000000',
      type: 'v2',
      state: 'success',
      message: 'Uploading files...',
    });
    e.preventDefault();
    var file = document.getElementById('files1').files[0];
    var formData = new FormData();
    formData.append('files', file);
    $.ajax({
      type: 'POST',
      url: '/api/solutionupload/solution/' + key,
      data: formData,
      contentType: false,
      processData: false,
      success: function (data) {
        getsolution(key);
        toastr.success('file uploaded successfully');
        KTApp.unblock('#solutionupload_portlet');
      },
      error: function (error) {
        getsolution(key);
        toastr.srror('something is wrong! Please check');
        KTApp.unblock('#solutionupload_portlet');
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
          " alt="" /></div><a class="kt-widget4__title" target="_blank" href="/api/solutionupload/get/taskfile/brief/${data[i]._id}" download data-toggle="kt-tooltip" data-original-title="${data[i].uploadedby ? data[i].uploadedby.name : ''
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
const getsolution = (key) => {
  $.ajax({
    type: 'GET',
    url: '/api/solutionupload/' + key,
    success: function (data) {
      $('#solutionupload').empty();
      for (i = 0; i < data.length; i++) {
        $('#solutionupload').append(
          `<div class="kt-widget4__item"><div class="kt-widget4__pic kt-widget4__pic--icon"><img src="
          ${data[i].fileUrl}
          " alt="" /></div><a class="kt-widget4__title" target="_blank" href="/api/solutionupload/get/taskfile/solution/${data[i]._id}" download data-toggle="kt-tooltip" data-original-title="${data[i].uploadedby.name
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
