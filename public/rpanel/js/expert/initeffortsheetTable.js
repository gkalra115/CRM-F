"use strict";
var KTDatatablesExtensionButtons = (function () {
  var initTable3 = function () {
    // begin first table
    var date = new Date();
    var table = $("#kt_table_3").DataTable({
      dom: "brtip",
      //   dom: "B<'row'><'row'<'col-md-6'l><'col-md-6'f>r>t<'row'<'col-md-4'i>><'row'p>B",
      search: {
        regex: true,
      },
      order: [],
      select: true,
      //   dom: "B<'row'><'row'<'col-md-6'l><'col-md-6'f>r>t<'row'<'col-md-4'i>><'row'p>B",
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
      responsive: true,
      processing: true,
      searchDelay: 500,
      ajax: {
        url: `/expert/task/listeffort?month=${date.getUTCMonth() + 1}&year=${date.getUTCFullYear()}`,
        type: "GET",
        data: {
          // parameters for custom backend script demo
          columnsDef: ["taskid", "title", "achived_wordcount", "submittedon", "comments", "approved"]
        }
      },
      columns: [

        { data: "taskid" },
        { data: "title" },
        { data: "achived_wordcount" },
        { data: "submittedon" },
        { data: "comments"},
        { data: "approved" }
      ],
      columnDefs: [
        {
          targets: 0,
          render: function (data, type, full, meta) {
            if (data == undefined) {
              return `--`
            }
            else {
              return `<a href="/ex/view/${data}" style="color:#000">${data}</a>`;
            }

          }
        },
        {
          targets: 1,
          render: function (data, type, full, meta) {
            if (data == null) {
              return `--`
            }
            else {
              return data
            };
          }

        },
        {
          targets: 3,
          render: function (data, type, full, meta) {
            return formatDate(data);
          }
        },
        {
          targets: 4,
          render: function (data, type, full, meta) {
            if (data) {
              return data;
            }
            else {
              return `--`;
            };
          }

        },
        {
          targets: 5,
          render: function (data, type, full, meta) {
            if (data == true) {
              return `<button class="btn btn btn-success btn-sm">Aprroved </button>`;
            }
            else {
              return `<button class="btn btn btn-warning btn-sm">Pending </button>`;
            }
          }
        }
      ],
      footerCallback: function (row, data, start, end, display) {
        var api = this.api(),
          data;
        var total = api
          .column(2)
          .data()
          .reduce(function (a, b) {
            return a + b;
          }, 0);
        // Total over this page
        var pageTotal = api
          .column(2, {
            page: "current"
          })
          .data()
          .reduce(function (a, b) {
            return a + b;
          }, 0);
        $(api.column(4).footer()).html(
          pageTotal + " ( " + total + " total)"
        );

      }
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

    $("#kt_form_status").selectpicker();

    $("#generalSearch").keyup(function () {
      table.search($(this).val()).draw();
    });
    $('#kt_datatable_reload').on('click', function () {
      table.ajax.reload();
    });
    $('#kt_dashboard_daterangepicker_3').on(
      'hide.daterangepicker',
      (ev, picker) => {
        const date = ev.format().split('-');
        table.ajax
          .url(`/expert/task/listeffort?month=${date[0]}&year=${date[1]}`)
          .load();
      }
    );
    $('#kt_datepicker').datepicker({
      todayHighlight: true,
      templates: {
        leftArrow: '<i class="la la-angle-left"></i>',
        rightArrow: '<i class="la la-angle-right"></i>',
      },
    });
    $('#tillEot').on('click', () => {
      clientfinancestats('EOT');
      $('#kt_dashboard_daterangepicker_date_3').text(`EOT`);
      table.ajax.url(`/expert/task/listeffort`).load();
    });
  };
  return {
    //main function to initiate the module
    init: function () {
      initTable3();
    }
  };


})();


function createEffort() {
  var taskid = $('#taskidnew').val();
  var title = $('#titlenew').val();
  var achived_wordcount = $('#achived_wordcountnew').val();
  var submittedon = $('#submittedonnew').val();
  var commentforeffort = $("#commentforeffort").val();

  if (taskid == '' || title == '' || achived_wordcount == '' || submittedon == '') {
    $("#effortformerror").empty().text("Please enter all details carefully");
    KTApp.unblock('#kt_modal_4');
  }
  else {
    KTApp.block('#kt_modal_4', {
      overlayColor: '#000000',
      type: 'v2',
      state: 'success',
      message: 'Please wait...',
    });
    const data123 = {
      taskid:taskid,
      title: title,
      achived_wordcount: achived_wordcount,
      submittedon: submittedon,
      comments:commentforeffort
    }
    $.ajax({
      type: "POST",
      url: `/expert/task/effortsheet`,
      data: data123,
      success: function (data) {
        setTimeout(function () {
          $('#taskkeyerror').empty();
          $('#createEffortsheet1').trigger("reset");
          $('#kt_modal_4').modal('toggle');
          toastr.success('Effort sucessfully added');
          $('#kt_table_3').DataTable().ajax.reload();
          KTApp.unblock('#kt_modal_4');
          $('#Taskvalidated').hide();
        }, 2500)

        // ;
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {

        toastr.error(XMLHttpRequest.responseText);
        KTApp.unblock('#kt_modal_4');
        $('#createEffortsheet1').trigger("reset");
      }
    });
  }


}

$('#tillEot').on('click', () => {
  clientfinancestats('EOT');
  $('#kt_dashboard_daterangepicker_date_3').text(`EOT`);

  //table.ajax.url(`/api/task/client/${clientid}`).load();
});
jQuery(document).ready(function () {
  KTDatatablesExtensionButtons.init();
  var todayDate = new Date();
  var month = todayDate.getMonth() + 1;
  var year = todayDate.getFullYear();
  clientfinancestats(`${month}-${year}`);
  daterangepickerInit();

  $.ajax({
    type: "GET",
    url: `/expert/task/listeffort?month=${month}&year=${year}`,
    success: function (data) {
      $(".demo").hide("fast");
      $("#clientname").text(data.userdetails.name);
      $("#emprole").text(data.userdetails.role);
      $("#clientinitials").text(data.userdetails.name.charAt(0).toUpperCase())
      var emprole = data.userdetails.role;
      if (emprole == "Expert") {
        var totalwordcount = 26 * 2000;
        var totalachieved = data.stats[0].totalwordcount;
        var percentage = Math.round((totalachieved / totalwordcount) * 100) + "%"

        $(".kt-widget__stats").text(percentage);
        $("#totaltask").text(data.stats[0].totaltask);
        $("#totalwordcount").text(totalwordcount);
        $("#achivedwordcount").text(totalachieved);
        $(".progress-bar").css("width", percentage);
        $(".progress-bar").attr("aria-valuenow", percentage);
      }
      // ;
    }
  });
});
const convertTableDate = date => {

  let current_datetime = new Date(date);
  current_datetime.toDateString()
  return current_datetime;
};

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
    apiUrl = `/expert/task/listeffort`;
    $(".kt-widget__info").hide()
    $("#ttotal").hide()
  } else {
    apiUrl = `/expert/task/listeffort?month=${cMonth}&year=${cYear}`;
    $(".kt-widget__info").show()
    $("#ttotal").show()
  }
  $.ajax({
    type: 'GET',
    url: apiUrl,
    success: function (data) {
      var totalwordcount = 26 * 2000;
      var totalachieved = data.stats[0].totalwordcount;
      var percentage = Math.round((totalachieved / totalwordcount) * 100) + "%"
      $(".kt-widget__stats").text(percentage);
      $("#totaltask").text(data.stats[0].totaltask);
      $("#totalwordcount").text(totalwordcount);
      $("#achivedwordcount").text(totalachieved);
      $(".progress-bar").css("width", percentage);
      $(".progress-bar").attr("aria-valuenow", percentage);
    },
  });
};

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

function validateTask() {
  var taskid = $('#taskidnew').val()
  
  KTApp.block('#kt_modal_4', {
    overlayColor: '#000000',
    state: 'primary'
  });
  $('#validateButton').addClass('disabled');
  
  if (taskid == "") {
    $('#taskkeyerror').html("Key Validation error");
    KTApp.unblock('#kt_modal_4');
    $('#validateButton').removeClass('disabled');
  }
  else {
    $.ajax({
      type: 'GET',
      url: '/expert/task/validate/' + taskid,
      success: function (data) {      
          $('#taskkeyerror').empty();
          $("#titlenew").val(data.title);
          $('#taskidnew').attr('disabled','disabled');
          $('#Taskvalidated').slideDown("slow");
          KTApp.unblock('#kt_modal_4')
      },
      error: function (err, jqr) {
        $('#validateButton').removeClass('disabled');
        $('#taskidnew').removeAttr('disabled','disabled');
        $('#taskkeyerror').html(err.responseText)
      }
    });
  }

}

function closeModal() {
  $("#kt_modal_4").toggle("modal");
  $('#taskidnew').removeAttr('disabled','disabled');
  $('#validateButton').removeClass('disabled');
  $('#Taskvalidated').hide();
}

function formatDate(dateString) {
  var date = new Date(dateString);
  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();
  var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var monthName = months[monthIndex];
  return day + ' ' + monthName + ' ' + year;
}