'use strict';
var KTDatatablesExtensionButtons = (function () {
  var now = new Date();
  var currentMonth = now.getMonth() + 1;
  var currentYear = now.getFullYear();
  var initTable3 = function () {
    // begin first table
    var table = $('#kt_table_3').DataTable({
      dom: 'brltip',
      // dom: "B<'row'><'row'<'col-md-6'l><'col-md-6'f>r>t<'row'<'col-md-4'i>><'row'p>B",
      responsive: true,
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
        url: `/bdm/task/payment/client?month=${currentMonth}&year=${currentYear}`,
        type: 'GET',
        data: {
          columnsDef: ['_id', 'title', 'wordcount','hard_deadline','client.name', 'pstatus'],
        },
      },
      columns: [
        { data: '_id' },
        { data: 'title' },
        { data:'wordcount'},
        {data: 'hard_deadline'},
        { data: 'client.name' },
        { data: 'pstatus' },
      ],
      columnDefs: [
        {
          targets: -1,
          title: 'PStatus',
          responsivePriority: -1,
          orderable: false,
          render: function (data, type, full, meta) {
            var status = {
              'N/A': { title: 'N/A', state: 'dark' },
              Unpaid: { title: 'Unpaid', state: 'danger' },
              Paid: { title: 'Paid', state: 'success' },
              Partial: { title: 'Partial', state: 'warning' },
            };
            return (
              '<span class="kt-badge kt-badge--' +
              status[data].state +
              ' kt-badge--inline">' +
              status[data].title +
              '</span>'
            );
          },
        },
        {
          targets: 0,
          responsivePriority: -1,
          orderable: false,
          render: function (data, type, full, meta) {
            return `<a href="/bd/task/${data}" style="color:#000; text-decoration:none;">${data}</a>`;
          },
        },
        {
          targets: 3,
          render: function (data, type, full, meta){
            return `${formatDate(data)}`
          }
        }
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

    $('#paid_status').on('click', function (e) {
      e.preventDefault();
      table.columns(5).search("^" +'Paid'+ "$", true, false, true).draw();
    });
    $('#unpaid_status').on('click', function (e) {
      e.preventDefault();
      table.columns(5).search("^" +'Unpaid'+ "$", true, false, true).draw();
    });
    $('#partial_status').on('click', function (e) {
      e.preventDefault();
      table.columns(5).search('Partial').draw();
    });
    $('#na_status').on('click', function (e) {
      e.preventDefault();
      table.columns(5).search('N/A').draw();
    });
    $('#kt_form_status').on('change', function () {
      table.columns(4).search($(this).val()).draw();
    });

    $('#kt_form_role').on('change', function () {
      table.columns(3).search($(this).val()).draw();
    });

    $('#kt_datatable_reload').on('click', function () {
      table.ajax.reload();
    });

    $('#kt_form_status,#kt_form_role').selectpicker();

    $('#generalSearch').keyup(function () {
      table.search($(this).val()).draw();
    });
    $('#kt_dashboard_daterangepicker_3').on(
      'hide.daterangepicker',
      (ev, picker) => {
        const date = ev.format().split('-');
        table.ajax
          .url(`/bdm/task/payment/client?month=${date[0]}&year=${date[1]}`)
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
      $('#kt_dashboard_daterangepicker_date_3').text(`EOT`);
      table.ajax.url(`/bdm/task/payment/client`).load();
    });

    
  };

  return {
    //main function to initiate the module
    init: function () {
      initTable3();
    },
  };
})();

jQuery(document).ready(function () {
  KTDatatablesExtensionButtons.init();
  daterangepickerInit();
  //   $('#kt_table_3_filter').prepend(`<label style = "
  //   margin-right: 1rem;
  //   ">Status:
  //   <select class="form-control form-control-md"
  //     style="
  //     margin-left: 0.5em;
  //     display: inline-block;
  //     width: auto;
  //     "
  //     id="kt_form_role">
  //     <option value="">All</option>
  //     <option value="1">Pending</option>
  //     <option value="2">Delivered</option>
  //     <option value="3">Canceled</option>
  //     <option value="4">Success</option>
  //     <option value="5">Info</option>
  //     <option value="6">Danger</option>
  //   </select>
  //   </label>
  //   <label style = "
  //   margin-right: 1rem;
  //   ">Status:
  //   <select class="form-control form-control-md"
  //     style="
  //     margin-left: 0.5em;
  //     display: inline-block;
  //     width: auto;
  //     "
  //     id="kt_form_status">
  //     <option value="">All</option>
  //     <option value="1">Pending</option>
  //     <option value="2">Delivered</option>
  //     <option value="3">Canceled</option>
  //     <option value="4">Success</option>
  //     <option value="5">Info</option>
  //     <option value="6">Danger</option>
  //   </select>
  //   </label>`)
});

function formatDate(dateString) {
  var date = new Date(dateString);
  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();
  var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var monthName = months[monthIndex];
  return day + ' ' + monthName + ' ' + year;
}

var daterangepickerInit = function () {

  var todayDate = new Date();
  var month = todayDate.getMonth() + 1;
  var year = todayDate.getFullYear();
  $('#kt_dashboard_daterangepicker_date_3').empty().text(` ${month}-${year}`);
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
    });
};