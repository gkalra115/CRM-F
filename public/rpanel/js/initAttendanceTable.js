'use strict';

var i = 0;
var KTDatatablesExtensionButtons = (function () {
  var initTable3 = function () {
    // begin first table
    var table = $('#kt_table_3').DataTable({
      dom: 'brltip',
      // dom: "B<'row'><'row'<'col-md-6'l><'col-md-6'f>r>t<'row'<'col-md-4'i>><'row'p>B",
      createdRow: function (row, data, dataIndex) {
        $(row).css('cursor', 'cell').attr('onclick', `toggleEmployeeCanvas(${dataIndex})`);
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
        url: '/api/attendance',
        type: 'GET',
      },
      order: [],
      columns: [
        { data: 'employeeId' },
        { data: 'timings' },
      ],
      columnDefs: [
        {
          targets: 0,
          render: function (data, type, full, meta) {
            return `<div onClick="toggleEmployeeCanvas('${data._id}','${meta.row}')">${data.name}</div>`;
          },
        },
        {
          targets: 1,
          render: function (data, type, full, meta) {
            let time, isInTime, inTime;
            let lastRecord = data[data.length - 1];
            if (data.length > 0) {
              time = `<span class="btn btn-label-${lastRecord.isInTime ? 'success' : 'danger'} btn-sm btn-bold btn-upper">${lastRecord.isInTime ? ' IN' : ' OUT'} - ${formatAMPM(lastRecord.time)}</span>`;
            } else {
              time = '<span class="btn btn-label-info btn-sm btn-bold btn-upper">N/A</span>';
            }
            return `<div>${time}</div>`;
          }
        },
      ],
    });

    $('#dateSearch').on('change', (e) => {
      //table.search(e.target.value).draw();
      // let table = $('#kt_table_3').DataTable({
      //     ajax: {
      //         url: '/api/attendance',
      //         data: {
      //             date: e.target.value
      //         }
      //     }
      // })
      table.ajax.url('/api/attendance?date=' + e.target.value).load((data) => {
        table.ajax.reload();
      });
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

    $('#kt_form_status').on('change', function () {
      var val = $(this).val().trim();
      console.log(val);
      table.column(4).search(val, true, false).draw();
    });

    $('#kt_form_role').on('change', function () {
      var val = $.fn.dataTable.util.escapeRegex($(this).val().trim());
      console.log(val);
      table.column(3).search(val, true, false).draw();
    });

    $('#kt_form_status,#kt_form_role').selectpicker();

    $('#generalSearch').keyup(function () {
      table.search($(this).val()).draw();
    });

    $('#kt_datatable_reload').on('click', function () {
      table.ajax.reload();
    });

  };

  return {
    //main function to initiate the module
    init: function () {
      initTable3();
    },
  };
})();

const formatAMPM = (date) => {
  var startTime = new Date(date);
  startTime = new Date(
    startTime.getTime() + startTime.getTimezoneOffset() * 60000
  );
  var hours = startTime.getHours();
  var minutes = startTime.getMinutes();
  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
};

jQuery(document).ready(function () {
  KTDatatablesExtensionButtons.init();
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


// try and sort it out on your own for an hour if not able to do so push it and i'll sort it out give me a status update in an hour ok sir