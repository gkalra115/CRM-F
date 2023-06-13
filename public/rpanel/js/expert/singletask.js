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
var key = $(document).find('title').text();
$(document).ready(async function () {
  $('#kt_select2_1').select2();

  KTApp.blockPage({
    overlayColor: '#000000',
    state: 'primary',
  });

  $.ajax({
    type: 'GET',
    url: '/expert/task/single/' + key,
    success: function (data) {
      console.log(data)
      if (data.task[0] == null) {
        KTApp.unblockPage();
        $('#errortask').fadeIn(2000);
      } else {
        KTApp.unblockPage();
        if (data.task[0].Manager == undefined) {
          var manager = 'N/A';
        }
        if (data.task[0].Manager != undefined) {
          var manager = data.task[0].Manager.name;
        }
        if (data.task[0].TeamLead == undefined) {
          var lead = 'N/A';
        }
        if (data.task[0].TeamLead != undefined) {
          var lead = data.task[0].TeamLead.name;
        }
        if (data.task[0].Expert != undefined) {
          var expert = 'N/A';
        }
        if (data.task[0].Expert != undefined) {
          var expert = data.task[0].Expert.name;
        }
        $('#errortask').hide();
        $('#task_portlet').show();
        $('#tasktitle').text(data.task[0].title);
        $('#taskkey').html(
          "<i class='flaticon-add-label-button'></i>" + data.task[0]._id
        );
        $('#wordcount').text('words: ' + data.task[0].wordcount);
        $('#timestampsmodified').text('Team Lead: ' + lead);
        $('#timestampscreated').text('Manager: ' + manager);
        $('#softdeadline').text(datesend(data.task[0].soft_deadline));
        $('#harddeadline').text(data.task[0].status);
        var commList = ``;
        data.userdetails[0].Admin
          ? (commList += `<option value="${data.userdetails[0].Admin._id}">${data.userdetails[0].Admin.name}</option>`)
          : null;
        data.userdetails[0].Manager
          ? (commList += `<option value="${data.userdetails[0].Manager._id}">${data.userdetails[0].Manager.name}</option>`)
          : null;
        data.userdetails[0].TeamLead
          ? (commList += `<option value="${data.userdetails[0].TeamLead._id}">${data.userdetails[0].TeamLead.name}</option>`)
          : null;
        data.userdetails[0].Expert
          ? (commList += `<option value="${data.userdetails[0].Expert._id}">${data.userdetails[0].Expert.name}</option>`)
          : null;

        $('.selecttaskuser').empty().append(commList);
        //   $("#clientname").text(data.task.client.name);
        //   $("#clientname").attr("href", "/su/client/"+data.task.client._id);
        //   $("#createdby").text(data.task.createdby.name);
        $('#taskdesc').html(data.task[0].description);

        if (data.task[0].description == '') {
          $('.kt-widget__desc').hide();
        }
        $('#commentslist').empty();
        var lengthcomments = data.comments.length;
        for (j = 0; j < lengthcomments; j++) {
          if (data.comments[j].commentto == null) {
            $('#commentslist').append(
              '<div class="kt-widget3__item"><div class="kt-widget3__header"><div class="kt-widget3__user-img"><span class="kt-badge kt-badge--username kt-badge--unified-success kt-badge--lg kt-badge--rounded kt-badge--bold" style="margin-right:10px;">' +
              data.comments[j].commentby.name.charAt(0) +
              '<div></div><div></div></span></div><div class="kt-widget3__info"><a class="kt-widget3__username" href="#">' +
              data.comments[j].commentby.name +
              '</a><br /><span class="kt-widget3__time">' +
              timesend(data.comments[j].createdAt) +
              '</span></div><span class="kt-widget3__status kt-font-brand"></span></div><div class="kt-widget3__body"><p class="kt-widget3__text">' +
              data.comments[j].comment +
              '</p></div></div>'
            );
          } else {
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
                  ' </p><a target="_blank" href="' +
                  data.comments[j].commentFile._id +
                  '" download>' +
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
        }
        //   $("#taskcreate").html(
        //     '<span class="kt-widget4__icon"><i class="flaticon2-next kt-font-danger"></i></span><a class="kt-widget4__title kt-widget4__title--light" href="#"><b>' +
        //       data.task.createdby.name +
        //       "</b> created this task on <b>" +
        //       timesend(data.task.createdAt) +
        //       "</b></a>"
        //   );
        //   if (data.payment.budget == undefined) {
        //     $("#budgettask").text("N/A");
        //     $("#paidamount").text("N/A");
        //   } else if (data.payment.budget != undefined) {
        //     $("#budgettask").text(
        //       data.payment.budget + " " + data.payment.currency
        //     );
        //     $("#paidamount").text(
        //       data.payment.amount_paid + " " + data.payment.currency
        //     );
        //   }
        //   if(data.taskcomm){
        //     var lengthtaskcomm = data.taskcomm.tasklogs.length;
        //
        //     for (i = 0; i < lengthtaskcomm; i++) {
        //       $("#tasklogs").append(
        //         '<div class="kt-widget4__item"><span class="kt-widget4__icon"><i class="flaticon2-next kt-font-success"></i></span><a class="kt-widget4__title kt-widget4__title--light" href="#"><b>' +
        //           data.taskcomm.tasklogs[i].assignedby.name +
        //           "</b> assigned this task to <b>" +
        //           data.taskcomm.tasklogs[i].assignedto.name +
        //           "</b> on <b>" +
        //           timesend(data.taskcomm.tasklogs[i].assignedon) +
        //           "</b></a></div>"
        //       );
        //     }
        //   }

        //   var lengthcomments = data.comments.length;
        //   for (j = 0; j < lengthcomments; j++) {
        //     $("#commentslist").append(
        //       '<div class="kt-widget3__item"><div class="kt-widget3__header"><div class="kt-widget3__user-img"><span class="kt-badge kt-badge--username kt-badge--unified-success kt-badge--lg kt-badge--rounded kt-badge--bold" style="margin-right:10px;">' +
        //         data.comments[j].commentby.name.charAt(0) +
        //         '<div></div><div></div></span></div><div class="kt-widget3__info"><a class="kt-widget3__username" href="#">' +
        //         data.comments[j].commentby.name +
        //         '</a> to <a class="kt-widget3__username" href="#">' +
        //          data.comments[j].commentto. hasOwnProperty('name')  ? data.comments[j].commentto.name : '' +
        //         '</a><br /><span class="kt-widget3__time">' +
        //         timesend(data.comments[j].createdAt) +
        //         '</span></div><span class="kt-widget3__status kt-font-brand"></span></div><div class="kt-widget3__body"><p class="kt-widget3__text">' +
        //         data.comments[j].comment +
        //         "</p></div></div>"
        //     );
        //   }
        //   $("#task_portlet").fadeIn("slow");
        // }
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
            url: '/api/task/' + key,
            success: function (data) {
              swal.fire('Deleted!', data, 'success');
            },
          });
        }
      });
  });
  // $.ajax({
  //   type: 'GET',
  //   url: '/api/taskcomm/getuser/' + key,
  //   success: function (data) {
  //
  //     for (i = 0; i < data.length; i++) {
  //       let dataId = !!data[i] ? data[i]._id._id : '';
  //       let dataName = !!data[i] ? data[i]._id.name : '';
  //       $('.selecttaskuser').append(
  //         '<option value="' + dataId + '">' + dataName + '</option>'
  //       );
  //     }
  //   },
  // });
  $('#commentreply').on('click', function () {
    if ($('#commenttext').val() === '') {
      toastr.warning('Please enter a comment.');

      return;
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
        KTApp.unblock('#comment_portlet');
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
        getsolution(key);

        toastr.error('something is wrong! Please check');
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
          " alt="" /></div><a class="kt-widget4__title" target="_blank" href="/api/solutionupload/get/taskfile/brief/${data[i]._id}" download data-toggle="kt-tooltip" data-original-title="by ${data[i].uploadedby.name}">${data[i].files}
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

const completetask = () => {
  swal
    .fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, completed!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true,
    })
    .then(function (result) {
      if (result.value) {
        $.ajax({
          method: 'PUT',
          url: '/expert/task/status/' + key,
          success: function (data) {
            $('#harddeadline').text(data.status);
            swal.fire(
              'Completed',
              'This task has marked as completed',
              'success'
            );
            toastr.success('Task Completed Sucessfully');
          },
          error: function (error) {
            toastr.error('Please try again');
          },
        });
      } else if (result.dismiss === 'cancel') {
        swal.fire('Cancelled', 'Please complete it asap', 'error');
      }
    });
};
