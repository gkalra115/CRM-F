'use strict';

var taskId;

var KTDatatablesExtensionButtons = (function () {
  var initTable3 = function (task, status) {
    var table = $('#kt_table_3').DataTable({
      dom: 'tpi',
      //   dom: "B<'row'><'row'<'col-md-6'l><'col-md-6'f>r>t<'row'<'col-md-4'i>><'row'p>B",
      responsive: true,
      select: {
        style: 'single',
      },
      buttons: [
        {
          extend: 'print',
          exportOptions: {
            columns: 'th:not(:last-child)',
          },
        },
        {
          extend: 'copyHtml5',
          exportOptions: {
            columns: 'th:not(:last-child)',
          },
        },
        {
          extend: 'excelHtml5',
          exportOptions: {
            columns: 'th:not(:last-child)',
          },
        },
        {
          extend: 'csvHtml5',
          exportOptions: {
            columns: 'th:not(:last-child)',
          },
        },
        {
          extend: 'pdfHtml5',
          exportOptions: {
            columns: 'th:not(:last-child)',
          },
        },
      ],
      processing: true,
      searchDelay: 500,
      ajax: {
        url: '/teamlead/task/current',
        type: 'GET',
        data: {
          // parameters for custom backend script demo
          columnsDef: [
            'data._id',
            'data.title',
            'data.deadline',
            'data.wordcount',
          ],
        },
        error: function (error) {
          toastr.error(error.responseText);
        },
      },
      columns: [{ data: 'data._id' }],
      // createdRow: function( row, data, dataIndex ) {
      //     $(row).attr('onclick', `toggleTaskCanvas('${data._id}')`);
      // },
      columnDefs: [
        {
          targets: 0,
          render: function (data, type, full, meta) {
            var taskstatus = {
              Unassigned: { title: 'Unassigned', color: 'rgba(219,9,9,0.6)' },
              'Assigned to Admin': {
                title: 'Assigned to Admin',
                color: 'rgba(204,129,16,0.8)',
              },
              'Assigned to Manager': {
                title: 'Assigned to Manager',
                color: 'rgba(201,204,16,0.8)',
              },
              'Assigned to TeamLead': {
                title: 'Assigned to TeamLead',
                color: 'rgba(123,16,204,0.8)',
              },
              Running: { title: 'Running', color: 'rgba(3,156,6,0.8)' },
              'Quality Check': {
                title: 'Quality Check',
                color: 'rgba(66,79,67,0.8)',
              },
              Completed: { title: 'Completed', color: 'rgba(128,64,0,0.8)' },
              Delivered: { title: 'Delivered', color: 'rgba(16,85,145,0.8)' },
            };
            var dateSoft = convertTableDate(full.soft_deadline);
            if (full.Manager == undefined) {
              var manager = 'N/A';
            }
            if (full.Manager != undefined) {
              var manager = full.Manager.name;
            }
            if (full.Expert == undefined) {
              var expert = 'N/A';
            }
            if (full.Expert != undefined) {
              var expert = full.Expert.name;
            }
            return `
            <div class="kt-widget5">
                <div class="kt-widget5__item">
                  <div class="kt-widget5__content">
                    <div class="kt-widget5__section"><span class="kt-widget5__title" style="font-size:1.3rem;pointer-events:none">${full.title
              }</span>
                      
                    <div class="kt-widget5__info">
                    <span>
                    Expert :
                      <span class="kt-font-info" style="font-weight:600">${expert} </span>
                    </span>
                  </div>
                      <div class="kt-widget5__info" style="padding: 0.5rem 0">
                        <span>
                        WordCount :
                          <span class="kt-font-info" style="font-weight:600">${full.wordcount
              } </span>
                        </span>
                      </div>
                    </div>
                  </div>
                  
                <div class="kt-widget__action">
                              <span class="btn btn-label-success btn-sm btn-bold btn-upper">${dateSoft}</span>
                              <span class="kt-badge kt-badge--inline" style="color:#fff; font-weight:600;font-size:0.875rem; padding: 0.5rem 1rem 0.5rem 1rem; border-radius:0.2rem;background-color:${taskstatus[full.status].color
              };">${full.status}</span>
                            </div>
              </div>
              `;
          },
        },
      ],
    });
    $('#export_print').on('click', function (e) {
      e.preventDefault();
      table.button(0).trigger();
    });

    $('#export_copy').on('click', function (e) {
      e.preventDefault();
      table.button(1).trigger();
    });

    $('#export_excel').on('click', function (e) {
      e.preventDefault();
      table.button(2).trigger();
    });

    $('#export_csv').on('click', function (e) {
      e.preventDefault();
      table.button(3).trigger();
    });

    $('#export_pdf').on('click', function (e) {
      e.preventDefault();
      table.button(4).trigger();
    });

    //Adding Row select to retrive row information
    $('#kt_table_3 tbody').on('click', 'tr', function () {
      var rowData = table.rows(table.row(this).index()).data()[0];
      $('#noTaskSelected').hide('fast');
      $('#taskAssignId').empty().append(rowData._id);
      $('#taskData').fadeIn('slow');
      if ($('#taskId').text() === rowData._id) {
        $('#taskData').hide();
        $('#taskId').empty();
        $('#noTaskSelected').fadeIn('slow');
        return 0;
      }
      KTApp.blockPage({
        overlayColor: '#000000',
        type: 'v2',
        state: 'success',
        message: 'Please wait...',
      });
      if ($('#taskId').text() !== rowData._id) {
        // $('#taskClientName').empty().append(rowData.client.name)
        // $('#taskClientEmail').empty().append(rowData.client.email)
        // $('#taskClientPhone').empty().append(rowData.client.phone)
        // $('#taskSoft').empty().append(convertTableDate(rowData.soft_deadline))
        // $('#taskHard').empty().append(convertTableDate(rowData.hard_deadline))

        // $('#taskWord').empty().append(rowData.wordcount)
        // $('#taskCreatedName').empty().append(rowData.createdby.name)
        // $('#taskCreatedEmail').empty().append(rowData.createdby.email)
        // $('#taskCreatedPhone').empty().append(rowData.createdby.phone)

        getsolution(rowData._id);
        getfiles(rowData._id);
        $.ajax({
          type: 'GET',
          url: '/teamlead/task/view/' + rowData._id,
          success: function (data) {
            $('#taskkey').empty().append(data.task[0]._id);
            $('#initChar').empty().append(data.task[0].title.charAt(0));
            $('#taskTitle')
              .empty()
              .append(data.task[0].title.substring(0, 15) + '..');
            $('#taskId').empty().append(data.task[0]._id);
            $('.taskstatus').empty().append(data.task[0].status);
            $('#taskDesc').empty().append(data.task[0].description);
            $('#taskdetails').attr('href', '/te/view/' + $('#taskId').text());
            if (data.task[0].Manager == undefined) {
              $('#manager').empty().append('N/A');
            }
            if (data.task[0].Manager != undefined) {
              $('#manager').empty().append(data.task[0].Manager.name);
            }

            if (data.task[0].TeamLead == undefined) {
              $('#teamlead').empty().append('N/A');
            }
            if (data.task[0].TeamLead != undefined) {
              $('#teamlead').empty().append(data.task[0].TeamLead.name);
            }
            if (data.task[0].description == undefined) {
              $('#taskDesc').empty();
            }
            var lengthcomments = data.comments.length;
            $('#commentslist').empty();
            for (var j = 0; j < lengthcomments; j++) {
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
          },
          error: function (error) {
            toastr.error('Some error in loading the comments');
          },
        });
      }
      taskId = rowData._id;
      KTApp.unblockPage();
    });
    $('#generalSearch').keyup(function () {
      table.search($(this).val()).draw();
    });
  };

  return {
    //main function to initiate the module
    init: function (task, status) {
      initTable3(task, status);
    },
  };
})();

const convertTableDate = (date) => {
  var months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  let current_datetime = new Date(date);
  var formatted_date =
    current_datetime.getDate() +
    ' ' +
    months[current_datetime.getMonth()] +
    ' ' +
    current_datetime.getFullYear();
  return formatted_date;
};

const convertFormDate = (date) => {
  var formatted_date = date.split(' ');
  var months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  return `${formatted_date[2]}-${months.indexOf(formatted_date[1]).toString().length > 1
    ? months.indexOf(formatted_date[1]) + 1
    : '0' + months.indexOf(formatted_date[1]) + 1
    }-${formatted_date[0]}`;
};

function datesend(date) {
  var aestTime = new Date(date);
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
  var aestTime = new Date(date);
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

const getfiles = (key) => {
  $.ajax({
    type: 'GET',
    url: '/api/briefupload/' + key,
    success: function (data) {
      $('#briefupload').empty();
      var k = 0;
      for (k = 0; k < data.length; k++) {
        $('#briefupload').append(
          `<div class="kt-widget4__item"><div class="kt-widget4__pic kt-widget4__pic--icon"><img src="
          ${data[k].fileUrl}
          " alt="" /></div><a class="kt-widget4__title" target="_blank" href="/api/solutionupload/get/taskfile/brief/${data[k]._id}" download data-toggle="kt-tooltip" data-original-title="${data[k].uploadedby.name
          }">${data[k].files}
            </a><span style="text-align:right;">${timesend(
            data[k].createdAt
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
      for (var l = 0; l < data.length; l++) {
        $('#solutionupload').append(
          `<div class="kt-widget4__item">
          <label class="kt-checkbox kt-checkbox--brand">
            <input type="checkbox"><span></span>
          </label>
          <div class="kt-widget4__pic kt-widget4__pic--icon"><img src="
          ${data[l].fileUrl}
          " alt="" /></div><a class="kt-widget4__title" target="_blank" href="/api/solutionupload/get/taskfile/solution/${data[l].current_datetime}" download data-toggle="kt-tooltip" data-original-title="${data[l].uploadedby.name
          }">${data[l].files}
            </a><span style="text-align:right;">${timesend(
            data[l].createdAt
          )}</span></div>`
        );
      }
      KTApp.initTooltip($('a.kt-widget4__title'));
    },
  });
};

function displayFilteredTable(urlArg, toHide) {
  $('#taskData').hide();
  $('#noTaskSelected').show();
  if (toHide === 'true') {
    $('#hideSelectGo').hide();
  } else {
    $('#hideSelectGo').show();
  }
  if ($('#changePage').text() !== urlArg) {
    $('#changePage').text(urlArg);
    if (toHide === 'false') {
      $('#kt_select2_112').select2('val', 'all');
    }
  }
  var status = $('#kt_select2_112').val();
  $('#hideSelect').text(toHide);
  KTApp.block('#kt_table_3', {
    overlayColor: '#000000',
    type: 'v2',
    state: 'success',
    message: 'Please wait...',
  });
  if ($.fn.DataTable.isDataTable('#kt_table_3')) {
    $('#kt_table_3').DataTable().destroy();
  }
  $('#kt_table_3 tbody').empty();
  KTDatatablesExtensionButtons.init(urlArg, status);
  KTApp.unblock('#kt_table_3');
}

jQuery(document).ready(function () {
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
      url: '/api/solutionupload/solution/' + $('#taskId').text(),
      data: formData,
      contentType: false,
      processData: false,
      success: function (data) {
        getsolution($('#taskId').text());
        toastr.success('file uploaded successfully');
        KTApp.unblock('#solutionupload_portlet');
      },
      error: function (error) {
        getsolution($('#taskId').text());
        toastr.srror('something is wrong! Please check');
        KTApp.unblock('#solutionupload_portlet');
      },
    });
  });
  $.ajax({
    type: 'GET',
    url: '/teamlead/employee/getTeam',
    success: function (responseData) {
      let teamDropdown = `<option value ="">Select an Employee</option>`;
      responseData.forEach((obj) => {
        teamDropdown += `<option value="${obj.id}">${obj.name}</option>`;
      });
      $('#kt_select2_1').empty().append(teamDropdown);
    },
    error: function (error) {
      toastr.error('Failed to load user team. ');
    },
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
      url: '/api/comment/create/' + $('#taskId').text(),
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
        }, 1000);
      },
      error: function (err) {
        KTApp.unblock('#comment_portlet');
        console.log(err.responseJSON);
        let err_message = err.responseJSON.errors[0].msg;
        toastr.error(err_message);
      },
    });
  });
  $('#changePage').text('201');
  $('#hideSelect').text('false');
  $('#applyFilter').on('click', function () {
    displayFilteredTable($('#changePage').text(), $('#hideSelect').text());
  });
  $('#changePage').on('change', function () {
    $('#kt_select2_112').select2('val', 'all');
  });
  KTDatatablesExtensionButtons.init('201');
});

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
          url: '/teamlead/task/status/' + $('#taskAssignId').text(),
          success: function (data) {
            console.log(data);
            if ($.fn.DataTable.isDataTable('#kt_table_3')) {
              $('#kt_table_3').DataTable().destroy();
            }
            $('#kt_table_3 tbody').empty();
            KTDatatablesExtensionButtons.init();
            $('#taskData').hide();
            $('#noTaskSelected').show();
            swal.fire(
              'Completed',
              'This task has marked as completed',
              'success'
            );
            toastr.success('Task Completed Sucessfully');
          },
          error: function (error) {
            console.log(error);
            toastr.error('Please try again');
          },
        });
      } else if (result.dismiss === 'cancel') {
        swal.fire('Cancelled', 'Please complete it asap', 'error');
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
      if ($.fn.DataTable.isDataTable('#kt_table_3')) {
        $('#kt_table_3').DataTable().destroy();
      }
      $('#kt_table_3 tbody').empty();
      KTDatatablesExtensionButtons.init();
      $('.taskstatus').empty().append(responseData.updatestatus.status);
      $('#tasklogs').append(
        '<div class="kt-widget4__item"><span class="kt-widget4__icon"><i class="flaticon2-next kt-font-success"></i></span><a class="kt-widget4__title kt-widget4__title--light" href="#"><b>' +
        responseData.updatecomm.assignedby +
        '</b> assigned this task to <b>' +
        responseData.updatecomm.assignedto +
        '</b> on <b>' +
        timesend(dresponseData.updatecomm.assignedon) +
        '</b></a></div>'
      );
    },
    error: function (error) {
      toastr.error(error.responseJSON.घोषणा);
    },
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
