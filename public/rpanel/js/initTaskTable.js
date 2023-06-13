'use strict';

var taskId;
var currentTask;
// Function Declration for initializing the table for task list
var KTDatatablesExtensionButtons = (function () {
  var initTable3 = function (task, status, dateRange) {
    // console.log(task,status)
    var apiUrl =
      status !== undefined &&
      status !== 'all' &&
      task !== '202' &&
      task !== '203'
        ? `/api/task/filter?task=${task}&status=${status}`
        : `/api/task/filter?task=${task}`;
    apiUrl = apiUrl + (dateRange ? `&dateRange=${dateRange}` : ``);
    var table = $('#kt_table_3').DataTable({
      dom: 'ltpi',
      //   dom: "B<'row'><'row'<'col-md-6'l><'col-md-6'f>r>t<'row'<'col-md-4'i>><'row'p>B",
      responsive: true,
      select: {
        style: 'single',
      },
      order: [],
      searchDelay: 500,
      ajax: {
        url: apiUrl,
        type: 'GET',
        data: {
          // parameters for custom backend script demo
          columnsDef: [
            '_id',
            'title',
            'deadline',
            'wordcount',
            'created by',
            'client',
          ],
        },
        error: function (error) {
          toastr.error(error.responseText);
        },
      },
      columns: [{ data: '_id' }],
      // createdRow: function( row, data, dataIndex ) {
      //     $(row).attr('onclick', `toggleTaskCanvas('${data._id}')`);
      // },
      columnDefs: [
        {
          targets: 0,
          render: function (data, type, full, meta) {
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
            var dateHard = convertTableDate(full.hard_deadline);
            var dateSoft = convertTableDate(full.soft_deadline);
            return `
            <div class="kt-widget5">
                <div class="kt-widget5__item">
                  <div class="kt-widget5__content">
                    <div class="kt-widget5__section"><span class="kt-widget5__title" style="font-size:1.3rem;pointer-events:none">${
                      full.title
                    }</span>
                      
                      
                      <div class="kt-widget5__info" style="padding: 0.5rem 0">
                        <span>
                        [${full._id}] WordCount :
                          <span class="kt-font-info" style="font-weight:600">${
                            full.wordcount
                          } </span>
                          <span class="kt-font-info" style="font-weight:600; display:none;">${
                            full._id
                          } </span>
                          <span class="kt-font-info" style="font-weight:600; display:none;">${
                            full.client
                          } </span>
                        </span>
                      </div>
                    </div>
                  </div>
                  
                <div class="kt-widget__action">
                              <span class="btn btn-label-success btn-sm btn-bold btn-upper">${dateSoft}</span>
                              <span class="kt-badge kt-badge--inline" style="color:#fff; font-weight:600;font-size:0.875rem; padding: 0.5rem 1rem 0.5rem 1rem; border-radius:0.2rem;background-color:${
                                taskstatus[full.status].color
                              };">${full.status}</span>
                            </div>
              </div>
            
            `;
            // return `
            //   <div class="kt-widget5">
            //     <div class="kt-widget5__item">
            //       <div class="kt-widget5__content">
            //         <div class="kt-widget5__section"><span class="kt-widget5__title" style="font-size:1.3rem;pointer-events:none">${
            //           full.title
            //         }</span>
            //           <div class="kt-widget5__info" style="padding: 0.5rem 0">
            //             <span>Id: <span class="kt-font-info" style="font-weight:600">${
            //               full._id
            //             }</span>
            //             </span>
            //           </div>
            //           <div class="kt-widget5__info" style="padding: 0.5rem 0">
            //             <span>Client: <span class="kt-font-info" style="font-weight:600">${
            //               full.client
            //             }</span>
            //             </span>
            //           </div>
            //           <div class="kt-widget5__info">
            //             <span>
            //             Created by :
            //               <span class="kt-font-info" style="font-weight:600">${
            //                 full.createdby
            //               } </span>
            //             </span>
            //           </div>
            //           <div class="kt-widget5__info" style="padding: 0.5rem 0">
            //             <span>
            //             WordCount :
            //               <span class="kt-font-info" style="font-weight:600">${
            //                 full.wordcount
            //               } </span>
            //             </span>
            //           </div>
            //           <div class="kt-widget5__info" style="padding: 0.5rem 0">
            //             <span>
            //             Status :
            //             <span class="kt-badge kt-badge--inline" style="color:#fff; font-weight:600;font-size:0.875rem;padding:0.8rem .8rem;background-color:${
            //               taskstatus[full.status].color
            //             };">${full.status}</span>
            //             </span>
            //           </div>
            //         </div>
            //       </div>
            //       <div class="kt-widget5__content">
            //         <div class="kt-widget5__stats">
            //           <span class="btn btn-label-success btn-sm btn-bold btn-upper">${dateSoft}
            //           </span>
            //           <span class="kt-font-bold kt-font-success" style="text-align:center;margin-top:0.5rem;">Soft Deadline</span>
            //         </div>
            //         <div class="kt-widget5__stats">
            //           <span class="btn btn-label-danger btn-sm btn-bold btn-upper">${dateHard}
            //           </span>
            //           <span class="kt-font-bold kt-font-danger" style="text-align:center;margin-top:0.5rem;">Hard Deadline</span>
            //         </div>
            //       </div>
            //     </div>
            //   </div>
            //   `;
          },
        },
      ],
    });

    $('#kt_datepicker').datepicker({
      todayHighlight: true,
      templates: {
        leftArrow: '<i class="la la-angle-left"></i>',
        rightArrow: '<i class="la la-angle-right"></i>',
      },
    });

    //Adding Row select to retrive row information
    $('#kt_table_3 tbody').on('click', 'tr', function () {
      var rowData = table.rows(table.row(this).index()).data()[0];
      $('#noTaskSelected').hide('fast');
      $('#taskAssignId').empty().append(rowData._id);
      $('#taskData').fadeIn('slow');
      if (
        $('#taskId').text() === rowData._id &&
        !$('#noTaskSelected').is(':visible')
      ) {
        $('#taskData').hide();
        $('#taskId').empty();
        $('#taskkey').empty().append('Task Details');
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
        getsolution(rowData._id);
        getfiles(rowData._id);
        $.ajax({
          type: 'GET',
          url: '/api/task/' + rowData._id,
          success: function (data) {
            currentTask = data.task;
            $('#taskdetails')
              .attr('href', 'task/' + data.task._id)
              .attr('target', '_blank');
            $('#taskkey').empty().append(data.task._id);
            $('#initChar').empty().append(data.task.title.charAt(0));
            $('#taskTitle').empty().append(data.task.title);
            $('#taskId').empty().append(data.task._id);
            $('#taskCreated')
              .empty()
              .append(convertTableDate(data.task.hard_deadline));
            $('#taskModified')
              .empty()
              .append(convertTableDate(data.task.soft_deadline));
            $('#taskDesc').empty().append(data.task.description);
            $('#taskamount').val(data.payment.budget);
            $('#totalpaidamount').val(data.payment.amount_paid);
            $('#selectcurrency').val(data.payment.currency);
            $('#taskcreate')
              .empty()
              .html(
                '<span class="kt-widget4__icon"><i class="flaticon2-next kt-font-danger"></i></span><a class="kt-widget4__title kt-widget4__title--light" href="#"><b>' +
                  data.task.createdby.name +
                  '</b> created this task on <b>' +
                  timesend(data.task.createdAt) +
                  '</b></a>'
              );
            if (data.payment.budget == undefined) {
              $('#budget').empty().append('N/A');
              $('#paidamount').empty().append('N/A');
            }
            if (data.task.description == undefined) {
              $('#taskDesc').empty();
            }
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
            if (data.payment.budget != undefined) {
              $('#budget')
                .empty()
                .append(data.payment.currency + ' ' + data.payment.budget);
              $('#paidamount')
                .empty()
                .append(data.payment.currency + ' ' + data.payment.amount_paid);
            }
            $('.taskstatus').empty().append(data.status.status);
            $('.taskclient')
              .empty()
              .append('<strong>Client: </strong>' + data.task.client.name);
            $('.taskbdm')
              .empty()
              .append(
                '<strong>BDM: </strong>' +
                  (data.task.client.assignedTo
                    ? data.task.client.assignedTo.name
                    : 'N/A')
              );
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
              $('#tasklogs').empty();
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
                    `<div class="kt-widget4__item"><span class="kt-widget4__icon"><i class="flaticon2-next kt-font-warning"></i></span><a class="kt-widget4__title kt-widget4__title--light" href="#"><b>
                    ${filesNames}
                    </b> file(s) were sent to <b>
                    ${data.taskcomm.tasklogs[i].assignedto.name}</b> by <b>
                    ${
                      !!data.taskcomm.tasklogs[i].assignedby
                        ? data.taskcomm.tasklogs[i].assignedby.name
                        : ''
                    }</b> on <b>
                    ${timesend(
                      data.taskcomm.tasklogs[i].assignedon
                    )}</b></a></div>`
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
            // $("#tasklogs").empty();
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
          },
          error: function (error) {
            // console.log("called")
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
    table.search($('#generalSearch').val()).draw();
  };

  return {
    //main function to initiate the module
    init: function (task, status, dateRange) {
      initTable3(task, status, dateRange);
    },
  };
})();

// Convert Date from the data recived by the API
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

// Convert Date to put it in Edit Form
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
  return `${formatted_date[2]}-${
    months.indexOf(formatted_date[1]).toString().length > 1
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

// Get Brief files of a particular Task
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
          " alt="" /></div><a class="kt-widget4__title" href="/api/solutionupload/get/taskfile/brief/${
            data[i]._id
          }" target="_blank" download data-toggle="kt-tooltip" data-original-title="${
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

// Get Solution files of a particular Task
const getsolution = (key) => {
  $.ajax({
    type: 'GET',
    url: '/api/solutionupload/' + key,
    success: function (data) {
      $('#solutionupload').empty();
      for (i = 0; i < data.length; i++) {
        $('#solutionupload').append(
          `<div class="kt-widget4__item" data-id='${data[i]._id}'>
          <label class="kt-checkbox kt-checkbox--brand">
            <input type="checkbox"><span></span>
          </label>
          <div class="kt-widget4__pic kt-widget4__pic--icon"><img src="
          ${data[i].fileUrl}
          " alt="" /></div><a class="kt-widget4__title"  href="/api/solutionupload/get/taskfile/solution/${
            data[i]._id
          }" target="_blank" download data-toggle="kt-tooltip" data-original-title="${
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

// To apply filter on TASKS based on ALL,Upcoming,Delayed,Delivered,Completed And Status Based as All,Assigned,Unassigned, Running and QC
function displayFilteredTable(urlArg, toHide, dateRange) {
  KTApp.block('#kt_table_3', {
    overlayColor: '#000000',
    type: 'v2',
    state: 'success',
    message: 'Please wait...',
  });
  $('#taskData').hide();
  $('#taskkey').empty().append('Task Details');
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
  if ($.fn.DataTable.isDataTable('#kt_table_3')) {
    $('#kt_table_3').DataTable().destroy();
  }
  $('#kt_table_3').empty();
  KTDatatablesExtensionButtons.init(urlArg, status, dateRange);
  KTBootstrapDaterangepicker.init();
  if (!dateRange) {
    $('#kt_daterangepicker_2 input').val('');
  }
  $('#taskId').text('');
  KTApp.unblock('#kt_table_3');
}

jQuery(document).ready(function () {
  $('#kt_datatable_reload').on('click', function () {
    displayFilteredTable($('#changePage').text(), $('#hideSelect').text());
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
      url: '/api/briefupload/brief/' + $('#taskId').text(),
      data: formData,
      contentType: false,
      processData: false,
      success: function (data) {
        if (data.redirect) {
          return (window.location.href = data.redirect);
        }
        getfiles($('#taskId').text());
        $('#files').val('');
        $("[for='customFile']").text('Choose file');
        toastr.success('file uploaded successfully');
        KTApp.unblock('#fileupload_portlet');
      },
      error: function (error) {
        getfiles($('#taskId').text());
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
      url: '/api/solutionupload/solution/' + $('#taskId').text(),
      data: formData,
      contentType: false,
      processData: false,
      success: function (data) {
        if (data.redirect) {
          return (window.location.href = data.redirect);
        }
        getsolution($('#taskId').text());
        $('#files1').val('');
        $("[for='customFile']").text('Choose file');
        toastr.success('file uploaded successfully');
        KTApp.unblock('#solutionupload_portlet');
      },
      error: function (error) {
        getsolution($('#taskId').text());
        toastr.error('something is wrong! Please check');
        KTApp.unblock('#solutionupload_portlet');
      },
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
        }, 1000);
      },
      error: function (err) {
        KTApp.unblock('#comment_portlet');
        let err_message = err.responseJSON.errors[0].msg;
        toastr.error(err_message);
      },
    });
  });

  $('#changePage').text('201');
  $('#hideSelect').text('false');
  $('#applyFilter').on('click', function () {
    $('#taskkey').empty().append('Task Details');
    displayFilteredTable($('#changePage').text(), $('#hideSelect').text());
  });
  KTDatatablesExtensionButtons.init('201', 'true');
});
