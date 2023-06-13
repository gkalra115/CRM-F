'use strict';

var KTDatatablesRejected = (function () {
  var initTable5 = function () {
    // begin first table
    var table = $('#kt_table_5').DataTable({
      dom: 'brltip',
      // dom: "B<'row'><'row'<'col-md-6'l><'col-md-6'f>r>t<'row'<'col-md-4'i>><'row'p>B",
      responsive: true,
      createdRow: function (row, data, dataIndex) {
        $(row).css('cursor', 'cell');
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
        url: '/client/task/rejected',
        type: 'GET',
        data: {
          // parameters for custom backend script demo
          columnsDef: ['_id', 'title', 'hard_deadline', 'createdAt'],
        },
      },
      columns: [
        { data: 'title' },
        { data: 'hard_deadline' },
        { data: 'createdAt' },
        { data: 'reqActionBy' },
      ],
      columnDefs: [
        {
          targets: [1, 2],
          render: function (data) {
            return new Date(data).toLocaleDateString();
          },
        },
        {
          targets: [3],
          render: function (data) {
            var status = {
              Rejected: { title: 'Rejected', class: 'kt-badge--danger' },
            };
            return (
              '<span class="kt-badge ' +
              status[data.actionType].class +
              ' kt-badge--inline kt-badge--pill">' +
              status[data.actionType].title +
              '</span>'
            );
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

    $('#kt_form_status').on('change', function () {
      var val = $.fn.dataTable.util.escapeRegex($(this).val());
      table
        .column(5)
        .search(val ? '^' + val + '$' : '', true, false)
        .draw();
    });

    $('#kt_datatable_reload').on('click', function () {
      table.ajax.reload();
    });

    $('#kt_form_status').selectpicker();

    $('#generalSearch').keyup(function () {
      table.search($(this).val()).draw();
    });

    //   $('#kt_table_3 tbody').on('click', 'tr', function () {
    //     var data = table.row( this ).data();
    //     toggleClientCanvas(data)
    // } );
  };
  return {
    //main function to initiate the module
    init: function () {
      initTable5();
    },
  };
})();

jQuery(document).ready(function () {
  KTDatatablesRejected.init();
});
